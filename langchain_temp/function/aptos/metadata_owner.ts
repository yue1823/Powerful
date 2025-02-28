import { Tool } from "langchain/tools"
import { type AgentRuntime, parseJson } from "../.."


export class Metadata_owner extends Tool {
    name = "check_metadata_owner"
    description = `
    check the  fungible asset owner , it may help you to chasing the developer address when the dev got rug ,
    will return the owner of this metadata ,it will be a good start point to chasing the funding.it will return the deployer of this metadata.
    if user ask their wallet is frozen before , use that coin address to be the metadata input .
    
      Inputs ( input is a JSON string ):
      metadata: string, eg "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa" (required)
  `


    constructor(private agent: AgentRuntime) {
        super()
    }

    protected async _call(input: string): Promise<string> {
        try {
            const parsedInput = parseJson(input)

            const owner_addreess = await this.agent.chasing_metadata_owner(parsedInput.metadata)

            return JSON.stringify({
                status: "success",
                content:`this is the owner address ${owner_addreess} , hope you funding are safe ,if not you can chasing the funding use this to be start point `,
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