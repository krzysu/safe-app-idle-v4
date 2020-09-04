import React, { useCallback } from "react";
import { Button, Text } from "@gnosis.pm/safe-react-components";
import { useSafeApp } from "../providers/SafeAppProvider";
import { useAppState } from "../providers/AppProvider";
import { formatDepositBalance, getIdleTokenId } from "../utils/amounts";
import { TokenData, Token, Strategy } from "../types";

import styles from "./Table.module.css";

type Props = {
  tokens: TokenData[];
};

const MigrationTable: React.FC<Props> = ({ tokens }) => {
  const { appsSdk } = useSafeApp();
  const { legacyContracts, legacyTokens } = useAppState();

  const withdrawAll = useCallback(
    (tokenId: Token, strategyId: Strategy) => () => {
      const idleTokenId = getIdleTokenId(strategyId, tokenId);
      const { idleContract } = legacyContracts[idleTokenId];
      const { idle } = legacyTokens[idleTokenId];

      const txs = [
        {
          to: idleContract.address,
          value: "0",
          data: idleContract.interface.encodeFunctionData("redeemIdleToken", [
            idle.balance,
            true,
            [],
          ]),
        },
      ];

      appsSdk?.sendTransactions(txs);
    },
    [appsSdk, legacyContracts, legacyTokens]
  );

  return (
    <React.Fragment>
      <div className={styles.header}>
        <Text size="xl" strong>
          Please withdraw your tokens from the legacy contracts
        </Text>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th>
              <Text size="lg">Deposit balance</Text>
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
              <td className={styles.fixedCol}></td>
              <td className={styles.fixedCol}>
                <Text size="lg">{formatDepositBalance(token)}</Text>
              </td>
              <td>
                <div className={styles.buttons}>
                  <div className={styles.buttonWrap}>
                    <Button
                      size="md"
                      color="secondary"
                      variant="contained"
                      onClick={withdrawAll(token.tokenId, token.strategyId)}
                    >
                      Withdraw all
                    </Button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </React.Fragment>
  );
};

export default MigrationTable;
