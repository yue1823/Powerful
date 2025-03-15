import { Tool } from "langchain/tools"
import { type AgentRuntime, } from "../.."
import { get_aptos_transaction_success_rate } from "@/langchain_temp/tools";

/**
 * Get aptos transaction_success_rate
 * @returns null
 */

export class Get_aptos_transaction_success_rate extends Tool {
  name = "get_aptos_transaction_success_rate"
  description = `
    This tool use to Get aptos transaction success rate.
    `

  constructor(private agent: AgentRuntime) {
    super()
  }

  async _call(): Promise<string> {
    try {
      const Data = await this.agent.get_aptos_transaction_success_rate()
      return JSON.stringify({
        content: Data,
      })
    } catch (error: unknown) {
      console.error("Error to get tps:", error)
      return JSON.stringify({ error: `Error to get tps: ${error}` })
    }
  }
}