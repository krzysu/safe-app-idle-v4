import React from "react";
import { Loader, Text } from "@gnosis.pm/safe-react-components";
import { useAppState } from "./providers/AppProvider";
import { Page } from "./utils/types";
import Header from "./components/Header";
import Overview from "./pages/Overview";
import Withdraw from "./pages/Withdraw";
import Deposit from "./pages/Deposit";

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
      <footer>
        <Text size="md">
          The source code of this app is available on{" "}
          <a
            href="https://github.com/krzysu/safe-app-idle-ts"
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
