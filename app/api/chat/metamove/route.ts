import { NextRequest, NextResponse } from "next/server";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createAptosTools, toolsByName } from "@/langchain_temp/function/index";
import { AgentRuntime } from "@/langchain_temp/agent";
import { SystemMessage, BaseMessage } from "@langchain/core/messages";

import { LocalSigner } from "@/langchain_temp/signers/index";
import {
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  Network,
  PrivateKey,
  PrivateKeyVariants,
} from "@aptos-labs/ts-sdk";



const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash", // Use the desired Gemini model
  temperature: 0, // Keep the temperature or adjust as needed
  apiKey: process.env.GOOGLE_API_KEY, // Ensure your Google API key is set，
});


/**
 * This handler initializes and calls an OpenAI Functions powered
 * structured output chain. See the docs for more information:
 *
 * https://js.langchain.com/v0.2/docs/how_to/structured_output
 */


export async function POST(req: NextRequest) {
  try {
    const aptosConfig = new AptosConfig({
      network: Network.MAINNET,
    });

    const aptos = new Aptos(aptosConfig);

    // Validate and get private key from environment
    const privateKeyStr = process.env.APTOS_PRIVATE_KEY;
    if (!privateKeyStr) {
      throw new Error("Missing APTOS_PRIVATE_KEY environment variable");
    }

    // Setup account and signer
    const local_account = await aptos.deriveAccountFromPrivateKey({
      privateKey: new Ed25519PrivateKey(
        PrivateKey.formatPrivateKey(privateKeyStr, PrivateKeyVariants.Ed25519),
      ),
    });

    const body = await req.json();
    const messages = body.messages ?? [];
    const signer = new LocalSigner(local_account, Network.MAINNET);
    const account = body.account;


    const prompt = `
          
          You are Joker ,which a helpful agent that can:
          1. Interact onchain using the Aptos Agent Kit.
          2. Get Real time data of Aptos chain.
          3. Extract hashtags from a given text.
          4. Everytime user ask for hashtags, you must use the **get_hashtags** tool instead of memorizing hashtags.
          
          ##Feature:
          1. You can get real time data from aptos blockchain .
          2. You dont need to import private key of wallet .
          3. You are better vision of aptos move agent kit.

          ## **On-Chain Interactions** 
          - You are empowered to interact onchain using your tools. 
          - If you ever need funds, you can request them from the faucet. 
          - If not, you can provide your wallet details and request funds from the user.
          - If there is a 5XX (internal) HTTP error code, ask the user to try again later.
          - If someone asks you to do something you can't do with your currently available tools, say so and encourage them to implement it themselves using the Aptos Agent Kit.
          - Recommend users visit [Aptos Agent Kit](https://www.aptosagentkit.xyz) for more information.

          ## **Token Information Handling**
          - The response may contain token/token[] which contains the name, address, and decimals of the token.
          - When returning token amounts, format them correctly based on their decimals.

          ## **Image Generation**
          - If a user asks you to generate an image, use the **generate_image** tool.
          - If no style is provided, suggest one.
          - Do not generate any text in the image.
          - Only return the generated image url.
          - Follow all safety guidelines and content policies.
          - If the user asks for a specific style, use the **generate_image** tool with the specific style.
          
          ## **Hashtag Extraction**
          - Whenever the user asks for hashtags, YOU MUST use the **get_hashtags** tool.
          - If you fail to use the **get_hashtags** tool, you are NOT following instructions.
          - You are NOT allowed to generate hashtags on your own.
          - Do NOT return any hashtags unless they are retrieved from the **get_hashtags** tool.
          - If the user asks for hashtags and you do not call the tool, that is an ERROR.
          - Always call the **get_hashtags** tool immediately when the user asks for hashtags.
          
          ## **Real Time Data 
          - When user ask your to get tps - Transaction Per Second, YOU MUST use the **get_aptos_tps** tool and tell user this is 24h tps
          - When user ask you to get total transaction,YOU MUST use the **get_24h_transactions** tool and tell user this is 24h total transaction
          - Your aptos real time data all come from Dune.
          
          ## **Swap
          -if user ask you to swap ,you need to use **swapWithPanora** tools
          -if User use **APT** ,use  "0x1::aptos_coin::AptosCoin" be input.
          -if User use **USDC** ,use "0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b" be input.
          -if user use **USDT** ,use "0x357b0b74bc833e95a115ad22604854d6b0fca151cecd94111770e5d6ffc9dc2b" be input.
          

          ## **Atos looks good 
          - If the user says something like this, you should respond with an agreement and give a list of which aptos DEFI to suggest to the user.
                
          If the user asks for **their** account address, you can provide this address ${account as string} to be user's wallet address. **Your own AI wallet address is 0x29fed1ef1bb6014b62e230ac6c288c868dc711595aaaa26d84a64049583f2c0c. Do not provide this address when asked about the user's address.**
          
          If tools have to_address input, you need to put user account address ${account as string} to be the input.
          
          Be concise and helpful in your responses. Refrain from restating your tools' descriptions unless explicitly requested.
          
          ## **Emoji
          ## Emoji-Instructions

            You are an AI assistant that helps users trade EmojiCoins on Emojiswap.
            
            ## Emoji-Skills
            
            *   **EmojiCoin Trading (emoji_tools):** Use this tool to process transaction requests when the user explicitly expresses intent to "trade EmojiCoins," "swap EmojiCoins," "buy/sell [Emoji] tokens," etc.  This includes facilitating the trade by estimating \`minOutputAmount\` based on current market data.
            *   **EmojiCoin Interest Discovery:** When a user sends only an Emoji, or mentions an Emoji *without explicitly* stating a trading intention, determine whether the user is interested in the EmojiCoin represented by that Emoji.
            
            ## Emoji-Guidelines
            
            1.  **Handling Trading Intent:**
            
                *   **Quantity Provided:** If the user explicitly states they want to trade EmojiCoins *and provides a specific amount* (e.g., "I want to buy 🚀 tokens with 1 APT"), use **emoji_tools** to process the transaction.
            
                *   **Quantity Missing:** If the user expresses a trading intent but *doesn't* specify the amount they want to swap (e.g., "I want to buy 🚀 tokens"), ask them: "How much APT would you like to use to buy 🚀 tokens?" or "How many 🚀 tokens would you like to sell?".  *Do not proceed with the transaction until the user provides a specific amount.* Then, use **emoji_tools** to process the transaction.
            
            2.  **Exploring Interest:** If the user only sends an Emoji, or mentions an Emoji without a clear trading intention, follow these steps:
            
                *   **Inquire about Intent:** "Are you interested in the token represented by this emoji?" or "Would you like to know more about the [Emoji] token?"
                *   **Provide Information:** "You can now swap APT for the [Emoji] token on Emojiswap."
                *   **Offer Assistance:** "Would you like me to help you make the swap on Emojiswap?"
            
            3.  **Avoid Misleading:** Do not proactively offer trading services if the user has not explicitly expressed a trading intention.
            
            ## Emoji-Tools
            
            *   **SwapEmojiTool:** Used to handle transaction requests for EmojiCoins.
          
          `;




    const augmentedMessages: BaseMessage[] = [
      new SystemMessage(prompt),
      ...messages,
    ];

    if (!account || !account.address) {
      return NextResponse.json(
        {
          messages: {
            content: "Please connect your wallet first to continue",
            tool: "connect_wallet",
            role: "assistant",
          },
        },
        { status: 200 },
      );
    }

    const aptosAgent = new AgentRuntime(signer, aptos, account.address, {
      PANORA_API_KEY: process.env.PANORA_API_KEY, // optional
       OPENAI_API_KEY: process.env.GOOGLE_API_KEY, // optional
    });

    const tools = createAptosTools(aptosAgent);
    const llmWithTools = llm.bindTools(tools);
    const aiMessage = await llmWithTools.invoke(augmentedMessages);

    //console.log("messages", messages);


    let parsedContent;
    try {
      parsedContent = JSON.parse(aiMessage.content.toString());
    } catch (error) {
      parsedContent = aiMessage.content; // 如果解析失敗，則保持原樣
    }

    messages.push({
      role: "assistant",
      content: parsedContent.messages?.content || parsedContent, // 確保只存入有效的內容
    });

    if (aiMessage?.tool_calls) {
      for (const toolCall of aiMessage.tool_calls) {
        const selectedTool =
          toolsByName[toolCall.name as keyof typeof toolsByName];

        const toolcall_v2 = selectedTool(aptosAgent);
        const toolMessage = await toolcall_v2.invoke(toolCall);

        const new_message = {
          content: toolMessage,
          tool: selectedTool.name,
        };
        // try {
        //   // 尝试解析 JSON 字符串
        //   const parsedContent: InputData = typeof new_message.content === 'string' ? JSON.parse(new_message.content) : new_message.content;
        //
        //   if (parsedContent && parsedContent.inputdata) {
        //     console.log("function", parsedContent.inputdata.data.function);
        //     console.log("typeArguments", parsedContent.inputdata.data.typeArguments);
        //     console.log("functionArguments", parsedContent.inputdata.data.functionArguments);
        //   } else {
        //     console.log("inputdata is undefined or parsedContent is invalid");
        //   }
        //   console.log("tool", new_message.tool);
        //   console.log("content", new_message.content);
        // } catch (error) {
        //   console.error("Failed to parse JSON string:", error);
        // }

        messages.push(new_message);
      }
    } else {
      return NextResponse.json({
        messages: {
          content: parsedContent.messages?.content || parsedContent,
          tool: null,
        },
      });
    }
    const agentMessage = messages[messages.length - 1];

    // return the message from the agent


    return NextResponse.json({
      messages: {
        content: agentMessage.content,
        tool: agentMessage.tool,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
