import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "@gnosis.pm/safe-react-components";

import GlobalStyle from "./components/GlobalStyle";
import SafeAppProvider from "./providers/SafeAppProvider";
import AppProvider from "./providers/app/AppProvider";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <SafeAppProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </SafeAppProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
