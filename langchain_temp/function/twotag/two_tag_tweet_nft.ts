import { Tool } from "langchain/tools";
import { type AgentRuntime, parseJson } from "../..";

/**
 * post a tweet and mint an nft on 2tag
 * @returns Transaction signature
 */

export class TweetNFTTool extends Tool {
  name = "two_tag_tweet_nft";
  description = `
	This tool generates a tweet post with relevant hashtags and an AI-generated image based on user-provided keywords. The tweet and image will be minted as an NFT on the Aptos blockchain.

	The tool takes a keyword or topic as input and:
	1. Generates a catchy tweet incorporating trending hashtags related to the topic
	2. Creates an AI-generated image that matches the tweet content with 
	3. Mints the tweet and image as an NFT
	4. Returns a JSON object containing:
		transaction: string (transaction hash),
		image: string (generated image URL),
		tweet_text: string (the generated tweet)

	Input should be a string describing the topic you want to tweet about.

	Example input:
	"bitcoin"
	"web3 development"
	"nft art"
	`;

  constructor(private agent: AgentRuntime) {
    super();
  }

  async _call(keywords: string): Promise<{
    transactionHash: string;
    image: string;
    tweet: string;
  }> {
    try {
      const transactionResult = await this.agent.two_tag_tweet_nft(keywords);
      return {
        transactionHash: transactionResult.transaction, // Include transaction hash for verification
        image: transactionResult.image,
        tweet: transactionResult.tweet_text,
      };
    } catch (error: any) {
      console.error("Error creating Tweet NFT:", error);
      return {
        transactionHash: "",
        image: "",
        tweet: "",
      };
    }
  }
}
