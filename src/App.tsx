import React from "react";
import { Loader, Text } from "@gnosis.pm/safe-react-components";
import { useAppState } from "./providers/app/AppProvider";
import DetailsProvider from "./providers/details/DetailsProvider";
import { Page } from "./types";
import Header from "./components/Header";
import Overview from "./pages/Overview";
import Withdraw from "./pages/Withdraw";
import Deposit from "./pages/Deposit";
import Details from "./pages/Details";

const App: React.FC = () => {
  const { isLoaded, currentPage } = useAppState();

  if (!isLoaded) {
    return <Loader size="md" />;
  }

  return (
    <React.Fragment>
      <Header />
      {currentPage === Page.Overview && <Overview />}
      {currentPage === Page.Deposit && <Deposit />}
      {currentPage === Page.Withdraw && <Withdraw />}
      {currentPage === Page.Details && (
        <DetailsProvider>
          <Details />
        </DetailsProvider>
      )}
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
    </React.Fragment>
  );
};

export default App;
