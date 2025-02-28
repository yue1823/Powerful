
import { DuneClient } from "@duneanalytics/client-sdk";
/**
 * Get 24h aptos total transaction
 * @returns total user transaction number
 */

interface DuneQueryResultRow {
    daily_active_accounts: number;
    daily_txs: number;
    last_24h_tps: number; // 保留此欄位，即使你目前不使用它，以保持與介面的一致性
}

interface DuneQueryResult {
    result: {
        rows: DuneQueryResultRow[];
    };
}

export async function get_total_user_transaction(): Promise<string> {
    try {
        // console.log("i am geting user transaction")
        const dune = new DuneClient(`${process.env.DUNE_API}`);
        const query_result = await dune.getLatestResult({queryId: 4270662}) as any;
        const result=query_result as DuneQueryResult;
        //console.log("total user",query_result,result)

        if (
          result &&
          result.result
        ) {
            const firstRow =  result.result.rows[0] as DuneQueryResultRow;
            return`Aptos 24h total  transaction is ${firstRow.daily_txs} `
        } else {
            return `sorry i cant get aptos total user transaction , something  error `
        }
    } catch (error: unknown) {
        throw new Error(`something error${error}` )
    }
}
