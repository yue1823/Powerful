import { Tool } from "langchain/tools"
import { type AgentRuntime, parseJson } from "../.."

export class Analytics_address_Tool extends Tool {
  name = "analytics_address"
  description = `Get the balance of a Aptos account.

  This tool is used to analyze address activity and will return the 5 most recent transactions and mark some verified coins and modules. Although still not perfect to show all states


  Inputs ( input is a JSON string ):
  address: string, eg "0x357b0b74bc833e95a115ad22604854d6b0fca151cecd94111770e5d6ffc9dc2b" (required)`

  constructor(private agent: AgentRuntime) {
    super()
  }

  protected async _call(input: string): Promise<string> {
    try {
      const parsedInput = parseJson(input)
      const address = parsedInput.address  ;

      const output = await this.agent.analytics_address(address)
      //console.log("fetch user data =",output)
      return JSON.stringify({
        status: "success",
        analytics_data:output
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
