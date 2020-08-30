import erc20Mainnet from "@studydefi/money-legos/erc20";
import idleMainnet from "@studydefi/money-legos/idle";

import logoMap from "./tokenToLogoMap";
import { Strategy, Token, TokenBasicData } from "./types";

const buildTokenData = (strategyId: Strategy) => (
  tokenId: Token,
  logo: string
) => (address: string): TokenBasicData => ({
  address,
  decimals: idleMainnet.decimals,
  logo,
  strategyId,
  tokenId,
});

const buildBest = buildTokenData(Strategy.BestYield);
const buildBestDai = buildBest(Token.DAI, logoMap[Token.DAI]);
const buildBestUsdc = buildBest(Token.USDC, logoMap[Token.USDC]);
const buildBestUsdt = buildBest(Token.USDT, logoMap[Token.USDT]);
const buildBestSusd = buildBest(Token.SUSD, logoMap[Token.SUSD]);
const buildBestTusd = buildBest(Token.TUSD, logoMap[Token.TUSD]);
const buildBestWbtc = buildBest(Token.WBTC, logoMap[Token.WBTC]);

const buildRisk = buildTokenData(Strategy.RiskAdjusted);
const buildRiskDai = buildRisk(Token.DAI, logoMap[Token.DAI]);
const buildRiskUsdc = buildRisk(Token.USDC, logoMap[Token.USDC]);
const buildRiskUsdt = buildRisk(Token.USDT, logoMap[Token.USDT]);

const mainnet = [
  buildBestDai(idleMainnet.maxYield.dai.address),
  buildBestUsdc(idleMainnet.maxYield.usdc.address),
  buildBestUsdt(idleMainnet.maxYield.usdt.address),
  buildBestSusd(idleMainnet.maxYield.susd.address),
  buildBestTusd(idleMainnet.maxYield.tusd.address),
  buildBestWbtc(idleMainnet.maxYield.wbtc.address),
  buildRiskDai(idleMainnet.riskAdjusted.dai.address),
  buildRiskUsdc(idleMainnet.riskAdjusted.usdc.address),
  buildRiskUsdt(idleMainnet.riskAdjusted.usdt.address),
];

// I deployed a few Idle mocked contracts on rinkeby
const rinkeby = [
  buildBestDai("0xb20567b77AF55Cd4462941Eb9c9F2bFd734dF84f"),
  buildBestUsdc("0x7C5E9E8f8Cedba477Efd1eA461aB2e54684C9897"),
  // buildBestUsdt("0x728d6b9940F74B23CAa86a6afA7ea05Cc9d8A51F"),
  // buildRiskDai("0xb20567b77AF55Cd4462941Eb9c9F2bFd734dF84f"),
  // buildRiskUsdc("0x7C5E9E8f8Cedba477Efd1eA461aB2e54684C9897"),
  buildRiskUsdt("0x728d6b9940F74B23CAa86a6afA7ea05Cc9d8A51F"),
];

export default {
  mainnet,
  rinkeby,
  erc20Abi: erc20Mainnet.abi,
  idleAbi: idleMainnet.abi,
};
