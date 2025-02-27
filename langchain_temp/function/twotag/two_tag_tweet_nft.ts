import { Tool } from "langchain/tools";
import { type AgentRuntime, parseJson } from "../..";

/**
 * post a tweet and mint an nft on 2tag
 * @returns Transaction signature
 */

export class TweetNFTTool extends Tool {
  name = "two_tag_tweet_nft";
  description = `
        WHEN TO USE:
        - Use this tool when the user wants to create/generate a tweet or social media post
        - Use this tool when you need to access the user's TwoTag Tweet NFT collection
        
        DO NOT USE:
        - Do NOT use this tool when the user only asks for hashtag suggestions
        
        FUNCTIONALITY:
        - Creates a tweet with AI-generated image and mints it as an NFT
        - Returns transaction hash, image URL and tweet text
        
        Input: Keywords or topic to create tweet about (string)
        Output: JSON object containing:
          - transaction: string (transaction hash)
          - image: string (generated image URL) 
          - tweet_text: string (the generated tweet)

        Example inputs:
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
