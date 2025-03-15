import { get_hashtags } from "./twotag/get_hashtags";
import { generate_image } from "./twotag/generate_image";
import * as twotag from "./twotag";
import * as aptos from "./aptos";

export * from "./amnis";
export * from "./aptos";
export * from "./joule";
export * from "./aries";
export * from "./echelon";
export * from "./echo";
export * from "./liquidswap";
export * from "./panora";
export * from "./openai";
export * from "./thala";
export * from "./twotag";
export * from "./dune"
export  * from "./emoji"

// export const toolsByName = {
//   get_hashtags: twotag.get_hashtags,
//   generate_image: twotag.generate_image,
//   post_and_mint: twotag.post_and_mint,
//   read_public_tweet: twotag.read_public_tweet,
//   get_twotag_nft: twotag.get_twotag_nft,

//   // Aptos tools
//   aptos_balance: aptos.getBalance,
//   aptos_account_address: aptos.getAccountAddress,
//   aptos_transfer_token: aptos.transferTokens,
//   aptos_burn_token: aptos.burnToken,
//   aptos_transaction: aptos.getTransaction,
//   aptos_get_token_detail: aptos.getTokenDetails,
//   aptos_mint_token: aptos.mintToken,
//   aptos_create_token: aptos.create_token,
//   aptos_get_token_price: aptos.get_token_price,

//   // Amnis tools
//   amnis_stake: AmnisStakeTool,
//   amnis_withdraw_stake: AmnisWithdrawStakeTool,

//   // Joule tools
//   joule_lend_token: JouleLendTokenTool,
//   joule_withdraw_token: JouleWithdrawTokenTool,
//   joule_borrow_token: JouleBorrowTokenTool,
//   joule_repay_token: JouleRepayTokenTool,
//   joule_get_pool_details: JouleGetPoolDetails,
//   joule_get_user_position: JouleGetUserPosition,
//   joule_get_user_all_positions: JouleGetUserAllPositions,

//   // LiquidSwap tools
//   liquidswap_create_pool: LiquidSwapCreatePoolTool,
//   liquidswap_add_liquidity: LiquidSwapAddLiquidityTool,
//   liquidswap_remove_liquidity: LiquidSwapRemoveLiquidityTool,
//   liquidswap_swap: LiquidSwapSwapTool,

//   // Panora tools
//   panora_swap: PanoraSwapTool,

//   // OpenAI tools
//   openai_generate_image: OpenAICreateImageTool,

//   // Thala tools
//   echelon_lend_token: EchelonLendTokenTool,
//   echelon_withdraw_token: EchelonWithdrawTokenTool,
//   echelon_borrow_token: EchelonBorrowTokenTool,
//   echelon_repay_token: EchelonRepayTokenTool,

//   // Echo tools
//   echo_stake_token: EchoStakeTokenTool,
//   echo_unstake_token: EchoUnstakeTokenTool,

//   // Thala tools
//   thala_add_liquidity: ThalaAddLiquidityTool,
//   thala_remove_liquidity: ThalaRemoveLiquidityTool,
//   thala_mint_mod: ThalaMintMODTool,
//   thala_redeem_mod: ThalaRedeemMODTool,
//   thala_stake_token: ThalaStakeTokenTool,
//   thala_unstake_token: ThalaUnstakeTokenTool,

//   // Aries tools
//   aries_create_profile: AriesCreateProfileTool,
//   aries_withdraw: AriesWithdrawTool,
//   aries_borrow: AriesBorrowTool,
//   aries_lend: AriesLendTool,
//   aries_repay: AriesRepayTool,
// };
