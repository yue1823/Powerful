import { Tool } from "langchain/tools";
import { type AgentRuntime, parseJson } from "../..";

/**
 * create a red pocket
 * @param agent MoveAgentKit instance
 * @param red_pocket_amount how many red pocket want to create
 * @param red_pocet_total how many coin you want to put in red pocket
 * @param message what message you want to put in red pocket
 * @param coin Coin metadata
 * @returns tansaction_input & key
 *
 */

export class Create_red_pocket extends Tool {
  name = "create_red_pocket";
  description = `
    This tool allows you to create a red pocket on the Aptos blockchain .
    Then,you can share the key to your friend to claim a red pocket.
  

    Inputs (input is a JSON string):
    *red_pocket_amount:number  - how many red pocket want to create
    *red_pocet_total:number -  how many coin you want to put in red pocket
    *message:String -  what message you want to put in red pocket
    *coin:String - Coin metadata eg. "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa"
    `;
  constructor(private agent: AgentRuntime) {
    super();
  }
  async _call(args: string): Promise<string> {
    let key =generateRandomKey(16);
    try {
      const parsedInput = parseJson(args);
      const transactionResult = await this.agent.create_red_pocket(parsedInput.red_pocket_amount,parsedInput.red_pocet_total,parsedInput.message,parsedInput.coin,key)
      return JSON.stringify({
        status: "success",
        inputdata:transactionResult,
        key:key
      });
    } catch (error: unknown) {
      console.error("Error creating Tweet NFT:", error);
      return JSON.stringify({ error: `Error creating Tweet NFT: ${error}` });
    }
  }
}

function generateRandomKey(length: number = 32): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}