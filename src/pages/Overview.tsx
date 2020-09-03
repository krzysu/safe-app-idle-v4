import React, { useMemo } from "react";
import { Text } from "@gnosis.pm/safe-react-components";
import { useAppState } from "../providers/AppProvider";
import Table from "../components/Table";
import MigrationTable from "../components/MigrationTable";
import { Strategy, TokenData } from "../types";

import bestYieldSrc from "../assets/best-on.svg";
import riskAdjustedSrc from "../assets/risk-on.svg";

import styles from "./Overview.module.css";

const findAllByStrategy = (tokenArray: TokenData[], strategyId: Strategy) => {
  return tokenArray.filter((token) => token.strategyId === strategyId);
};

const Overview: React.FC = () => {
  const { tokens, legacyTokens } = useAppState();

  const tokenArray = useMemo(
    () => Object.keys(tokens).map((key) => tokens[key]),
    [tokens]
  );
  const legacyTokenArray = useMemo(
    () => Object.keys(legacyTokens).map((key) => legacyTokens[key]),
    [legacyTokens]
  );

  const bestYieldTokens = useMemo(
    () => findAllByStrategy(tokenArray, Strategy.BestYield),
    [tokenArray]
  );
  const riskAdjustedTokens = useMemo(
    () => findAllByStrategy(tokenArray, Strategy.RiskAdjusted),
    [tokenArray]
  );

  return (
    <React.Fragment>
      <div className={styles.headline}>
        <Text size="lg">
          Earn the yield you deserve without worry about finding the best
          option, either if you want to optimize returns or risks. <br />
          <a
            className={styles.link}
            href="https://idle.finance/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more
          </a>
        </Text>
      </div>
      {legacyTokenArray.length > 0 && (
        <div className={styles.table}>
          <MigrationTable tokens={legacyTokenArray} />
        </div>
      )}
      {bestYieldTokens.length > 0 && (
        <div className={styles.table}>
          <Table
            iconSrc={bestYieldSrc}
            title="Best-Yield - Maximize your returns"
            tokens={bestYieldTokens}
          />
        </div>
      )}
      {riskAdjustedTokens.length > 0 && (
        <div className={styles.table}>
          <Table
            iconSrc={riskAdjustedSrc}
            title="Risk-Adjusted - Optimize your risk exposure"
            tokens={riskAdjustedTokens}
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default Overview;
