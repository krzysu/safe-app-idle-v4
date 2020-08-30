import { BigNumberish } from "ethers";

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
  DAI,
  USDC,
  USDT,
  SUSD,
  TUSD,
  WBTC,
}

export interface TokenBasicData {
  address: string;
  decimals: number;
  logo: string;
  strategyId: Strategy;
  tokenId: Token;
}

export interface TokenData extends TokenBasicData {
  isPaused: boolean;
  tokenPrice: BigNumberish;
  avgAPR: BigNumberish;
  underlying: {
    balance: BigNumberish;
    decimals: number;
  };
  idle: {
    balance: BigNumberish;
    decimals: number;
  };
}
