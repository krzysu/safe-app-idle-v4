import React from "react";
import styled from "styled-components";
import { Loader, Text } from "@gnosis.pm/safe-react-components";
import { useAppState } from "./providers/AppProvider";
import { Page } from "./types";
import Header from "./components/Header";
import Overview from "./pages/Overview";
import Withdraw from "./pages/Withdraw";
import Deposit from "./pages/Deposit";

const Container = styled.div`
  padding: 24px;
`;

const App: React.FC = () => {
  const { isLoaded, currentPage } = useAppState();

  if (!isLoaded) {
    return <Loader size="md" />;
  }

  return (
    <Container>
      <Header />
      {currentPage === Page.Overview && <Overview />}
      {currentPage === Page.Deposit && <Deposit />}
      {currentPage === Page.Withdraw && <Withdraw />}
      <footer>
        <Text size="md">
          * APR doesn't include the value of governance tokens. Idle protocol is
          receiving governance tokens while allocating your funds. You will
          receive an equivalent share of governance tokens when you withdraw
          your funds.
        </Text>
        <Text size="md">
          The source code of this app is available on{" "}
          <a
            href="https://github.com/krzysu/safe-app-idle-v4"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </a>
        </Text>
      </footer>
    </Container>
  );
};

export default App;
