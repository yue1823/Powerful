import { Tool } from "langchain/tools"
import { type AgentRuntime, } from "../.."

/**
 * Get aptos monthly transaction
 * @returns null
 */

export class Get_aptos_monthly_transaction extends Tool {
  name = "get_aptos_monthly_transaction"
  description = `
    This tool use to Get aptos  monthly transaction.
    `

  constructor(private agent: AgentRuntime) {
    super()
  }

  async _call(): Promise<string> {
    try {
      const Data = await this.agent.get_monthly_transaction()
      return JSON.stringify({
        content: Data,
      })
    } catch (error: unknown) {
      console.error("Error to get tps:", error)
      return JSON.stringify({ error: `Error to get tps: ${error}` })
    }
  }
}