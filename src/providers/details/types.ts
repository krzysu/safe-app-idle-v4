export interface State {
  isLoaded: boolean;
}

export enum Actions {
  SetData,
}

export type Action = {
  type: Actions.SetData;
  payload: {};
};
