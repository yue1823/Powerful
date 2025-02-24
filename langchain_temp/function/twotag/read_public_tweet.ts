import { Tool } from "langchain/tools";
import { type AgentRuntime, parseJson } from "../..";

/**
 * post a tweet and mint an nft on 2tag
 * @param agent MoveAgentKit instance
 * @param nft_token_id nft token id
 * @returns Transaction signature
 *
 */

export class Read_public_tweet extends Tool {
  name = "read_public_tweet";
  description = `
    This tool allows you to read a public Tweet on the Aptos blockchain .

    It takes an nft token id as input. The function then return the details about the tweet.

    Inputs (input is a JSON string):
    nft_token_id: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa" (required) . This will be return  stored as part of the tweet's metadata.
    `;
  constructor(private agent: AgentRuntime) {
    super();
  }
  async _call(args: string): Promise<string> {
    try {
      const parsedInput = parseJson(args);
      const transactionResult = await this.agent.read_public_tweet(
        parsedInput.nft_token_id,
      );
      return transactionResult;
    } catch (error: unknown) {
      console.error("Error creating Tweet NFT:", error);
      return JSON.stringify({ error: `Error creating Tweet NFT: ${error}` });
    }
  }
}
