import { Action, Actions, State } from "./types";

export const initialState: State = {
  isLoaded: false,
  helperContract: undefined,
  token: undefined,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case Actions.SetData:
      return {
        ...state,
        isLoaded: true,
        ...action.payload,
      };

    default:
      return state;
  }
};
