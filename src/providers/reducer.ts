import { getIdleTokenId } from "../utils/amounts";
import {
  buildTokenSelectItems,
  buildStrategySelectItems,
} from "../utils/buildSelectItems";
import { Page, TokenData } from "../types";
import { Action, Actions, State, UpdateTokenPricePayload } from "./types";

export const initialState: State = {
  isLoaded: false,
  tokens: {},
  currentPage: Page.Overview,
  currentTokenId: undefined,
  currentStrategyId: undefined,
  tokenSelectItems: [],
  strategySelectItems: [],
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
