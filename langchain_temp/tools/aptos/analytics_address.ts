import { type MoveStructId, convertAmountFromOnChainToHumanReadable } from "@aptos-labs/ts-sdk"
import type { AgentRuntime } from "../../agent"


/**
 * Fetches address data and use to analytics
 * @param agent MoveAgentKit instance
 * @param address MoveAgentKit instance
 * @returns json

 */

interface Fetch_data {
  module: string;
  function: string;
  timestamp:number;
  to_address?: string;
  change?: {
    coin_1: string;
    amount_change_c1: number; // 正數表示增加，負數表示減少
    coin_2?: string;
    amount_change_c2?: number; // 正數表示增加，負數表示減少
  };
}
interface CoinStoreData<CoinType> {
  coin: Coin;
  deposit_events: {
    counter: string;
    guid: {
      id: {
        addr: string;
        creation_num: string;
      };
    };
  };
  frozen: boolean;
  withdraw_events: {
    counter: string;
    guid: {
      id: {
        addr: string;
        creation_num: string;
      };
    };
  };
}

interface CoinStoreChange {
  address: string;
  state_key_hash: string;
  data: {
    type: string;
    data: CoinStoreData<any>;
  };
  type: string;
}

interface Change {
  address: string;
  state_key_hash: string;
  data: any; // 更精確的 type 應根據 resource type 定義
  type: string;
}
interface Event {
  guid: {
    creation_number: string;
    address: string;
  };
  sequence_number: string;
  type: string;
  data: any;
}

interface Transaction {
  version: string;
  hash: string;
  state_change_hash: string;
  event_root_hash: string;
  state_checkpoint_hash: string | null;
  gas_used: string;
  success: boolean;
  vm_status: string;
  accumulator_root_hash: string;
  changes: Change[];
  sender: string;
  sequence_number: string;
  max_gas_amount: string;
  gas_unit_price: string;
  expiration_timestamp_secs: string;
  payload: {
    function: string;
    type_arguments: any[];
    arguments: any[];
    type: string;
  };
  signature: any;
  events: Event[];
  timestamp: string;
  type: string;
}
interface Coin {
  value: string;
}

export async function analytics_address(agent: AgentRuntime, address:  string): Promise<Fetch_data[]>  {

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const options = {
    method: 'GET',
    headers: {accept: 'application/json', 'X-API-KEY': `${process.env.NODIT_API}`}
  };
  try {
    const response = await fetch(
      `https://aptos-mainnet.nodit.io/v1/accounts/${address}/transactions?limit=${6}`,
      options
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const transactions: Transaction[] = await response.json();

    // 確保有足夠的資料進行分析
    if (transactions.length < 5 + 1) {
      console.warn("Not enough transactions to analyze. Returning empty array.");
      return [];
    }

    const fetch_data_array: Fetch_data[] = [];




    // 儲存上一個交易的 coin 數額
    const previousCoinAmounts: { [coinType: string]: number } = {};

    // 從 startIndex 開始，遍歷 analyzeCount 個交易
    for (let i = 0; i < transactions.length-1; i++) {
      const transaction = transactions[i];
      const transactionHash = transaction.hash;
      console.log('Transaction Hash:', transactionHash);

      // 提取時間戳記
      const timestamp = Number(transaction.timestamp);  // 轉換為數字

      // 提取 Module 和 Function
      const functionName = transaction.payload.function;
      const moduleMatch = functionName.match(/^([^:]+::[^:]+)::([^:]+)$/); // 使用更寬鬆的 regex
      const moduleName = moduleMatch ? moduleMatch[1] : "Unknown"; // 提取完整的 module 地址
      const functionShortName = moduleMatch ? moduleMatch[2] : "Unknown"; // 提取 function 名稱

      // 儲存 CoinStore 資訊
      const coinStores: { coinType: string; amountChange: number }[] = [];

      transaction.changes.forEach((change) => {
        if (change.type === 'write_resource' && change.data?.type.startsWith('0x1::coin::CoinStore')) {
          const coinStoreChange = change as CoinStoreChange;
          //  確認  address  是否與目標  accountAddress  相同
          if (coinStoreChange.address === address) {
            const coinTypeMatch = coinStoreChange.data.type.match(/<(.+)>$/);
            const coinType = coinTypeMatch ? coinTypeMatch[1] : 'Unknown Coin Type';
            const coinValue = Number(coinStoreChange.data.data.coin.value);
            const previousAmount = previousCoinAmounts[coinType] || 0;
            const amountChange = coinValue - previousAmount;

            coinStores.push({ coinType: coinType, amountChange: amountChange });

            previousCoinAmounts[coinType] = coinValue;
          }
        }
      });

      console.log('Coin Stores:', coinStores);

      let fetch_data: Fetch_data = {
        module: moduleName, //  使用完整的 module 地址
        function: functionShortName,
        timestamp:timestamp // 添加時間戳記
      };

      // 檢查是否為 Swap 交易 (Emojiswap 和 PanoraSwap)
      const isSwap =
        transaction.events.some(
          (event) =>
            event.type ===
            "0xface729284ae5729100b3a9ad7f7cc025ea09739cd6e7252aff0beb53619cafe::emojicoin_dot_fun::Swap"
        ) || transaction.payload.function.startsWith("0x1c3206329806286fd2223647c9f9b130e66baeb6d7224a18c1f642ffe48f3b4c::panora_swap::router_entry");

      if (isSwap) {
        // 處理 Swap 交易
        if (coinStores.length === 2) {
          // 強制設定第一個為負數，第二個為正數
          const amountChange1 = Math.abs(coinStores[0].amountChange) * -1;
          const amountChange2 = Math.abs(coinStores[1].amountChange);

          fetch_data.change = {
            coin_1: coinStores[0].coinType,
            amount_change_c1: amountChange1,
            coin_2: coinStores[1].coinType,
            amount_change_c2: amountChange2
          };

        }
      } else if (coinStores.length === 1) { // 處理單一代幣變化 (例如 transfer)
        fetch_data.change = {
          coin_1: coinStores[0].coinType,
          amount_change_c1: coinStores[0].amountChange
        };
      }

      fetch_data_array.push(fetch_data);
    }

    return fetch_data_array;
  } catch (error: any) {
    throw new Error(`Token transfer failed: ${error.message}`)
  }
}
