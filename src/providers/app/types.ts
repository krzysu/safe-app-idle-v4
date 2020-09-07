import { ethers } from "ethers";
import {
  Page,
  Strategy,
  StrategySelectItem,
  Token,
  TokenBasicData,
  TokenData,
  TokenSelectItem,
} from "../../types";

export enum Version {
  V3 = "v3",
  V4 = "v4",
}

export interface Contracts extends TokenBasicData {
  idleContract: ethers.Contract;
  underlyingContract: ethers.Contract;
}

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
