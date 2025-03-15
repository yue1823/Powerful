import {
  type AccountAddress,
  Aptos,
  AptosConfig,
  type MoveStructId,
  Network, TypeTag
} from "@aptos-labs/ts-sdk";
import { AptosPriceServiceConnection } from "@pythnetwork/pyth-aptos-js";

import { priceFeed } from "./constants/price-feed";
import type { BaseSigner } from "./signers";
import {
  borrowToken,
  burnNFT,
  burnToken,
  createToken,
  get_aptos_average_gas_fee,
  get_aptos_transaction_success_rate,
  get_daily_active_account,
  get_monthly_transaction,
  getBalance,
  getPoolDetails,
  getTokenDetails,
  getTokenPrice,
  getTransaction,
  getUserAllPositions,
  getUserPosition,
  lendToken,
  mintToken,
  repayToken,
  stakeTokens, swap_emoji,
  transferNFT,
  transferTokens,
  unstakeTokens,
  withdrawToken
} from "./tools";
import {
  borrowAriesToken,
  createAriesProfile,
  lendAriesToken,
  repayAriesToken,
  withdrawAriesToken,
} from "./tools/aries";
import {
  addLiquidity,
  createPool,
  removeLiquidity,
  swap,
} from "./tools/liquidswap";
import { swapWithPanora } from "./tools/panora";
import {
  addLiquidityWithThala,
  mintMODWithThala,
  redeemMODWithThala,
  removeLiquidityWithThala,
  stakeTokenWithThala,
  unstakeAPTWithThala,
} from "./tools/thala";

import {
  borrowTokenWithEchelon,
  lendTokenWithEchelon,
  repayTokenWithEchelon,
  withdrawTokenWithEchelon,
} from "./tools/echelon";
import { stakeTokenWithEcho, unstakeTokenWithEcho } from "./tools/echo";
import { createImage } from "./tools/openai";
import { get_twotag_nft } from "./tools/twotag/get_twotag_nft";
import { read_public_tweet } from "./tools/twotag/read_public_tweet";
import { get_hashtags } from "./tools/twotag/get_hashtags";
import { generate_image } from "./tools/twotag/generate_image";
import { two_tag_tweet_nft } from "./tools/twotag/two_tag_tweet_nft";
import { getTokenByTokenName } from "./utils/get-pool-address-by-token-name";
import {is_frozen} from "./tools/aptos/is_frozen";
import {chasing_metadata_owner} from "./tools/aptos/chaseing_metadata_owner";
import {get_aptos_tps} from "./tools/dune/get_aptos_tps";
import {get_total_user_transaction} from "./tools/dune/get_total_user_transaction";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { get_monthly_active_account } from "@/langchain_temp/tools/dune/get_monthly_active_account";
import { create_red_pocket } from "@/langchain_temp/tools/twotag/red_pocket";
import { analytics_address } from "@/langchain_temp/tools/aptos/analytics_address";
const aptosConfig = new AptosConfig({
  network: Network.MAINNET,
});

export class AgentRuntime {
  public account: BaseSigner;
  public aptos: Aptos;
  public config: any;
  public to_address: string;
  public sign: ((transaction: InputTransactionData) => Promise<any>) | undefined;

  constructor(
    account: BaseSigner,
    aptos: Aptos,
    to_address: string,
    config?: any,
    sign?: ((transaction: InputTransactionData) => Promise<any>)
  ) {
    this.account = account;
    this.aptos = new Aptos(aptosConfig);
    this.config = config ? config : {};
    this.to_address = to_address;
    this.sign = sign;
  }

  async getPythData() {
    const connection = new AptosPriceServiceConnection(
      "https://hermes.pyth.network",
    );

    return await connection.getPriceFeedsUpdateData(priceFeed);
  }

  getBalance(mint?: string | MoveStructId) {
    return getBalance(this, mint);
  }

  getTokenDetails(token: string) {
    return getTokenDetails(token);
  }

  getTokenByTokenName(name: string) {
    return getTokenByTokenName(name);
  }

  getTokenPrice(query: string) {
    return getTokenPrice(query);
  }

  transferTokens(to: AccountAddress, amount: number, mint: string) {
    return transferTokens(this, to, amount, mint);
  }

  getTransaction(hash: string) {
    return getTransaction(this, hash);
  }

  burnToken(amount: number, mint: string) {
    return burnToken(this, amount, mint);
  }

  createToken(
    name: string,
    symbol: string,
    iconURI: string,
    projectURI: string,
  ) {
    return createToken(this, name, symbol, iconURI, projectURI);
  }

  mintToken(to: AccountAddress, mint: string, amount: number) {
    return mintToken(this, to, mint, amount);
  }

  stakeTokensWithAmnis(to: AccountAddress, amount: number) {
    return stakeTokens(this, to, amount);
  }

  withdrawStakeFromAmnis(to: AccountAddress, amount: number) {
    return unstakeTokens(this, to, amount);
  }

  transferNFT(to: AccountAddress, mint: AccountAddress) {
    return transferNFT(this, to, mint);
  }

  burnNFT(mint: AccountAddress) {
    return burnNFT(this, mint);
  }

  lendToken(
    amount: number,
    mint: MoveStructId,
    positionId: string,
    newPosition: boolean,
    fungibleAsset: boolean,
  ) {
    return lendToken(
      this,
      amount,
      mint,
      positionId,
      newPosition,
      fungibleAsset,
    );
  }

  borrowToken(
    amount: number,
    mint: MoveStructId,
    positionId: string,
    fungibleAsset: boolean,
  ) {
    return borrowToken(this, amount, mint, positionId, fungibleAsset);
  }

  withdrawToken(
    amount: number,
    mint: MoveStructId,
    positionId: string,
    fungibleAsset: boolean,
  ) {
    return withdrawToken(this, amount, mint, positionId, fungibleAsset);
  }

  repayToken(
    amount: number,
    mint: MoveStructId,
    positionId: string,
    fungibleAsset: boolean,
  ) {
    return repayToken(this, amount, mint, positionId, fungibleAsset);
  }

  getUserPosition(userAddress: AccountAddress, positionId: string) {
    return getUserPosition(this, userAddress, positionId);
  }

  getUserAllPositions(userAddress: AccountAddress) {
    return getUserAllPositions(this, userAddress);
  }
  getPoolDetails(mint: string) {
    return getPoolDetails(this, mint);
  }

  addLiquidity(
    mintX: MoveStructId,
    mintY: MoveStructId,
    mintXAmount: number,
    mintYAmount: number,
  ) {
    return addLiquidity(this, mintX, mintY, mintXAmount, mintYAmount);
  }

  removeLiquidity(
    mintX: MoveStructId,
    mintY: MoveStructId,
    lpAmount: number,
    minMintX = 0,
    minMintY = 0,
  ) {
    return removeLiquidity(this, mintX, mintY, lpAmount, minMintX, minMintY);
  }

  swap(
    mintX: MoveStructId,
    mintY: MoveStructId,
    swapAmount: number,
    minCoinOut?: number,
  ) {
    return swap(this, mintX, mintY, swapAmount, minCoinOut);
  }

  createPool(mintX: MoveStructId, mintY: MoveStructId) {
    return createPool(this, mintX, mintY);
  }

  // Aries

  createAriesProfile() {
    return createAriesProfile(this);
  }

  lendAriesToken(mintType: MoveStructId, amount: number) {
    return lendAriesToken(this, mintType, amount);
  }

  borrowAriesToken(mintType: MoveStructId, amount: number) {
    return borrowAriesToken(this, mintType, amount);
  }

  withdrawAriesToken(mintType: MoveStructId, amount: number) {
    return withdrawAriesToken(this, mintType, amount);
  }

  repayAriesToken(mintType: MoveStructId, amount: number) {
    return repayAriesToken(this, mintType, amount);
  }

  // Thala

  stakeTokensWithThala(amount: number) {
    return stakeTokenWithThala(this, amount);
  }

  unstakeTokensWithThala(amount: number) {
    return unstakeAPTWithThala(this, amount);
  }

  mintMODWithThala(mintType: MoveStructId, amount: number) {
    return mintMODWithThala(this, mintType, amount);
  }

  redeemMODWithThala(mintType: MoveStructId, amount: number) {
    return redeemMODWithThala(this, mintType, amount);
  }

  addLiquidityWithThala(
    mintX: MoveStructId,
    mintY: MoveStructId,
    mintXAmount: number,
    mintYAmount: number,
  ) {
    return addLiquidityWithThala(this, mintX, mintY, mintXAmount, mintYAmount);
  }

  removeLiquidityWithThala(
    mintX: MoveStructId,
    mintY: MoveStructId,
    lpAmount: number,
  ) {
    return removeLiquidityWithThala(this, mintX, mintY, lpAmount);
  }

  // openai

  // createImageWithOpenAI(
  //   prompt: string,
  //   size: "256x256" | "512x512" | "1024x1024",
  //   n: number,
  // ) {
  //   return createImage(this, prompt, size, n);
  // }

  // Echo

  stakeTokenWithEcho(amount: number) {
    return stakeTokenWithEcho(this, amount);
  }

  unstakeTokenWithEcho(amount: number) {
    return unstakeTokenWithEcho(this, amount);
  }

  // Echelon

  lendTokenWithEchelon(
    mintType: MoveStructId,
    amount: number,
    poolAddress: string,
    fungibleAsset: boolean,
  ) {
    return lendTokenWithEchelon(
      this,
      mintType,
      amount,
      poolAddress,
      fungibleAsset,
    );
  }

  withdrawTokenWithEchelon(
    mintType: MoveStructId,
    amount: number,
    poolAddress: string,
    fungibleAsset: boolean,
  ) {
    return withdrawTokenWithEchelon(
      this,
      mintType,
      amount,
      poolAddress,
      fungibleAsset,
    );
  }

  repayTokenWithEchelon(
    mintType: MoveStructId,
    amount: number,
    poolAddress: string,
    fungibleAsset: boolean,
  ) {
    return repayTokenWithEchelon(
      this,
      mintType,
      amount,
      poolAddress,
      fungibleAsset,
    );
  }

  borrowTokenWithEchelon(
    mintType: MoveStructId,
    amount: number,
    poolAddress: string,
    fungibleAsset: boolean,
  ) {
    return borrowTokenWithEchelon(
      this,
      mintType,
      amount,
      poolAddress,
      fungibleAsset,
    );
  }

  // panora

  swapWithPanora(
    fromToken: string,
    toToken: string,
    swapAmount: number,
    toWalletAddress?: string,
  ) {
    return swapWithPanora(
      this,
      fromToken,
      toToken,
      swapAmount,
      toWalletAddress,
    );
  }

  // 2tag
  two_tag_tweet_nft(keywords: string) {
    return two_tag_tweet_nft(this, keywords, this.to_address);
  }

  read_public_tweet(nft_token_id: string) {
    return read_public_tweet(this, nft_token_id);
  }

  get_twotag_nft() {
    return get_twotag_nft(this, this.to_address);
  }

  get_hashtags(keywords: string) {
    return get_hashtags(keywords, this.to_address);
  }

  generate_image(prompt: string) {
    return generate_image(prompt, this.to_address);
  }

  create_red_pocket(red_pocket_amount:number,red_pocet_total:number,message:string,coin:string,key:string){
    return create_red_pocket(this,red_pocket_amount,red_pocet_total,message,coin,key)
  }
  //new aptos function
  is_frozen(coin_metadata:string){
    return is_frozen(this,coin_metadata,this.to_address)
  }

  chasing_metadata_owner(coin_metadata:string){
    return chasing_metadata_owner(this,coin_metadata)
  }

  //dune
  get_aptos_tps(){
    return get_aptos_tps()
  }
  get_total_user_transaction(){
    return get_total_user_transaction()
  }
  get_daily_active_account(){
    return get_daily_active_account()
  }
  get_monthly_active_account(){
    return get_monthly_active_account()
  }
  get_monthly_transaction(){
    return get_monthly_transaction()
  }
  get_aptos_transaction_success_rate(){
    return get_aptos_transaction_success_rate
  }
  get_aptos_average_gas_fee(){
    return get_aptos_average_gas_fee()
  }

  analytics_address(target:string){
    return analytics_address(this,target)
  }

  //emoji
  swap_emoji(coin_type_address:TypeTag[],market_address:string,input_amount:number,is_sell:boolean,output_amount:number){
    return swap_emoji(this,coin_type_address,market_address,input_amount,is_sell,output_amount)
  }
}
