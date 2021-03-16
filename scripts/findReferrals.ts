require("dotenv").config();
import { ethers, Contract, Event } from "ethers";
import { erc20Abi, idleV4Abi } from "../src/providers/abis";
import { saveToFile } from "./utils/saveToFile";

const myRefAddress = process.env.REACT_APP_REFERRAL_ADDRESS;

type IdleContracts = Record<string, string>;

const contracts: IdleContracts = {
  bestDai: "0x3fE7940616e5Bc47b0775a0dccf6237893353bB4",
  bestUsdc: "0x5274891bEC421B39D23760c04A6755eCB444797C",
  bestUsdt: "0xF34842d05A1c888Ca02769A633DF37177415C2f8",
  bestSusd: "0xf52cdcd458bf455aed77751743180ec4a595fd3f",
  bestTusd: "0xc278041fDD8249FE4c1Aad1193876857EEa3D68c",
  bestWbtc: "0x8C81121B15197fA0eEaEE1DC75533419DcfD3151",
  riskDai: "0xa14eA0E11121e6E951E87c66AFe460A00BCD6A16",
  riskUsdc: "0x3391bc034f2935ef0e1e41619445f998b2680d35",
  riskUsdt: "0x28fAc5334C9f7262b3A3Fe707e250E01053e07b5",
};

const getProvider = () => {
  return new ethers.providers.JsonRpcProvider(
    `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`
  );
};

const getEvents = async (contract: Contract): Promise<Event[]> => {
  const filter = contract.filters.Referral();
  return await contract.queryFilter(filter);
};

type Referral = {
  amount: number;
  symbol: string;
  referrer: string;
  txHash: string;
};

const parseEvents = (
  events: Event[],
  decimals: number,
  symbol: string
): Referral[] => {
  return events.map((event) => {
    const amount = Number(
      ethers.utils.formatUnits(event.args?._amount, decimals)
    );

    if (event.args?._ref === myRefAddress) {
      console.log(`Referred ${amount} ${symbol}`);
    }

    return {
      amount,
      symbol,
      referrer: event.args?._ref,
      txHash: event.transactionHash,
    };
  });
};

const groupByReferrer = (referrals: Referral[]): Record<string, Referral[]> => {
  return referrals.reduce((acc, referral) => {
    const ref = referral.referrer;

    return {
      ...acc,
      [ref]: acc[ref] ? [...acc[ref], referral] : [referral],
    };
  }, {} as Record<string, Referral[]>);
};

const main = async () => {
  const provider = getProvider();

  const allResults = await Promise.all(
    Object.keys(contracts).map(async (key: keyof IdleContracts) => {
      const contract = new ethers.Contract(contracts[key], idleV4Abi, provider);
      const underlyingAddress = await contract.token();
      const underlyingContract = new ethers.Contract(
        underlyingAddress,
        erc20Abi,
        provider
      );
      const decimals = (await underlyingContract.decimals()) as number;
      const symbol = (await underlyingContract.symbol()) as string;

      const events = await getEvents(contract);
      const result = parseEvents(events, decimals, symbol);

      return result;
    })
  );

  const data = groupByReferrer(allResults.flat());

  saveToFile(data, "referrals.json", false);
};

main();
