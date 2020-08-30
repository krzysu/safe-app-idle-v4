import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "@gnosis.pm/safe-react-components";

import GlobalStyle from "./components/GlobalStyle";
import SafeAppProvider from "./providers/SafeAppProvider";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <SafeAppProvider>
        <App />
      </SafeAppProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
