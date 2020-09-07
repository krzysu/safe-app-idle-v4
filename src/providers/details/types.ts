import { ethers } from "ethers";
import { TokenData } from "../../types";

export interface State {
  isLoaded: boolean;
  helperContract?: ethers.Contract;
  token?: TokenData;
}

export enum Actions {
  SetData,
}

export type Action = {
  type: Actions.SetData;
  payload: {};
};
