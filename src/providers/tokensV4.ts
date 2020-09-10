import logoMap from "../utils/tokenToLogoMap";
import { Strategy, Token, TokenBasicData } from "../types";

const buildTokenData = (strategyId: Strategy) => (
  tokenId: Token,
  logo: string
) => (address: string): TokenBasicData => ({
  address,
  decimals: 18,
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

const mainnet: TokenBasicData[] = [
  buildBestDai("0x3fE7940616e5Bc47b0775a0dccf6237893353bB4"),
  buildBestUsdc("0x5274891bEC421B39D23760c04A6755eCB444797C"),
  buildBestUsdt("0xF34842d05A1c888Ca02769A633DF37177415C2f8"),
  buildBestSusd("0xf52cdcd458bf455aed77751743180ec4a595fd3f"),
  buildBestTusd("0xc278041fDD8249FE4c1Aad1193876857EEa3D68c"),
  buildBestWbtc("0x8C81121B15197fA0eEaEE1DC75533419DcfD3151"),
  buildRiskDai("0xa14eA0E11121e6E951E87c66AFe460A00BCD6A16"),
  buildRiskUsdc("0x3391bc034f2935ef0e1e41619445f998b2680d35"),
  buildRiskUsdt("0x28fAc5334C9f7262b3A3Fe707e250E01053e07b5"),
];

// I deployed a few Idle mocked contracts on rinkeby
const rinkeby: TokenBasicData[] = [
  buildBestDai("0x9Ea007843318B9EcD85f93eCC55D4e19143f007A"),
];

export default {
  mainnet,
  rinkeby,
};
