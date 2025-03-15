import { convertAmountFromHumanReadableToOnChain } from "@aptos-labs/ts-sdk"
import { Tool } from "langchain/tools"
import { type AgentRuntime, parseJson } from "../.."

export class EchoStakeTokenTool extends Tool {
	name = "echo_stake_token"
	description = `this tool can be used to stake token in Echo

    Inputs ( input is a JSON string ):
    amount: number, eg 1 or 0.01 (required)
    `

	constructor(private agent: AgentRuntime) {
		super()
	}

	protected async _call(input: string): Promise<string> {
		try {
			const parsedInput = parseJson(input)

			const stakeTransactionHash = await this.agent.stakeTokenWithEcho(
				convertAmountFromHumanReadableToOnChain(parsedInput.amount, 8)
			)

			return JSON.stringify({
				status: "success",
				inputdata:stakeTransactionHash,
				token: {
					name: "eAPT",
					decimals: 8,
				},
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
