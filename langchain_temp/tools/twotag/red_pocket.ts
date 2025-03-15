import type { AgentRuntime } from "../../agent"
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

/**
 * create a red pocket
 * @param agent MoveAgentKit instance
 * @param red_pocket_amount how many red pocket want to create
 * @param red_pocet_total how many coin you want to put in red pocket
 * @param message what message you want to put in red pocket
 * @param coin Coin metadata
 * @param key key of red_pocket
 * @returns tansaction_input & key
 *
 */

export async function create_red_pocket(agent: AgentRuntime,red_pocket_amount:number,red_pocet_total:number,message:string,coin:string,key:string): Promise<InputTransactionData> {
  try {
    const nowUnixTimestamp = Math.floor(Date.now() / 1000);
    const twentyFourHoursInSeconds = 24 * 60 * 60 * 2 ;
    const twentyFourHoursLaterUnixTimestamp = nowUnixTimestamp + twentyFourHoursInSeconds;
    let fungible_assstet =coin.split("::").length !== 3;
    if(fungible_assstet){
      return {data: {
          function: "0xeb05737cc1f4f8284bdd65317c472eedb8cc772def27b816ee837fe4f946d7b0::red_pocket::create_red_pocket_FA_v2",
          functionArguments: [twentyFourHoursLaterUnixTimestamp,message,red_pocket_amount,red_pocet_total*100000000,coin,key],
        }}
    }else{
      return {data: {
          function: "0xeb05737cc1f4f8284bdd65317c472eedb8cc772def27b816ee837fe4f946d7b0::red_pocket::create_red_pocket_CO_v2",
          functionArguments: [twentyFourHoursLaterUnixTimestamp,message,red_pocket_amount,red_pocet_total*100000000,key],
          typeArguments:[coin]
        }}
    }
  } catch (error: any) {
    throw new Error(`2tag post tweet failed: ${error.message}`)
  }
}
