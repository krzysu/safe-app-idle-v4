import React, { useState, useEffect } from "react";
import { Button, Text, TextField } from "@gnosis.pm/safe-react-components";
import { useAppState, useAppDispatch } from "../providers/AppProvider";
import {
  BNify,
  calculateMaxAmountBN,
  calculateRealAmountWei,
  getIdleTokenId,
  formatToken,
  formatAPR,
  formatDepositBalance,
} from "../utils/amounts";
import { Form as FormType, TokenData, Token, Strategy, TxData } from "../types";
import TokenSelect from "./TokenSelect";
import StrategySelect from "./StrategySelect";

import styles from "./Form.module.css";

const buttonLabels = {
  [FormType.Deposit]: "Deposit",
  [FormType.Withdraw]: "Withdraw",
};

const getFormTokenBalance = (formToken: TokenData, formType: FormType) => {
  if (formType === FormType.Deposit) {
    return `Balance: ${formatToken(formToken.underlying)}`;
  }

  if (formType === FormType.Withdraw) {
    return `Deposit balance: ${formatDepositBalance(formToken)}`;
  }
};

type Props = {
  onSubmit: (obj: TxData) => void;
  onBackClick: () => void;
  formType: FormType;
};

const Form: React.FC<Props> = ({ onSubmit, onBackClick, formType }) => {
  const {
    tokens,
    tokenSelectItems,
    strategySelectItems,
    currentTokenId,
    currentStrategyId,
  } = useAppState();
  const { updateTokenPrice } = useAppDispatch();

  const [tokenId, setTokenId] = useState<Token>(currentTokenId || Token.DAI);
  const [strategyId, setStrategyId] = useState<Strategy>(
    currentStrategyId || Strategy.BestYield
  );
  const [amountBN, setAmountBN] = useState(BNify(0)); // user friendly amount always in underlying token
  const [isValid, setIsValid] = useState(false);
  const [formToken, setFormToken] = useState(
    tokens[getIdleTokenId(strategyId, tokenId)]
  );
  const [maxAmountBN, setMaxAmountBN] = useState(
    calculateMaxAmountBN(formType, formToken)
  );
  // when withdraw -> amount of idle tokens; when deposit -> amount of underlying tokens
  const [realAmountWei, setRealAmountWei] = useState(
    calculateRealAmountWei(formType, formToken, amountBN)
  );

  // update the token which form currently operates on, based on strategy and token dropdowns
  useEffect(() => {
    const newFormToken = tokens[getIdleTokenId(strategyId, tokenId)];
    setFormToken(newFormToken);
    setMaxAmountBN(calculateMaxAmountBN(formType, newFormToken));
    setAmountBN(BNify(0));
  }, [formType, tokens, tokenId, strategyId]);

  // update price on withdraw form to show actual deposit balance
  useEffect(() => {
    if (formType === FormType.Withdraw) {
      updateTokenPrice(strategyId, tokenId);
    }
  }, [updateTokenPrice, formType, strategyId, tokenId]);

  // simple form validation
  useEffect(() => {
    if (amountBN.gt(0) && amountBN.lte(maxAmountBN)) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [amountBN, maxAmountBN]);

  // update realAmountWei when amountBN change
  useEffect(() => {
    setRealAmountWei(calculateRealAmountWei(formType, formToken, amountBN));
  }, [formType, formToken, amountBN]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ tokenId, strategyId, amountWei: realAmountWei });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div>
        <label>
          <Text size="lg">Strategy</Text>
        </label>
        <StrategySelect
          value={strategyId}
          onChange={(s) => setStrategyId(s as Strategy)}
          items={strategySelectItems}
          tokenId={tokenId}
        />
      </div>
      <div>
        <label className={styles.assetLabel}>
          <Text size="lg">Asset</Text>
          <Text size="lg">{`APR: ${formatAPR(formToken.avgAPR)}`}</Text>
        </label>
        <TokenSelect
          value={tokenId}
          onChange={(t) => setTokenId(t as Token)}
          items={tokenSelectItems}
          strategyId={strategyId}
        />
      </div>
      <div className={styles.amount}>
        <label className={styles.amountLabel}>
          <Text size="lg">{getFormTokenBalance(formToken, formType)}</Text>
        </label>
        <div>
          <TextField
            label="Amount"
            type="number"
            placeholder="0.0"
            value={amountBN.toFixed()}
            onChange={(e) => setAmountBN(BNify(e.target.value || 0))}
          />
          <div className={styles.split}>
            <button
              className={styles.link}
              type="button"
              onClick={() => setAmountBN(maxAmountBN.div(4))}
            >
              <Text size="md">25%</Text>
            </button>
            <button
              className={styles.link}
              type="button"
              onClick={() => setAmountBN(maxAmountBN.div(2))}
            >
              <Text size="md">50%</Text>
            </button>
            <button
              className={styles.link}
              type="button"
              onClick={() => setAmountBN(maxAmountBN.times(3).div(4))}
            >
              <Text size="md">75%</Text>
            </button>
            <button
              className={styles.link}
              type="button"
              onClick={() => setAmountBN(maxAmountBN)}
            >
              <Text size="md">MAX</Text>
            </button>
          </div>
        </div>
      </div>

      <Button
        size="lg"
        color="primary"
        variant="contained"
        type="submit"
        className={styles.button}
        disabled={!isValid}
      >
        {buttonLabels[formType]}
      </Button>

      <Button
        size="md"
        color="secondary"
        type="button"
        className={styles.button}
        onClick={onBackClick}
      >
        Cancel
      </Button>
    </form>
  );
};

export default Form;
