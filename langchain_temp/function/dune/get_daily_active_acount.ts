import { Tool } from "langchain/tools"
import { type AgentRuntime, } from "../.."

/**
 * Get aptos daily  active account
 * @returns "Aptos daily  active account is {} "
 */

export class Get_aptos_daily_active_account extends Tool {
    name = "get_aptos_daily_active_account"
    description = `
    This tool use to Get aptos daily  active account.
    `

    constructor(private agent: AgentRuntime) {
        super()
    }

    async _call(): Promise<string> {
        try {
            const Data = await this.agent.get_daily_active_account()
            return JSON.stringify({
                content: Data,
            })
        } catch (error: unknown) {
            console.error("Error to get tps:", error)
            return JSON.stringify({ error: `Error to get tps: ${error}` })
        }
    }
}
