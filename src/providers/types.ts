import { ethers } from "ethers";
import {
  TokenData,
  Page,
  Token,
  Strategy,
  TokenSelectItem,
  StrategySelectItem,
} from "../types";

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
