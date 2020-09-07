import React, { useCallback } from "react";
import styled from "styled-components";
import { Button, Title, Text, Loader } from "@gnosis.pm/safe-react-components";
import { useAppDispatch } from "../providers/app/AppProvider";
import { useDetailsState } from "../providers/details/DetailsProvider";
import { formatToken, formatDepositBalance, formatAPR } from "../utils/amounts";
import { Page } from "../types";

const Container = styled.div`
  margin-bottom: 2rem;
  width: 100%;
  max-width: 480px;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  max-width: 24px;
  margin-right: 0.5rem;
`;

const Table = styled.table`
  width: 100%;
`;

const Td = styled.td`
  padding: 0.4rem 0;
  border-bottom: 1px solid rgb(232, 231, 230);
`;

const StyledButton = styled(Button)`
  width: 100%;
`;

const Deposit: React.FC = () => {
  const { goToPage } = useAppDispatch();
  const { isLoaded, token } = useDetailsState();

  const goToOverview = useCallback(() => goToPage(Page.Overview), [goToPage]);

  console.log("render");

  if (!isLoaded || !token) {
    return <Loader size="md" />;
  }

  return (
    <Container>
      <Title size="xs">Details</Title>

      <Table>
        <tbody>
          <tr>
            <Td>
              <Text size="lg">Deposited token</Text>
            </Td>
            <Td>
              <Flex>
                <Logo src={token.logo} alt={token.tokenId} />
                <Text size="lg">{token.tokenId.toUpperCase()}</Text>
              </Flex>
            </Td>
          </tr>
          <tr>
            <Td>
              <Text size="lg">Deposit balance</Text>
            </Td>
            <Td>
              <Text size="lg">{formatDepositBalance(token)}</Text>
            </Td>
          </tr>
          <tr>
            <Td>
              <Text size="lg">APR*</Text>
            </Td>
            <Td>
              <Text size="lg">{formatAPR(token.avgAPR)}</Text>
            </Td>
          </tr>
          <tr>
            <Td>
              <Text size="lg">APR including value of governance tokens</Text>
            </Td>
            <Td>
              <Text size="lg">{formatAPR(token.avgAPR)}</Text>
            </Td>
          </tr>
          <tr>
            <Td>
              <Text size="lg">Governance tokens earned</Text>
            </Td>
            <Td></Td>
          </tr>
          <tr>
            <Td>
              <Text size="lg">Deposited</Text>
            </Td>
            <Td></Td>
          </tr>
          <tr>
            <Td>
              <Text size="lg">Profit</Text>
            </Td>
            <Td></Td>
          </tr>
        </tbody>
      </Table>

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
