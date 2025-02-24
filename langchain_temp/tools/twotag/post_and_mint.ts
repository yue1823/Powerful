import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import type { AgentRuntime } from "../../agent";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
/**
 * post a tweet and mint an nft on 2tag
 * @param account user_account
 * @returns Transaction signature
 *
 */

const tweetSchema = z.object({
  hashtags: z.array(z.string()),
  image_url: z.string(),
  tweet_text: z.string(),
  transaction_hash: z.string(),
});

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash", // Use the desired Gemini model
  temperature: 0.7, // Keep the temperature or adjust as needed
  apiKey: process.env.GOOLE_API_KEY, // Ensure your Google API key is set
});

async function generateTweet(
  llm: ChatGoogleGenerativeAI,
  hashtags: string[],
): Promise<string> {
  try {
    const prompt = `Please create an engaging tweet related to Web3 and crypto, specifically expressing a positive outlook on the future of Aptos and Move. Base the tweet on the following hashtags, ensuring that all hashtags are included and only output the tweet text, without any other meaningless prefixes, suffixes, or explanations: ${hashtags.join(" ")}`;
    const result = await llm.call([prompt]);

    return result.content.toString();
  } catch (error) {
    console.error("Error generating tweet:", error);
    throw new Error("Failed to generate tweet.");
  }
}

export async function two_tag_tweet(
  agent: AgentRuntime,
  account: string,
): Promise<{ transaction: string; image: string; tweet_text: string }> {
  try {
    if (account != null) {
      //const externalApiResponse = await fetch("YOUR_EXTERNAL_API_ENDPOINT");
      //const externalApiData = await externalApiResponse.json();

      // const hashtagsResponse = await fetch("https://essaa-creatolens-cdr-media-service-sit-y7nazd37ga-df.a.run.app/api/metamove/hashtags", {
      // 	method: "POST",
      // 	body: JSON.stringify({
      // 		user_id: "web3/" + account,
      // 	}),
      // })

      const hashtags = ["#hackathon", "#Aptos", "#Meta Move", "#Bullish"];
      console.log("account", account);

      const response = await fetch(
        "https://essaa-creatolens-cdr-media-service-sit-y7nazd37ga-df.a.run.app/api/metamove/image/prompt",
        {
          method: "POST",
          body: JSON.stringify({
            prompt: hashtags.join(" "),
            aspect_ratio: "4:3",
            negative_prompt: "no text, no watermark, no logo",
            user_id: "web3/" + account,
          }),
        },
      );

      const imageUrl = (await response.json()).image_url;

      console.log("imageUrl", imageUrl);

      const tweetContent = await generateTweet(llm, hashtags);
      // console.log("tweetContent:", tweetContent);

      const output = tweetContent + imageUrl;

      const transaction = await agent.aptos.transaction.build.simple({
        sender: agent.account.getAddress(),
        data: {
          function:
            "0xac314e37a527f927ee7600ac704b1ee76ff95ed4d21b0b7df1c58be8872da8f0::post::tweet",
          functionArguments: [hashtags, tweetContent, account, imageUrl],
        },
      });

      const committedTransactionHash =
        await agent.account.sendTransaction(transaction);

      const signedTransaction = await agent.aptos.waitForTransaction({
        transactionHash: committedTransactionHash,
      });

      if (!signedTransaction.success) {
        console.error(signedTransaction, "2tag post tweet failed");
        throw new Error("2tag post tweet failed");
      } else {
        console.log("2tag post tweet success");
      }

      return {
        transaction: signedTransaction.hash,
        image: imageUrl,
        tweet_text: tweetContent,
      };
    }
    return {
      transaction: "",
      image: "",
      tweet_text: "",
    };
  } catch (error: unknown) {
    throw new Error(`2tag post tweet failed: ${error}`);
  }
}
