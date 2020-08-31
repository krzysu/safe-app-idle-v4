import { ethers } from "ethers";

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
  address: string;
  decimals: number;
  logo: string;
  strategyId: Strategy;
  tokenId: Token;
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
