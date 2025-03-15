
import { Tool } from "langchain/tools"
import { type AgentRuntime, parseJson } from "../.."
import { getMarketAddress, toCoinTypesForEntry } from "@econia-labs/emojicoin-sdk";


export class SwapEmojiTool extends Tool {
  name = "swap_emojicoin"
  description = `this tool can be used to swap emoji coin

    Inputs ( input is a JSON string ):
    emoji_input:SymbolEmoji[]  example:["🃏","🪙"]
    input_amount:number (required)
    is_sell: boolean, // Buy = false , sales =true, 
    `

  constructor(private agent: AgentRuntime) {
    super()
  }

  protected async _call(input: string): Promise<string> {

    try {
      const parsedInput = parseJson(input)
      console.log("api emoji",parsedInput.emoji_input)
      const marketAddress = getMarketAddress(parsedInput.emoji_input);
      console.log("market address = ",marketAddress.toString())


      // let coin_1_name = this.agent.aptos.getAccountCoinAmount({
      //   accountAddress:this.agent.to_address,
      //   coinType:[typeTags[0]]
      // })

      const options = {
        method: 'GET',
        headers: {accept: 'application/json', 'X-API-KEY': `${process.env.NODIT_API}`}
      };
      const resources_struct ="0xface729284ae5729100b3a9ad7f7cc025ea09739cd6e7252aff0beb53619cafe::emojicoin_dot_fun::Market";
      let out=await fetch(`https://aptos-mainnet.nodit.io/v1/accounts/${marketAddress.toString()}/resource/${resources_struct}`, options)
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(async data => {
          console.log("nodit :",data)
          const typeTags = toCoinTypesForEntry(marketAddress);
          // 提取 clamm_virtual_reserves
          // 提取 clamm_virtual_reserves
          const clamm_base = parseFloat(data.data.clamm_virtual_reserves.base);
          const clamm_quote = parseFloat(data.data.clamm_virtual_reserves.quote);
          const cpamm_base = parseFloat(data.data.cpamm_real_reserves.base);
          const cpamm_quote = parseFloat(data.data.cpamm_real_reserves.quote);

          let priceEmojicoinPerApt: number;
          let priceAptPerEmojicoin: number;

          // 優先使用 clamm_virtual_reserves
          if (clamm_base > 0 && clamm_quote > 0) {
            priceEmojicoinPerApt = clamm_base / clamm_quote;
            priceAptPerEmojicoin = clamm_quote / clamm_base;
          } else if (cpamm_base > 0 && cpamm_quote > 0) {
            // 如果 clamm_virtual_reserves 為 0，則使用 cpamm_real_reserves
            priceEmojicoinPerApt = cpamm_base / cpamm_quote;
            priceAptPerEmojicoin = cpamm_quote / cpamm_base;
          } else {
            // 如果都為 0，則返回錯誤訊息
            return JSON.stringify({
              status: "error",
              message: "流動性不足，無法計算價格",
            });
          }


          const symbol_r = await this.agent.aptos.view({
            payload:{
              function:"0x1::coin::symbol",
              typeArguments:[`${marketAddress.toString()}::coin_factory::Emojicoin`]
            }
          })

          const slippageTolerance = 0.0526;
          const precision = 100000000;

          if (parsedInput.is_sell) {
            const displayPrice = priceAptPerEmojicoin;
            const slippagePrice = Math.floor(displayPrice * (1 -0.0526) * 100000000);

            // @ts-ignore
            //const emojiswap_input = await this.agent.swap_emoji(type_input, marketAddress.toString(), parsedInput.input_amount, parsedInput.is_sell, slippagePrice)
            return JSON.stringify({
              status: "success",
              emoji:{
                market_address:marketAddress.toString(),
                is_sell:parsedInput.is_sell,
                input_amount:parsedInput.input_amount *100000000,
                min_output: slippagePrice,
                symbol: String(symbol_r[0])
              },
            })
          } else {
            const displayPrice = priceEmojicoinPerApt;
            //const slippagePrice = Math.floor(displayPrice * (1 - 0.0526) * 100000000);
            const minAcceptablePrice = displayPrice * (1 + slippageTolerance);
            const minTokensReceived = Math.floor((parsedInput.input_amount*100000000) / minAcceptablePrice);
            //const type_input = [...typeTags];
            //const emojiswap_input = await this.agent.swap_emoji(type_input, marketAddress.toString(), parsedInput.input_amount, parsedInput.is_sell, slippagePrice)
            return JSON.stringify({
              status: "success",
              emoji:{
                market_address:marketAddress.toString(),
                is_sell:parsedInput.is_sell,
                input_amount:parsedInput.input_amount *100000000,
                min_output:minTokensReceived,
                symbol: String(symbol_r[0])
              },
            })
          }
        })
        .catch(err => console.error(err));
      if( typeof  out == "string"){
        return out
      }else{
        return JSON.stringify({
          status: "success",
          content:"Sorry something error"
        })
      }
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: error.message,
        code: error.code || "UNKNOWN_ERROR",
      })
    }
  }
}
