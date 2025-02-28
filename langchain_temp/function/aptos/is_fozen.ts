import { Tool } from "langchain/tools"
import { type AgentRuntime, parseJson } from "../.."

export class Is_fozen extends Tool {
    name = "check_meta_is_frozen"
    description = `check the coin or fungible is frozen or not
    
      Inputs ( input is a JSON string ):
      metadata: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa" (required)
  `


    constructor(private agent: AgentRuntime) {
        super()
    }

    protected async _call(input: string): Promise<string> {
        try {
            const parsedInput = parseJson(input)

            const is_frozen = await this.agent.is_frozen(parsedInput.metadata)
            const respone = `Your coin are frozen . Do you need to know who deployed this coin? That may help you chase the funding when you are facing a scam.`;
            if(is_frozen){
                return JSON.stringify({
                    status: "success",
                    content:respone
                })
            }else{
                return JSON.stringify({
                    status: "success",
                    content:`you coin are not frozen `,
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