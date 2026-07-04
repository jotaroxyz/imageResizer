import React from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider, type CSSVariablesResolver, rgba } from "@mantine/core";
import "@mantine/core/styles.css";
import "./index.css";
import App from "./App";
import { theme } from "./theme";
import { BrowserRouter } from "react-router-dom";

const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");

const root = createRoot(container);

const cssVariablesResolver: CSSVariablesResolver = (theme) => ({
  variables: {
    "--paper-bg": rgba(theme.colors.snow[9], 0.15),
  },
  dark: {},
  light: {}
});

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <MantineProvider theme={theme} defaultColorScheme="dark" cssVariablesResolver={cssVariablesResolver}>
        <App />
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>
);