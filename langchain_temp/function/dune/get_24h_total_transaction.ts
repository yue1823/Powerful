import { Tool } from "langchain/tools"
import { type AgentRuntime, parseJson } from "../.."

/**
 * Get Aptos 24h total transaction
 * @returns "Aptos 24h total  transaction is {} "
 */

export class Get_24h_total_transaction extends Tool {
    name = "get_24h_transactions"
    description = `
    This tool use to get aptos real time total transaction on 24h.when user ask to get daily total transaction ,you can use this tool
    `

    constructor(private agent: AgentRuntime) {
        super()
    }

    async _call(): Promise<string> {
        try {
            const Data = await this.agent.get_total_user_transaction()

            return JSON.stringify({
              content: Data,
            })
        } catch (error: any) {
            console.error("Error to get total transactions:", error)
            return JSON.stringify({ error: `Error to get total transactions: ${error.message}` })
        }
    }
}
