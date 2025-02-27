import { Tool } from "langchain/tools";
import { type AgentRuntime } from "../../agent";

/**
 * get user address 2tag nft
 * @returns string[] - nft token id []
 */

export class GetTwotagNFT extends Tool {
  name = "get_twotag_tweet";
  description = `
    This tool retrieves the TwoTag Tweet collection NFTs owned by the user. 
	It fetches the token ID, URL, and description of each NFT in their wallet.  
	This tool does not require any input.
    `;

  constructor(private agent: AgentRuntime) {
    super();
  }

  async _call(): Promise<string> {
    try {
      const nftData = await this.agent.get_twotag_nft();

      return JSON.stringify({
        nfts: nftData,
      });
    } catch (error: any) {
      console.error("Error retrieving Tweet NFTs:", error);
      return JSON.stringify({
        error: `Error retrieving Tweet NFTs: ${error.message}`,
      });
    }
  }
}
