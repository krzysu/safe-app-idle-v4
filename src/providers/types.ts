import { ethers } from "ethers";
import {
  Contracts,
  Page,
  Strategy,
  StrategySelectItem,
  Token,
  TokenData,
  TokenSelectItem,
} from "../types";

export interface State {
  isLoaded: boolean;
  tokens: Record<string, TokenData>;
  contracts: Record<string, Contracts>;
  currentPage: Page;
  currentTokenId?: Token;
  currentStrategyId?: Strategy;
  tokenSelectItems: TokenSelectItem[];
  strategySelectItems: StrategySelectItem[];
  legacyTokens: Record<string, TokenData>;
  legacyContracts: Record<string, Contracts>;
}

export enum Actions {
  SetContracts,
  SetTokens,
  SetLegacyTokens,
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
      type: Actions.SetContracts;
      payload: Record<string, Record<string, Contracts>>;
    }
  | {
      type: Actions.SetTokens;
      payload: Record<string, TokenData>;
    }
  | {
      type: Actions.SetLegacyTokens;
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
