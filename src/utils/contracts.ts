import { ethers } from "ethers";
import tokens from "./tokens";
import { getIdleTokenId } from "./amounts";
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
  const idleContract = new ethers.Contract(
    token.address,
    tokens.idleAbi,
    provider
  );

  const underlyingAddress = await idleContract.token();

  const underlyingContract = new ethers.Contract(
    underlyingAddress,
    tokens.erc20Abi,
    provider
  );

  return {
    tokenId: token.tokenId,
    strategyId: token.strategyId,
    idleContract,
    underlyingContract,
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

const arrayToRecord = <T extends Identifier>(items: T[]): Record<string, T> =>
  items.reduce((acc, item: T) => {
    acc[getIdleTokenId(item.strategyId, item.tokenId)] = item;
    return acc;
  }, {} as Record<string, T>);

export const initAllContracts = async (
  network: Network
): Promise<Record<string, Contracts>> => {
  const provider = getProvider(network);
  const networkTokens = tokens[network] as TokenBasicData[];

  const result = await Promise.all(
    networkTokens.map(async (token) => {
      return await initContract(provider, token);
    })
  );

  return arrayToRecord(result);
};

export const initAllTokens = async (
  contracts: Record<string, Contracts>,
  network: Network,
  safeAddress: string
): Promise<Record<string, TokenData>> => {
  const networkTokens = tokens[network] as TokenBasicData[];

  const result = await Promise.all(
    networkTokens.map(async (token) => {
      const id = getIdleTokenId(token.strategyId, token.tokenId);
      return await initToken(contracts[id], safeAddress, token);
    })
  );

  return arrayToRecord(result);
};
