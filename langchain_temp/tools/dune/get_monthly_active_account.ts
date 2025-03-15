import { DuneClient } from "@duneanalytics/client-sdk";
/**
 * Get 24h aptos total transaction
 * @returns total user transaction number
 */

interface DuneQueryResultRow {
  mau: number;
  new: number;
  old: number;
  period: string; // 或 Date，如果你想解析它
  total_account: number;
  total_txs: number;
  txs: number;
}

interface DuneQueryResult {
  result: {
    rows: DuneQueryResultRow[];
  };
  execution_id: string;
  query_id: number;
  is_execution_finished: boolean;
  state: string;
  submitted_at: string;
  expires_at: string;
  execution_started_at: string;
  execution_ended_at: string;
  metadata: {
    column_names: string[];
    column_types: string[];
    row_count: number;
    result_set_bytes: number;
    total_row_count: number;
    total_result_set_bytes: number;
    datapoint_count: number;
    pending_time_millis: number;
    execution_time_millis: number;
  };
}

export async function get_monthly_active_account (): Promise<DuneQueryResultRow[] | null> {
  try {
    // console.log("i am geting user transaction")
    const dune = new DuneClient(`${process.env.DUNE_API}`);
    const query_result = await dune.getLatestResult({queryId: 4270616}) as any;
    const result=query_result as DuneQueryResult;
    //console.log("total user",query_result,result)
    if (result&& result.result && result.result.rows) {
      return result.result.rows;
    } else {
      console.warn("Dune query result is empty or missing data.");
      return null;
    }
  } catch (error: unknown) {
    throw new Error(`something error${error}` )
  }
}
