// useWalletInfo.ts
import { AccountInfo, InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";

interface WalletInfo {
  account: AccountInfo | null; // 根據你的 useWallet Hook 的返回值類型進行調整,
  signAndSubmitTransaction: ((transaction: InputTransactionData) => Promise<any>) | undefined;
  // 其他你需要的錢包資訊
}

export function useWalletInfo(): WalletInfo {
  const { account,signAndSubmitTransaction } = useWallet();

  return {
    account,
    signAndSubmitTransaction
    // 其他你需要的錢包資訊
  };
}