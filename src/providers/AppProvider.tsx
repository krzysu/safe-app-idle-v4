import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useEffect,
} from "react";
import { ethers } from "ethers";
import { initAllTokens } from "../utils/contracts";
import { useSafeApp } from "./SafeAppProvider";
import { initialState, reducer } from "./reducer";
import { Page, Token, Strategy, Network } from "../types";
import { State, Actions } from "./types";

const stateCtx = createContext<State>(initialState);
const dispatchCtx = createContext<Dispatch>({} as Dispatch);

export const useAppState = (): State => useContext(stateCtx);
export const useAppDispatch = (): Dispatch => useContext(dispatchCtx);

interface Dispatch {
  goToPage(page: Page, tokenId?: Token, strategyId?: Strategy): void;
  updateTokenPrice(strategyId: Strategy, tokenId: Token): void;
}

const AppProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { safeInfo } = useSafeApp();

  useEffect(() => {
    if (safeInfo && safeInfo.safeAddress !== "") {
      const { network, safeAddress } = safeInfo;

      const initTokens = async () => {
        const tokens = await initAllTokens(network as Network, safeAddress);
        dispatch({
          type: Actions.SetTokens,
          payload: tokens,
        });
      };

      initTokens();
    }
  }, [safeInfo]);

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
      const price = ethers.BigNumber.from("0"); // TODO get real price

      // const token = tokens[getIdleTokenId(strategyId, tokenId)];
      // const tokenPrice = await token.idle.contract.tokenPrice();

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
        value={useMemo(() => ({ goToPage, updateTokenPrice }), [
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
