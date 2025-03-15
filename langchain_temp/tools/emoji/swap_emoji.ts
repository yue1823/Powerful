
import type { AgentRuntime } from "../../agent"
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { TypeTag } from "@aptos-labs/ts-sdk";

/**
 * Borrow APT, tokens or fungible asset from a position
 * @param agent MoveAgentKit instance
 * @param coin_type_address swap_in coin type address
 * @param market_address market address
 * @param input_amount amount of coin you want to swap
 * @param is_sell is sell
 * @param output_amount expected output
 * @returns Transactioninput
 * @example
 * ```ts
 * const transactionHash = await borrowToken(agent, amount, APTOS_COIN, positionId); // For APT
 * const otherTransactionHash = await borrowToken(agent, amount, OTHER_TOKEN, positionId); // For another token
 * const fungibleAssetTransactionHash = await borrowToken(agent, amount, APTOS_COIN, positionId, fungibleAssetAddress); // For fungible asset
 */
export async function swap_emoji(
  agent: AgentRuntime,
  coin_type_address:TypeTag[],
  market_address:string,
  input_amount:number,
  is_sell:boolean,
  output_amount:number,
): Promise<InputTransactionData> {



  const Inputtransactiondata: InputTransactionData={data: {
      function: "0xbabe32dbe1cb44c30363894da9f49957d6e2b94a06f2fc5c20a9d1b9e54cface::emojicoin_dot_fun_rewards::swap_with_rewards",
      typeArguments: coin_type_address,
      functionArguments:[market_address,input_amount*100000000,is_sell,output_amount],
    }}


  try {
    return Inputtransactiondata
  } catch (error: any) {
    throw new Error(`Token borrow failed: ${error.message}`)
  }
}
