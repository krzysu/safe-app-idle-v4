import { ethers } from "ethers";
import { getIdleTokenId } from "../utils/amounts";
import { erc20Abi, idleV3Abi, idleV4Abi } from "./abis";
import tokensV3 from "./tokensV3";
import tokensV4 from "./tokensV4";
import {
  Contracts,
  TokenData,
  TokenBasicData,
  Network,
  Identifier,
} from "../types";

const getProvider = (network: Network = "rinkeby") => {
  const provider = new ethers.providers.JsonRpcProvider(
    `https://${network}.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`
  );
  return provider;
};

const initContract = async (
  provider: ethers.providers.JsonRpcProvider,
  token: TokenBasicData
): Promise<Contracts> => {
  const idleContract = new ethers.Contract(token.address, idleV4Abi, provider);

  const underlyingAddress = await idleContract.token();

  const underlyingContract = new ethers.Contract(
    underlyingAddress,
    erc20Abi,
    provider
  );

  return {
    tokenId: token.tokenId,
    strategyId: token.strategyId,
    idleContract,
    underlyingContract,
  };
};

const initLegacyContract = async (
  provider: ethers.providers.JsonRpcProvider,
  token: TokenBasicData
): Promise<Contracts> => {
  const idleContract = new ethers.Contract(token.address, idleV3Abi, provider);

  return {
    tokenId: token.tokenId,
    strategyId: token.strategyId,
    idleContract,
    underlyingContract: idleContract, // ignore
  };
};

const initToken = async (
  { idleContract, underlyingContract }: Contracts,
  safeAddress: string,
  token: TokenBasicData
): Promise<TokenData> => {
  let isPaused = false;
  // rinkeby mocked contracts don't have paused function
  try {
    isPaused = await idleContract.paused();
  } catch (e) {}

  const idleBalance = await idleContract.balanceOf(safeAddress);
  const avgAPR = await idleContract.getAvgAPR();
  const tokenPrice = await idleContract.tokenPrice();

  const underBalance = await underlyingContract.balanceOf(safeAddress);
  const underDecimals = await underlyingContract.decimals();

  return {
    ...token,
    isPaused,
    tokenPrice,
    avgAPR,
    underlying: {
      balance: underBalance,
      decimals: underDecimals,
    },
    idle: {
      balance: idleBalance,
      decimals: token.decimals,
    },
  };
};

const initLegacyToken = async (
  { idleContract }: Contracts,
  safeAddress: string,
  token: TokenBasicData
): Promise<TokenData | null> => {
  const idleBalance = await idleContract.balanceOf(safeAddress);
  const tokenPrice = await idleContract.tokenPrice();

  if (idleBalance.eq("0")) {
    return null;
  }

  // skip unnecessary data
  return {
    ...token,
    isPaused: false,
    tokenPrice,
    avgAPR: ethers.BigNumber.from("0"),
    underlying: {
      balance: ethers.BigNumber.from("0"),
      decimals: 18,
    },
    idle: {
      balance: idleBalance,
      decimals: token.decimals,
    },
  };
};

const arrayToRecord = <T extends Identifier>(items: T[]): Record<string, T> =>
  items.reduce((acc, item: T) => {
    acc[getIdleTokenId(item.strategyId, item.tokenId)] = item;
    return acc;
  }, {} as Record<string, T>);

export const initContracts = async (
  network: Network
): Promise<Record<string, Contracts>> => {
  const provider = getProvider(network);
  const tokens = tokensV4[network];

  const result = await Promise.all(
    tokens.map(async (token) => {
      return await initContract(provider, token);
    })
  );

  return arrayToRecord(result);
};

export const initLegacyContracts = async (
  network: Network
): Promise<Record<string, Contracts>> => {
  const provider = getProvider(network);
  const tokens = tokensV3[network];

  const result = await Promise.all(
    tokens.map(async (token) => {
      return await initLegacyContract(provider, token);
    })
  );

  return arrayToRecord(result);
};

export const initTokens = async (
  contracts: Record<string, Contracts>,
  network: Network,
  safeAddress: string
): Promise<Record<string, TokenData>> => {
  const tokens = tokensV4[network];

  const result = await Promise.all(
    tokens.map(async (token) => {
      const id = getIdleTokenId(token.strategyId, token.tokenId);
      return await initToken(contracts[id], safeAddress, token);
    })
  );

  return arrayToRecord(result);
};

export const initLegacyTokens = async (
  contracts: Record<string, Contracts>,
  network: Network,
  safeAddress: string
): Promise<Record<string, TokenData>> => {
  const tokens = tokensV3[network];

  const allTokens = await Promise.all(
    tokens.map(async (token) => {
      const id = getIdleTokenId(token.strategyId, token.tokenId);
      return await initLegacyToken(contracts[id], safeAddress, token);
    })
  );

  const tokensWithBalance = allTokens.filter(
    (item: TokenData | null) => !!item
  );

  return arrayToRecord(tokensWithBalance as TokenData[]);
};
