import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import { formatAmount } from "./formatAmount";
import { Balance, Form, Strategy, Token, TokenData } from "./types";

const balanceToBN = ({ balance, decimals }: Balance): BigNumber => {
  const balanceString = ethers.utils.formatUnits(balance, decimals);
  return BNify(balanceString);
};

const parseUnits = (valueString: string, decimals: number): ethers.BigNumber =>
  ethers.utils.parseUnits(valueString, decimals);

export const BNify = (s: string | number) => new BigNumber(String(s));

export const getIdleTokenId = (strategyId: Strategy, tokenId: Token) =>
  `${strategyId}_${tokenId}`;

export const formatToken = ({ balance, decimals }: Balance): string =>
  formatAmount(balanceToBN({ balance, decimals }).toFixed());

export const formatAPR = (balance: ethers.BigNumber) =>
  `${balanceToBN({ balance, decimals: 18 }).toFixed(2)}%`;

export const tokenPriceToBN = (token: TokenData) =>
  balanceToBN({
    balance: token.tokenPrice,
    decimals: token.underlying.decimals,
  });

// multiply idle token balance with token price
export const depositBalanceToBN = (token: TokenData) =>
  balanceToBN(token.idle).multipliedBy(tokenPriceToBN(token));

export const formatDepositBalance = (token: TokenData) =>
  formatAmount(depositBalanceToBN(token).toFixed());

export const calculateMaxAmountBN = (formType: Form, formToken: TokenData) => {
  if (formType === Form.Deposit) {
    return balanceToBN(formToken.underlying);
  }

  if (formType === Form.Withdraw) {
    return depositBalanceToBN(formToken);
  }

  return new BigNumber("0");
};

export const calculateRealAmountWei = (
  formType: Form,
  formToken: TokenData,
  amountBN: BigNumber
) => {
  if (formType === Form.Deposit) {
    return parseUnits(
      amountBN.toFixed(formToken.underlying.decimals),
      formToken.underlying.decimals
    );
  }

  if (formType === Form.Withdraw) {
    // divide amount by tokenPrice
    const idleBalanceBN = amountBN.dividedBy(tokenPriceToBN(formToken));
    return parseUnits(
      idleBalanceBN.toFixed(formToken.idle.decimals),
      formToken.idle.decimals
    );
  }

  return new ethers.BigNumber("0", "18");
};
