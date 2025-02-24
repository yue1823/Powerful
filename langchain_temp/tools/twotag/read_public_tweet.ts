import type { AgentRuntime } from "../../agent"

/**
 * read public tweet from 2tag
 * @param agent MoveAgentKit instance
 * @param nft_token_id user_account
 * @returns Transaction signature
 *
 */

interface Tweet {
	deploy_Date: number
	owner: string
	text: string
	tag: string[]
}

export async function read_public_tweet(agent: AgentRuntime, nft_token_id: string): Promise<string> {
	try {
		const transaction = await agent.aptos.view({
			payload: {
				function: "0xac314e37a527f927ee7600ac704b1ee76ff95ed4d21b0b7df1c58be8872da8f0::post::read_public_tweet",
				functionArguments: [nft_token_id],
			},
		})
		const output = transaction[0] as Tweet

		// const committedTransactionHash = await agent.account.sendTransaction(transaction)

		// const signedTransaction = await agent.aptos.waitForTransaction({
		//     transactionHash: committedTransactionHash,
		// })
		//
		// if (!signedTransaction.success) {
		//     console.error(signedTransaction, "2tag post tweet failed")
		//     throw new Error("2tag post tweet failed")
		// }

		return JSON.stringify({
			deploy_date: `deploy time : ${output.deploy_Date}`,
			owner: `owner : ${output.owner}`,
			text: `text : ${output.text}`,
			hashtag: `tag : ${output.tag}`,
		})
	} catch (error: any) {
		throw new Error(`2tag post tweet failed: ${error.message}`)
	}
}
