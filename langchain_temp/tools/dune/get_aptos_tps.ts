import { DuneClient } from "@duneanalytics/client-sdk";

/**
 * Get aptos TPS
 * @returns Tps
 */
export async function get_aptos_tps(retries: number = 3): Promise<string> {
    try {
        const dune = new DuneClient(`${process.env.DUNE_API}`);
        const query_result = await dune.getLatestResult({ queryId: 4270662 });

        if (query_result.result && query_result.result.rows) {
            const firstRow = query_result.result.rows[0] as {
                last_24h_tps: string;
            };
            return`Aptos 24h real time tps is ${firstRow.last_24h_tps}`;
        } else {
            return  `sorry i cant get aptos tps , somthing   error `;
        }
    } catch (error: any) {
        if (error.message.includes("Status: 402") && retries > 0) {
            console.warn(`Dune API rate limited. Retrying in 5 seconds... (Retries left: ${retries})`);
            await new Promise((resolve) => setTimeout(resolve, 5000)); // 等待 5 秒
            return get_aptos_tps(retries - 1); // 递归调用，减少重试次数
        }
        throw new Error(`something error${error}`);
    }
}