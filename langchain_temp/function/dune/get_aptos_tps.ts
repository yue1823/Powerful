import { Tool } from "langchain/tools"
import { type AgentRuntime, } from "../.."

/**
 * Get aptos tps
 * @returns "Aptos tps is {} "
 */

export class Get_aptos_tps extends Tool {
    name = "get_aptos_tps"
    description = `
    This tool use to get aptos real time tps.
    `

    constructor(private agent: AgentRuntime) {
        super()
    }

    async _call(): Promise<string> {
        try {
            const Data = await this.agent.get_aptos_tps()
            return JSON.stringify({
                content: Data,
            })
        } catch (error: unknown) {
            console.error("Error to get tps:", error)
            return JSON.stringify({ error: `Error to get tps: ${error}` })
        }
    }
}
