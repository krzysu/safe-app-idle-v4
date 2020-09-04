import { ethers } from "ethers";
import { Networks } from "@gnosis.pm/safe-apps-sdk";

export type Network = Extract<Networks, "mainnet" | "rinkeby">;

export enum Strategy {
  BestYield = "BestYield",
  RiskAdjusted = "RiskAdjusted",
}

export enum Page {
  Overview = "Overview",
  Deposit = "Deposit",
  Withdraw = "Withdraw",
}

export enum Form {
  Deposit = "Deposit",
  Withdraw = "Withdraw",
}

export enum Token {
  DAI = "dai",
  USDC = "usdc",
  USDT = "usdt",
  SUSD = "susd",
  TUSD = "tusd",
  WBTC = "wbtc",
}

export interface TokenBasicData {
  strategyId: Strategy;
  tokenId: Token;
  address: string;
  decimals: number;
  logo: string;
}

export interface Balance {
  balance: ethers.BigNumber;
  decimals: number;
}

export interface TokenData extends TokenBasicData {
  isPaused: boolean;
  tokenPrice: ethers.BigNumber;
  avgAPR: ethers.BigNumber;
  underlying: Balance;
  idle: Balance;
}

export interface TxData {
  tokenId: Token;
  strategyId: Strategy;
  amountWei: ethers.BigNumber;
}

export interface TokenSelectItem {
  id: Token;
  label: string;
  iconUrl: string;
  strategies: Strategy[];
}

export interface StrategySelectItem {
  id: Strategy;
  label: string;
  iconUrl: string;
  tokens: Token[];
}
