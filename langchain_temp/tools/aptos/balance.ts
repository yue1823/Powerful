import { type MoveStructId, convertAmountFromOnChainToHumanReadable } from "@aptos-labs/ts-sdk"
import type { AgentRuntime } from "../../agent"
import { useWallet } from "@aptos-labs/wallet-adapter-react";

/**
 * Fetches balance of an aptos account
 * @param agent MoveAgentKit instance
 * @returns Transaction signature
 * @example
 * ```ts
 * const balance = await getBalance(agent)
 * ```
 */
export async function getBalance(agent: AgentRuntime, mint?: string | MoveStructId): Promise<number> {

	// eslint-disable-next-line react-hooks/rules-of-hooks

	try {
		if (mint) {
			let balance: number
			if (mint.split("::").length !== 3) {
				const balances = await agent.aptos.getCurrentFungibleAssetBalances({
					options: {
						where: {
							owner_address: {
								_eq: agent.to_address,
							},
							asset_type: { _eq: mint },
						},
					},
				})

				balance = balances[0].amount ?? 0
			} else {
				balance = await agent.aptos.getAccountCoinAmount({
					accountAddress: agent.to_address,
					coinType: mint as MoveStructId,
				})
			}
			return balance
		}
		const balance = await agent.aptos.getAccountAPTAmount({
			accountAddress: agent.to_address,
		})

		const convertedBalance = convertAmountFromOnChainToHumanReadable(balance, 8)

		return convertedBalance
	} catch (error: any) {
		throw new Error(`Token transfer failed: ${error.message}`)
	}
}
