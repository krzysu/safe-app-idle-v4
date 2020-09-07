import React, { createContext, useContext, useReducer } from "react";

import { initialState, reducer } from "./reducer";
import { State } from "./types";

const stateCtx = createContext<State>(initialState);

export const useDetailsState = (): State => useContext(stateCtx);

const DetailsProvider: React.FC = ({ children }) => {
  const [state] = useReducer(reducer, initialState);

  return <stateCtx.Provider value={state}>{children}</stateCtx.Provider>;
};

export default DetailsProvider;
