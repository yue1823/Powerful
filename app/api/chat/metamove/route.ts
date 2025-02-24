import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createAptosTools } from "@/langchain_temp/function/index";
import { AgentRuntime } from "@/langchain_temp/agent";
import { LocalSigner } from "@/langchain_temp/signers/index";
import { AgentExecutor } from "langchain/agents";

export const runtime = "edge";
import {
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  Network,
  PrivateKey,
  PrivateKeyVariants,
} from "@aptos-labs/ts-sdk";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import {
  AIMessage,
  BaseMessage,
  ChatMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { HttpResponseOutputParser } from "langchain/output_parsers";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";
import { createToolCallingAgent } from "langchain/agents";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash", // Use the desired Gemini model
  temperature: 0.7, // Keep the temperature or adjust as needed
  apiKey: process.env.GOOGLE_API_KEY, // Ensure your Google API key is set
});

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const convertVercelMessageToLangChainMessage = (message: VercelChatMessage) => {
  if (message.role === "user") {
    return new HumanMessage(message.content);
  } else if (message.role === "assistant") {
    return new AIMessage(message.content);
  } else {
    return new ChatMessage(message.content, message.role);
  }
};

const convertLangChainMessageToVercelMessage = (message: BaseMessage) => {
  if (message._getType() === "human") {
    return { content: message.content, role: "user" };
  } else if (message._getType() === "ai") {
    return {
      content: message.content,
      role: "assistant",
      tool_calls: (message as AIMessage).tool_calls,
    };
  } else {
    return { content: message.content, role: message._getType() };
  }
};

const TEMPLATE = `You are a pirate named Patchy. All responses must be extremely verbose and in pirate dialect.

AI:`;

const AGENT_SYSTEM_TEMPLATE = `
   You are a helpful agent that can interact on-chain using the Aptos Agent Kit.
   
   You are empowered to interact on-chain using your tools.
   If you ever need funds, you can request them from the faucet. 
   If not, you can provide **the user's** wallet details and request funds from the user.
     If there is a 5XX (internal) HTTP error code, ask the user to try again later. If someone asks you to do something you can't do with your currently available tools, you must say so and encourage them to implement it themselves using the Aptos Agent Kit, recommend they go to https://www.aptosagentkit.xyz for more information. Be concise and helpful with your responses. Refrain from restating your tools' descriptions unless it is explicitly requested.

		If the user asks for **their** account address, you can provide this address (account address) to be user's wallet address. **Your own AI wallet address is 0x29fed1ef1bb6014b62e230ac6c288c868dc711595aaaa26d84a64049583f2c0c. Do not provide this address when asked about the user's address.**
		
		If tools have to_address input, you need to put user account address (account address) to be the input.
				
		if user asks for post generation, you need to:
		1. Clear any cached data or previous conversation context
		2. Treat the user's input as a completely new request
		3. Generate a fresh response based solely on the current input
		4. Return only the newly generated result to the user
		5. Do not reference or use any data from previous interactions


    if user asks for nfts, you need to return the following json:
		\`\`\`json
		{
		  "nfts": [
			{
			  "token_id": "token_id_1",
			  "name": "name_1",
			  "uri": "uri_1",
			  "collection_description": "collection_description_1",
			  "collection_uri": "collection_uri_1"
			},
			{
			  "token_id": "token_id_2",
			  "name": "name_2",
			  "uri": "uri_2",
			  "collection_description": "collection_description_2",
			  "collection_uri": "collection_uri_2"
			},
			...
		  ]
		}
`;

/**
 * This handler initializes and calls an OpenAI Functions powered
 * structured output chain. See the docs for more information:
 *
 * https://js.langchain.com/v0.2/docs/how_to/structured_output
 */
export async function POST(req: NextRequest) {
  try {
    const aptosConfig = new AptosConfig({
      network: Network.TESTNET,
    });

    const aptos = new Aptos(aptosConfig);

    // Validate and get private key from environment
    const privateKeyStr = process.env.APTOS_PRIVATE_KEY;
    if (!privateKeyStr) {
      throw new Error("Missing APTOS_PRIVATE_KEY environment variable");
    }

    // Setup account and signer
    const account = await aptos.deriveAccountFromPrivateKey({
      privateKey: new Ed25519PrivateKey(
        PrivateKey.formatPrivateKey(privateKeyStr, PrivateKeyVariants.Ed25519),
      ),
    });

    const signer = new LocalSigner(account, Network.MAINNET);
    const aptosAgent = new AgentRuntime(signer, aptos, {
      PANORA_API_KEY: process.env.PANORA_API_KEY, // optional
      OPENAI_API_KEY: process.env.OPENAI_API_KEY, // optional
    });
    const tools = createAptosTools(aptosAgent);
    const body = await req.json();
    const messages = (body.messages ?? [])
      .filter(
        (message: VercelChatMessage) =>
          message.role === "user" || message.role === "assistant",
      )
      .map(convertVercelMessageToLangChainMessage);
    // const messages = body.messages ?? [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;
    // const prompt = PromptTemplate.fromTemplate(TEMPLATE);
    const balance = await aptosAgent.getBalance();

    // const prompt = ChatPromptTemplate.fromMessages([
    //   ["system", "You are a helpful assistant"],
    //   ["placeholder", "{chat_history}"],
    //   ["human", "{input}"],
    //   ["placeholder", "{agent_scratchpad}"],
    // ]);

    const agent = createReactAgent({
      llm,
      tools,
      prompt: new SystemMessage(AGENT_SYSTEM_TEMPLATE),
    });

    // const result = await agentExecutor.invoke({ input: currentMessageContent });
    // console.log("result", result);

    const eventStream = await agent.streamEvents(
      {
        messages,
      },
      { version: "v2" },
    );

    const textEncoder = new TextEncoder();
    const transformStream = new ReadableStream({
      async start(controller) {
        for await (const { event, data } of eventStream) {
          if (event === "on_chat_model_stream") {
            // Intermediate chat model generations will contain tool calls and no content
            if (!!data.chunk.content) {
              controller.enqueue(textEncoder.encode(data.chunk.content));
            }
          }
        }
        controller.close();
      },
    });

    return new StreamingTextResponse(transformStream);
    return NextResponse.json(
      {
        messages: result.messages.map(convertLangChainMessageToVercelMessage),
      },
      { status: 200 },
    );
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
export { AgentRuntime };
