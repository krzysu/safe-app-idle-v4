import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useEffect,
} from "react";
import { getIdleTokenId } from "../utils/amounts";
import { useSafeApp } from "./SafeAppProvider";
import { initialState, reducer } from "./reducer";
import { initContracts, initTokens, initLegacyTokens } from "./contracts";
import { Page, Token, Strategy, Network } from "../types";
import { State, Actions, Version } from "./types";

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
  const { contracts, legacyContracts } = state;

  useEffect(() => {
    if (safeInfo) {
      const run = async () => {
        const contractsV4 = await initContracts(
          Version.V4,
          safeInfo.network as Network
        );
        const contractsV3 = await initContracts(
          Version.V3,
          safeInfo.network as Network
        );

        dispatch({
          type: Actions.SetContracts,
          payload: { contracts: contractsV4 },
        });
        dispatch({
          type: Actions.SetContracts,
          payload: { legacyContracts: contractsV3 },
        });
      };

      run();
    }
  }, [safeInfo]);

  useEffect(() => {
    if (safeInfo && Object.keys(contracts).length > 0) {
      const run = async () => {
        const result = await initTokens(contracts, safeInfo.safeAddress);
        dispatch({
          type: Actions.SetTokens,
          payload: result,
        });
      };

      run();
    }
  }, [safeInfo, contracts]);

  useEffect(() => {
    if (safeInfo && Object.keys(legacyContracts).length > 0) {
      const run = async () => {
        const result = await initLegacyTokens(
          legacyContracts,
          safeInfo.safeAddress
        );
        dispatch({
          type: Actions.SetLegacyTokens,
          payload: result,
        });
      };

      run();
    }
  }, [safeInfo, legacyContracts]);

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
      if (Object.keys(contracts).length > 0) {
        const run = async () => {
          const contract = contracts[getIdleTokenId(strategyId, tokenId)];
          const price = await contract.idleContract.tokenPrice();

          dispatch({
            type: Actions.UpdateTokenPrice,
            payload: { strategyId, tokenId, price },
          });
        };

        run();
      }
    },
    [contracts]
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
