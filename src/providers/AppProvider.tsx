import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";
import {
  Actions,
  State,
  TokenData,
  Page,
  Token,
  Strategy,
} from "../utils/types";
import { initialState, reducer } from "./reducer";
import { ethers } from "ethers";

const stateCtx = createContext<State>(initialState);
const dispatchCtx = createContext<Dispatch>({} as Dispatch);

export const useAppState = (): State => useContext(stateCtx);
export const useAppDispatch = (): Dispatch => useContext(dispatchCtx);

interface Dispatch {
  setTokens(tokens: Record<string, TokenData>): void;
  goToPage(page: Page, tokenId?: Token, strategyId?: Strategy): void;
  updateTokenPrice(strategyId: Strategy, tokenId: Token): void;
}

const AppProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setTokens = useCallback<Dispatch["setTokens"]>((tokens) => {
    dispatch({
      type: Actions.SetTokens,
      payload: tokens,
    });
  }, []);

  const goToPage = useCallback<Dispatch["goToPage"]>(
    (page, tokenId?, strategyId?) => {
      dispatch({
        type: Actions.GoToPage,
        payload: { page, tokenId, strategyId },
      });
    },
    []
  );

  const updateTokenPrice = useCallback<Dispatch["updateTokenPrice"]>(
    (strategyId, tokenId) => {
      const price = ethers.BigNumber.from("0"); // TODO get eral price

      dispatch({
        type: Actions.UpdateTokenPrice,
        payload: { strategyId, tokenId, price },
      });
    },
    []
  );

  return (
    <stateCtx.Provider value={state}>
      <dispatchCtx.Provider
        value={useMemo(() => ({ setTokens, goToPage, updateTokenPrice }), [
          setTokens,
          goToPage,
          updateTokenPrice,
        ])}
      >
        {children}
      </dispatchCtx.Provider>
    </stateCtx.Provider>
  );
};

export default AppProvider;
