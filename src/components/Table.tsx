import React, { useCallback } from "react";
import { Button, Text } from "@gnosis.pm/safe-react-components";
import { useAppDispatch } from "../providers/app/AppProvider";
import { formatToken, formatAPR, formatDepositBalance } from "../utils/amounts";
import { Balance, TokenData, Page } from "../types";

import styles from "./Table.module.css";

const hasZeroBalance = (token: Balance) => token.balance.eq(0);

type Props = {
  iconSrc: string;
  title: string;
  tokens: TokenData[];
};

const Table: React.FC<Props> = ({ iconSrc, title, tokens }) => {
  const { goToPage } = useAppDispatch();

  const goToDeposit = useCallback(
    (tokenId, strategyId) => () => goToPage(Page.Deposit, tokenId, strategyId),
    [goToPage]
  );

  const goToWithdraw = useCallback(
    (tokenId, strategyId) => () => goToPage(Page.Withdraw, tokenId, strategyId),
    [goToPage]
  );

  const goToDetails = useCallback(
    (tokenId, strategyId) => () => goToPage(Page.Details, tokenId, strategyId),
    [goToPage]
  );

  return (
    <React.Fragment>
      <div className={styles.header}>
        <img src={iconSrc} alt={title} className={styles.logo} />
        <Text size="xl">{title}</Text>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th></th>
            <th>
              <Text size="lg">Wallet balance</Text>
            </th>
            <th>
              <Text size="lg">Deposit balance</Text>
            </th>
            <th>
              <Text size="lg">APR*</Text>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr key={token.tokenId}>
              <td className={styles.fixedCol}>
                <div className={styles.tokenName}>
                  <img
                    src={token.logo}
                    alt={token.tokenId}
                    className={styles.logo}
                  />
                  <Text size="lg">{token.tokenId.toUpperCase()}</Text>
                </div>
              </td>
              <td className={styles.fixedCol}>
                <Text size="lg">{formatToken(token.underlying)}</Text>
              </td>
              <td className={styles.fixedCol}>
                {hasZeroBalance(token.idle) ? (
                  <Text size="lg">{formatDepositBalance(token)}</Text>
                ) : (
                  <button
                    className={styles.buttonLink}
                    onClick={goToDetails(token.tokenId, token.strategyId)}
                  >
                    <Text size="lg">{formatDepositBalance(token)}</Text>
                  </button>
                )}
              </td>
              <td>
                <Text size="lg">{formatAPR(token.avgAPR)}</Text>
              </td>
              <td>
                <div className={styles.buttons}>
                  <div className={styles.buttonWrap}>
                    <Button
                      size="md"
                      color="primary"
                      variant="contained"
                      disabled={
                        hasZeroBalance(token.underlying) || token.isPaused
                      }
                      onClick={goToDeposit(token.tokenId, token.strategyId)}
                    >
                      Deposit
                    </Button>
                  </div>
                  <div className={styles.buttonWrap}>
                    <Button
                      size="md"
                      color="secondary"
                      variant="contained"
                      disabled={hasZeroBalance(token.idle)}
                      onClick={goToWithdraw(token.tokenId, token.strategyId)}
                    >
                      Withdraw
                    </Button>
                  </div>
                </div>
                {token.isPaused && (
                  <Text size="lg" color="error">
                    The contract is paused. Deposits are disabled.
                  </Text>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </React.Fragment>
  );
};

export default Table;
