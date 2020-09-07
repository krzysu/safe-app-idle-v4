import React, { useMemo } from "react";
import styled from "styled-components";
import { Button, Text } from "@gnosis.pm/safe-react-components";
import { useAppState } from "../providers/app/AppProvider";
import Table from "../components/Table";
import MigrationTable from "../components/MigrationTable";
import { Strategy, TokenData } from "../types";

import bestYieldSrc from "../assets/best-on.svg";
import riskAdjustedSrc from "../assets/risk-on.svg";

const Header = styled.div`
  margin-top: 1rem;
  margin-bottom: 2.5rem;
`;

const RefreshWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const TableWrap = styled.div`
  margin-bottom: 2.5rem;
`;

const ExtLink = styled.a`
  color: #008c73;
`;

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
      <Header>
        <Text size="lg">
          The best place for your money. Choose your strategy and earn the yield
          you deserve without worry about finding the best option, either if you
          want to optimize returns or risks.{" "}
          <ExtLink
            href="https://idle.finance/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more
          </ExtLink>
          .
        </Text>
        <Text size="lg">
          Read also about{" "}
          <ExtLink
            href="https://medium.com/@idlefinance/idle-yield-farming-upgrade-18e4bc483c8f"
            target="_blank"
            rel="noopener noreferrer"
          >
            Yield Farming Upgrade
          </ExtLink>
          .
        </Text>

        <RefreshWrapper>
          <Button
            size="md"
            color="secondary"
            iconType="resync"
            variant="contained"
            onClick={() => window.location.reload()}
          >
            Refresh balances
          </Button>
        </RefreshWrapper>
      </Header>
      {legacyTokenArray.length > 0 && (
        <TableWrap>
          <MigrationTable tokens={legacyTokenArray} />
        </TableWrap>
      )}
      {bestYieldTokens.length > 0 && (
        <TableWrap>
          <Table
            iconSrc={bestYieldSrc}
            title="Best-Yield - Maximize your returns"
            tokens={bestYieldTokens}
          />
        </TableWrap>
      )}
      {riskAdjustedTokens.length > 0 && (
        <TableWrap>
          <Table
            iconSrc={riskAdjustedSrc}
            title="Risk-Adjusted - Optimize your risk exposure"
            tokens={riskAdjustedTokens}
          />
        </TableWrap>
      )}
    </React.Fragment>
  );
};

export default Overview;
