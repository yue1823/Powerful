"use client"

import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { useEffect } from "react"
import { create } from "zustand"

interface UserState {
	account: string | null
	setAccount: (account: string | null) => void
}

export const useUserStore = create<UserState>((set) => ({
	account: null, // 初始值為 null 或 undefined
	setAccount: (account) => set({ account }),
}))

export const WalletConnectionHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { account } = useWallet()
	const setAccount = useUserStore((state) => state.setAccount)

	useEffect(() => {
		if (account) {
			setAccount(account.address) // 將 PublicKey 轉換為字串
		} else {
			setAccount(null) // 斷開連接時重置 account
		}
	}, [account, setAccount])
	return <>{children}</>
	// 這個 component 不需要 render 任何東西
}
