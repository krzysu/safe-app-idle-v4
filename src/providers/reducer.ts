import { ethers } from "ethers";
import { getIdleTokenId } from "../utils/amounts";
import {
  Action,
  Actions,
  Page,
  State,
  Strategy,
  Token,
  TokenData,
  UpdateTokenPricePayload,
} from "../utils/types";
import {
  buildTokenSelectItems,
  buildStrategySelectItems,
} from "../utils/buildSelectItems";

export const initialState: State = {
  isLoaded: false,
  tokens: {},
  currentPage: Page.Overview,
  currentTokenId: undefined,
  currentStrategyId: undefined,
  tokenSelectItems: [],
  strategySelectItems: [],
};

export const actions = {
  setTokens: (tokens: Record<string, TokenData>) => ({
    type: Actions.SetTokens,
    payload: tokens,
  }),

  goToPage: (page: Page, tokenId?: Token, strategyId?: Strategy) => ({
    type: Actions.GoToPage,
    payload: { page, tokenId, strategyId },
  }),

  updateTokenPrice: (
    strategyId: Strategy,
    tokenId: Token,
    price: ethers.BigNumber
  ) => ({
    type: Actions.UpdateTokenPrice,
    payload: { strategyId, tokenId, price },
  }),
};

// reducer helpers
const updateTokenPrice = (
  tokens: Record<string, TokenData>,
  { strategyId, tokenId, price }: UpdateTokenPricePayload
) => {
  const idleId = getIdleTokenId(strategyId, tokenId);

  return {
    ...tokens,
    [idleId]: {
      ...tokens[idleId],
      tokenPrice: price,
    },
  };
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case Actions.SetTokens:
      return {
        ...state,
        tokens: action.payload,
        tokenSelectItems: buildTokenSelectItems(action.payload),
        strategySelectItems: buildStrategySelectItems(action.payload),
        isLoaded: true,
      };

    case Actions.GoToPage:
      return {
        ...state,
        currentPage: action.payload.page,
        currentTokenId: action.payload.tokenId,
        currentStrategyId: action.payload.strategyId,
      };

    case Actions.UpdateTokenPrice:
      return {
        ...state,
        tokens: updateTokenPrice(state.tokens, action.payload),
      };

    default:
      return state;
  }
};
