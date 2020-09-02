import tokenToLogoMap from "./tokenToLogoMap";
import {
  Strategy,
  Token,
  TokenBasicData,
  TokenSelectItem,
  StrategySelectItem,
} from "../types";

import maxYieldSrc from "../assets/best-on.svg";
import riskAdjustedSrc from "../assets/risk-on.svg";

const toArray = (obj: Record<string, TokenBasicData>): TokenBasicData[] =>
  Object.keys(obj).map((key) => obj[key]);

const getTokensByStrategy = (
  tokensArray: TokenBasicData[],
  strategyId: Strategy
) =>
  tokensArray
    .filter((token) => token.strategyId === strategyId)
    .map((token) => token.tokenId);

const getStrategiesByToken = (tokensArray: TokenBasicData[], tokenId: Token) =>
  tokensArray
    .filter((token) => token.tokenId === tokenId)
    .map((token) => token.strategyId);

export const buildTokenSelectItems = (
  tokens: Record<string, TokenBasicData>
): TokenSelectItem[] => {
  const tokensArray = toArray(tokens);

  const items = Object.values(Token)
    .map((tokenId: Token) => {
      const strategies = getStrategiesByToken(tokensArray, tokenId);
      if (strategies.length > 0) {
        return {
          id: tokenId,
          label: tokenId.toUpperCase(),
          iconUrl: tokenToLogoMap[tokenId],
          strategies,
        };
      }
      return null;
    })
    .filter((item: TokenSelectItem | null) => !!item) as TokenSelectItem[];

  return items;
};

export const buildStrategySelectItems = (
  tokens: Record<string, TokenBasicData>
): StrategySelectItem[] => {
  const items = [];
  const tokensArray = toArray(tokens);
  const maxYieldTokens = getTokensByStrategy(tokensArray, Strategy.BestYield);
  const riskAdjustedTokens = getTokensByStrategy(
    tokensArray,
    Strategy.RiskAdjusted
  );

  if (maxYieldTokens.length > 0) {
    items.push({
      id: Strategy.BestYield,
      label: "Best-Yield",
      iconUrl: maxYieldSrc,
      tokens: maxYieldTokens,
    });
  }

  if (riskAdjustedTokens.length > 0) {
    items.push({
      id: Strategy.RiskAdjusted,
      label: "Risk-Adjusted",
      iconUrl: riskAdjustedSrc,
      tokens: riskAdjustedTokens,
    });
  }

  return items;
};
