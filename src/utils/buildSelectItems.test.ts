import {
  buildTokenSelectItems,
  buildStrategySelectItems,
} from "./buildSelectItems";
import tokens from "../providers/tokensV3";
import { getIdleTokenId } from "./amounts";
import { Strategy, Token, TokenBasicData } from "../types";

const testTokens = tokens["mainnet"].reduce((acc, item) => {
  acc[getIdleTokenId(item.strategyId, item.tokenId)] = item;
  return acc;
}, {} as Record<string, TokenBasicData>);

const expectedTokenItems = [
  {
    id: Token.DAI,
    label: "DAI",
    iconUrl: "dai.svg",
    strategies: [Strategy.BestYield, Strategy.RiskAdjusted],
  },
  {
    id: Token.USDC,
    label: "USDC",
    iconUrl: "usdc.svg",
    strategies: [Strategy.BestYield, Strategy.RiskAdjusted],
  },
  {
    id: Token.USDT,
    label: "USDT",
    iconUrl: "usdt.svg",
    strategies: [Strategy.BestYield, Strategy.RiskAdjusted],
  },
  {
    id: Token.SUSD,
    label: "SUSD",
    iconUrl: "susd.svg",
    strategies: [Strategy.BestYield],
  },
  {
    id: Token.TUSD,
    label: "TUSD",
    iconUrl: "tusd.svg",
    strategies: [Strategy.BestYield],
  },
  {
    id: Token.WBTC,
    label: "WBTC",
    iconUrl: "wbtc.svg",
    strategies: [Strategy.BestYield],
  },
];

const expectedStrategyItems = [
  {
    id: Strategy.BestYield,
    label: "Best-Yield",
    iconUrl: "best-on.svg",
    tokens: ["dai", "usdc", "usdt", "susd", "tusd", "wbtc"],
  },
  {
    id: Strategy.RiskAdjusted,
    label: "Risk-Adjusted",
    iconUrl: "risk-on.svg",
    tokens: ["dai", "usdc", "usdt"],
  },
];

describe("buildSelectItems", () => {
  test("buildTokenSelectItems", () => {
    expect(buildTokenSelectItems(testTokens)).toEqual(expectedTokenItems);
  });

  test("buildStrategySelectItems", () => {
    expect(buildStrategySelectItems(testTokens)).toEqual(expectedStrategyItems);
  });
});
