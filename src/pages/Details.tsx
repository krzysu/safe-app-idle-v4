import React, { useCallback } from "react";
import styled from "styled-components";
import { Button, Title, Text, Loader } from "@gnosis.pm/safe-react-components";
import { useAppState, useAppDispatch } from "../providers/app/AppProvider";
import { useDetailsState } from "../providers/details/DetailsProvider";
import { Page } from "../types";

const Container = styled.div`
  margin-bottom: 2rem;
  width: 100%;
  max-width: 480px;
`;

const StyledButton = styled(Button)`
  width: 100%;
`;

const Deposit: React.FC = () => {
  const { goToPage } = useAppDispatch();
  const { isLoaded } = useDetailsState();
  const { currentTokenId, currentStrategyId } = useAppState();

  const goToOverview = useCallback(() => goToPage(Page.Overview), [goToPage]);

  if (!isLoaded) {
    return <Loader size="md" />;
  }

  return (
    <Container>
      <Title size="xs">Details</Title>
      <Text size="lg">
        Details page {currentTokenId} {currentStrategyId}
      </Text>
      <Text size="lg">Token</Text>
      <Text size="lg">Deposit balance</Text>
      <Text size="lg">APR</Text>
      <Text size="lg">Current alocation</Text>
      <Text size="lg">Real APR with governance tokens</Text>
      <Text size="lg">Governance token id and amount</Text>
      <Text size="lg">Profit</Text>
      <StyledButton
        size="md"
        color="secondary"
        type="button"
        onClick={goToOverview}
      >
        Go back
      </StyledButton>
    </Container>
  );
};

export default Deposit;
