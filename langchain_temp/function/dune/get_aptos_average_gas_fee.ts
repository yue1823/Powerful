import { Tool } from "langchain/tools"
import { type AgentRuntime, } from "../.."


/**
 * Get aptos average_gas_fee
 * @returns null
 */

export class Get_aptos_average_gas_fee extends Tool {
  name = "get_aptos_average_gas_fee"
  description = `
    This tool use to Get aptos average  gas fee.
    `

  constructor(private agent: AgentRuntime) {
    super()
  }

  async _call(): Promise<string> {
    try {
      const Data = await this.agent.get_aptos_average_gas_fee()
      return JSON.stringify({
        content: Data,
      })
    } catch (error: unknown) {
      console.error("Error to get tps:", error)
      return JSON.stringify({ error: `Error to get tps: ${error}` })
    }
  }
}