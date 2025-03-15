import { AccountAddress } from "@aptos-labs/ts-sdk"
import { Tool } from "langchain/tools"
import { type AgentRuntime, parseJson } from "../.."

interface PackageMetadata {
  name: string;
  version: string;
  authors: string[];
  // 其他元數據字段
}

export class Publish_code_Tool extends Tool {
  name = "publish_ode"
  description = `this tool can be used to create fungible asset to a recipient

if the recipient wants to receive the token and not send to anybody else, keep to blank

  Inputs ( input is a JSON string ):
  Network:string -"Mainnet"||"Testnet"||"devnet"
  code:string
  `

  constructor(private agent: AgentRuntime) {
    super()
  }

  protected async _call(input: string): Promise<string> {
    try {
      const parsedInput = parseJson(input)


      return JSON.stringify({
        status: "success",


      })
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: error.message,
        code: error.code || "UNKNOWN_ERROR",
      })
    }
  }
}
