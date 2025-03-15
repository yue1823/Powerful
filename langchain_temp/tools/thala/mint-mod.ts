import type { MoveStructId } from "@aptos-labs/ts-sdk"
import type { AgentRuntime } from "../../agent"
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

/**
 * Mint Move Dollar in Thala
 * @param agent MoveAgentKit instance
 * @param mintType Type of coin to mint MOD with
 * @param amount Amount to mint
 * @returns Transaction signature
 */
export async function mintMODWithThala(agent: AgentRuntime, mintType: MoveStructId, amount: number): Promise<InputTransactionData> {
	try {
		const transaction = await agent.aptos.transaction.build.simple({
			sender: agent.account.getAddress(),
			data: {
				function: "0x6f986d146e4a90b828d8c12c14b6f4e003fdff11a8eecceceb63744363eaac01::psm_scripts::mint",
				typeArguments: [mintType],
				functionArguments: [amount],
			},
		})

		const committedTransactionHash = await agent.account.sendTransaction(transaction)

		const signedTransaction = await agent.aptos.waitForTransaction({
			transactionHash: committedTransactionHash,
		})

		if (!signedTransaction.success) {
			console.error(signedTransaction, "Mint MOD failed")
			throw new Error("Mint MOD failed")
		}

		return {data: {
				function: "0x6f986d146e4a90b828d8c12c14b6f4e003fdff11a8eecceceb63744363eaac01::psm_scripts::mint",
				typeArguments: [mintType],
				functionArguments: [amount],
			}}
	} catch (error: any) {
		throw new Error(`Mint MOD failed: ${error.message}`)
	}
}
