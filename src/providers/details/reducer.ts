import { Action, Actions, State } from "./types";

export const initialState: State = {
  isLoaded: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case Actions.SetData:
      return {
        ...state,
        isLoaded: true,
      };

    default:
      return state;
  }
};
