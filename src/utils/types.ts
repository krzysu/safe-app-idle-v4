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

export interface State {
  isLoaded: boolean;
  tokens: Record<string, TokenData>;
  currentPage: Page;
  currentTokenId?: Token;
  currentStrategyId?: Strategy;
  tokenSelectItems: TokenSelectItem[];
  strategySelectItems: StrategySelectItem[];
}

export enum Actions {
  SetTokens,
  GoToPage,
  UpdateTokenPrice,
}

export type UpdateTokenPricePayload = {
  strategyId: Strategy;
  tokenId: Token;
  price: ethers.BigNumber;
};

export type Action =
  | {
      type: Actions.SetTokens;
      payload: Record<string, TokenData>;
    }
  | {
      type: Actions.GoToPage;
      payload: {
        page: Page;
        tokenId?: Token;
        strategyId?: Strategy;
      };
    }
  | {
      type: Actions.UpdateTokenPrice;
      payload: UpdateTokenPricePayload;
    };
