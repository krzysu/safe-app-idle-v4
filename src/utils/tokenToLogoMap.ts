import daiSrc from "../assets/dai.svg";
import usdcSrc from "../assets/usdc.svg";
import usdtSrc from "../assets/usdt.svg";
import susdSrc from "../assets/susd.svg";
import tusdSrc from "../assets/tusd.svg";
import wbtcSrc from "../assets/wbtc.svg";

import { Token } from "./types";

const tokenToLogoMap = {
  [Token.DAI]: daiSrc,
  [Token.USDC]: usdcSrc,
  [Token.USDT]: usdtSrc,
  [Token.SUSD]: susdSrc,
  [Token.TUSD]: tusdSrc,
  [Token.WBTC]: wbtcSrc,
};

export default tokenToLogoMap;
