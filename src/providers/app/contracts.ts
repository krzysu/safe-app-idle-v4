import { ethers } from "ethers";
import { getIdleTokenId } from "../../utils/amounts";
import { erc20Abi, idleV3Abi, idleV4Abi } from "../abis";
import tokensV3 from "../tokensV3";
import tokensV4 from "../tokensV4";
import { TokenData, TokenBasicData } from "../../types";
import { Network } from "../SafeAppProvider";
import { Contracts, Version } from "./types";

const tokensVersionMap = {
  [Version.V3]: tokensV3,
  [Version.V4]: tokensV4,
};

const abiVersionMap = {
  [Version.V3]: idleV3Abi,
  [Version.V4]: idleV4Abi,
};

const initContract = async (
  provider: ethers.providers.JsonRpcProvider,
  token: TokenBasicData,
  abi: ethers.ContractInterface
): Promise<Contracts> => {
  const idleContract = new ethers.Contract(token.address, abi, provider);

  const underlyingAddress = await idleContract.token();

  const underlyingContract = new ethers.Contract(
    underlyingAddress,
    erc20Abi,
    provider
  );

  return {
    ...token,
    idleContract,
    underlyingContract,
  };
};

const initToken = async (
  contract: Contracts,
  safeAddress: string
): Promise<TokenData> => {
  const { idleContract, underlyingContract, ...tokenBasicData } = contract;
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
    ...tokenBasicData,
    isPaused,
    tokenPrice,
    avgAPR,
    underlying: {
      balance: underBalance,
      decimals: underDecimals,
    },
    idle: {
      balance: idleBalance,
      decimals: tokenBasicData.decimals,
    },
  };
};

const initLegacyToken = async (
  contract: Contracts,
  safeAddress: string
): Promise<TokenData | null> => {
  const { idleContract, underlyingContract, ...tokenBasicData } = contract;
  const idleBalance = await idleContract.balanceOf(safeAddress);

  if (idleBalance.eq("0")) {
    return null;
  }

  const tokenPrice = await idleContract.tokenPrice();
  const underDecimals = await underlyingContract.decimals();

  // skip unnecessary data
  return {
    ...tokenBasicData,
    isPaused: false,
    tokenPrice,
    avgAPR: ethers.BigNumber.from("0"),
    underlying: {
      balance: ethers.BigNumber.from("0"),
      decimals: underDecimals,
    },
    idle: {
      balance: idleBalance,
      decimals: tokenBasicData.decimals,
    },
  };
};

const arrayToRecord = <T extends TokenBasicData>(
  items: T[]
): Record<string, T> =>
  items.reduce((acc, item: T) => {
    acc[getIdleTokenId(item.strategyId, item.tokenId)] = item;
    return acc;
  }, {} as Record<string, T>);

export const initContracts = async (
  provider: ethers.providers.JsonRpcProvider,
  version: Version,
  network: Network
): Promise<Record<string, Contracts>> => {
  const tokens = tokensVersionMap[version][network];
  const abi = abiVersionMap[version];

  const result = await Promise.all(
    tokens.map(async (token) => {
      return await initContract(provider, token, abi);
    })
  );

  return arrayToRecord(result);
};

export const initTokens = async (
  contracts: Record<string, Contracts>,
  safeAddress: string
): Promise<Record<string, TokenData>> => {
  const allTokens = await Promise.all(
    Object.values(contracts).map(async (contract) => {
      return await initToken(contract, safeAddress);
    })
  );

  return arrayToRecord(allTokens);
};

export const initLegacyTokens = async (
  contracts: Record<string, Contracts>,
  safeAddress: string
): Promise<Record<string, TokenData>> => {
  const allTokens = await Promise.all(
    Object.values(contracts).map(async (contract) => {
      return await initLegacyToken(contract, safeAddress);
    })
  );

  const tokensWithBalance = allTokens.filter(
    (item: TokenData | null) => !!item
  );

  return arrayToRecord(tokensWithBalance as TokenData[]);
};
