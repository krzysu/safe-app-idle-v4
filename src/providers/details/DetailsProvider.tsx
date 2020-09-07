import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useSafeApp, Network } from "../SafeAppProvider";
import { useAppState } from "../app/AppProvider";
import { getIdleTokenId } from "../../utils/amounts";
import { Strategy, Token } from "../../types";
import { initialState, reducer } from "./reducer";
import { Actions, State } from "./types";
import { initHelperContract } from "./contracts";

const stateCtx = createContext<State>(initialState);

const DetailsProvider: React.FC = ({ children }) => {
  const { safeInfo, provider } = useSafeApp();
  const { tokens, currentTokenId, currentStrategyId } = useAppState();

  const idleTokenId = getIdleTokenId(
    currentStrategyId || Strategy.BestYield,
    currentTokenId || Token.DAI
  );
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    token: tokens[idleTokenId],
  });

  useEffect(() => {
    if (safeInfo && provider) {
      const run = async () => {
        const helperContract = await initHelperContract(
          provider,
          safeInfo.network as Network
        );
        dispatch({
          type: Actions.SetData,
          payload: { helperContract },
        });
      };

      run();
    }
  }, [safeInfo, provider]);

  return <stateCtx.Provider value={state}>{children}</stateCtx.Provider>;
};

export default DetailsProvider;

export const useDetailsState = (): State => useContext(stateCtx);
