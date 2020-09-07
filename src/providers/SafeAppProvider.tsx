import React, { createContext, useState, useContext, useEffect } from "react";
import initSdk, {
  SdkInstance,
  SafeInfo,
  Networks,
} from "@gnosis.pm/safe-apps-sdk";
import { ethers } from "ethers";

export type Network = Extract<Networks, "mainnet" | "rinkeby">;

interface State {
  appsSdk?: SdkInstance;
  safeInfo?: SafeInfo;
  provider?: ethers.providers.JsonRpcProvider;
}

const initialState: State = {
  appsSdk: undefined,
  safeInfo: undefined,
  provider: undefined,
};

const stateCtx = createContext<State>(initialState);

const appsSdk = initSdk();

const getProvider = (network: Network = "rinkeby") => {
  return new ethers.providers.JsonRpcProvider(
    `https://${network}.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`
  );
};

const SafeAppProvider: React.FC = ({ children }) => {
  const [safeInfo, setSafeInfo] = useState<SafeInfo>();
  const [provider, setProvider] = useState<ethers.providers.JsonRpcProvider>();

  useEffect(() => {
    appsSdk.addListeners({
      onSafeInfo: setSafeInfo,
    });

    return () => appsSdk.removeListeners();
  }, []);

  useEffect(() => {
    if (safeInfo) {
      setProvider(getProvider(safeInfo.network as Network));
    }
  }, [safeInfo]);

  return (
    <stateCtx.Provider value={{ appsSdk, safeInfo, provider }}>
      {children}
    </stateCtx.Provider>
  );
};

export default SafeAppProvider;

export const useSafeApp = (): State => useContext(stateCtx);
