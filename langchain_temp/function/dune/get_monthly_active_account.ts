import { Tool } from "langchain/tools"
import { type AgentRuntime, } from "../.."

/**
 * Get aptos daily  active account
 * @returns "Aptos daily  active account is {} "
 */



export class Get_aptos_monthly_active_account extends Tool {
  name = "get_aptos_monthly_active_account"
  description = `
    This tool use to Get aptos monthly  active account.
    `

  constructor(private agent: AgentRuntime) {
    super()
  }

  async _call(): Promise<string> {
    try {
      const data = await this.agent.get_monthly_active_account()
      if(data){
        return  JSON.stringify({
          chart: data,
        })
      }
      return ""
    } catch (error: unknown) {
      console.error("Error to get ", error)
      return "Error to get "
    }
  }
}