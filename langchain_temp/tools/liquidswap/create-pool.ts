import type { MoveStructId } from "@aptos-labs/ts-sdk"
import type { AgentRuntime } from "../../agent"
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

/**
 * Create a new pool in liquidswap
 * @param agent MoveAgentKit instance
 * @param mintX MoveStructId of the first token
 * @param mintY MoveStructId of the second token
 * @returns Transaction signature
 */
export async function createPool(agent: AgentRuntime, mintX: MoveStructId, mintY: MoveStructId): Promise<InputTransactionData> {
	try {
		return { data: {
				function: "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::scripts_v2::register_pool",
				typeArguments: [
					mintX,
					mintY,
					"0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::curves::Uncorrelated",
				],
				functionArguments: [],
			}}
	} catch (error: any) {
		throw new Error(`Create pool failed: ${error.message}`)
	}
}
