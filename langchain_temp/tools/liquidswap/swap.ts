import { type MoveStructId, convertAmountFromHumanReadableToOnChain } from "@aptos-labs/ts-sdk"
import type { AgentRuntime } from "../../agent"
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

/**
 * Swap tokens in liquidswap
 * @param agent MoveAgentKit instance
 * @param mintX MoveStructId of the token to swap from
 * @param mintY MoveStructId of the token to swap to
 * @param swapAmount Amount of tokens to swap
 * @param minCoinOut Minimum amount of tokens to receive (default 0)
 * @returns Transaction signature
 */
export async function swap(
	agent: AgentRuntime,
	mintX: MoveStructId,
	mintY: MoveStructId,
	swapAmount: number,
	minCoinOut = 0
): Promise<InputTransactionData> {
	try {

		return {data: {
				function: "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::scripts_v2::swap",
				typeArguments: [
					mintX,
					mintY,
					"0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::curves::Uncorrelated",
				],
				functionArguments: [swapAmount, minCoinOut],
			}}
	} catch (error: any) {
		throw new Error(`Swap failed: ${error.message}`)
	}
}
