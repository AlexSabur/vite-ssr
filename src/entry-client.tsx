import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import App, { appStarted } from "./app";
import { allSettled, fork } from "effector";
import { Provider } from "effector-react";
import createEmotionCache from "./shared/emotion";
import theme from "./shared/theme";
import { CacheProvider } from "@emotion/react";
import { CssBaseline, ThemeProvider } from "@mui/material";

import.meta.glob(["./assets/**/*"], { eager: true, as: "url" });

async function hydrate() {
  const cache = createEmotionCache();

  const effectorState = globalThis._SERVER_STATE_;

  const clientScope = fork({
    values: effectorState,
  });

  hydrateRoot(
    document.getElementById("root")!,
    <StrictMode>
      <Provider value={clientScope}>
        <CacheProvider value={cache}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </CacheProvider>
      </Provider>
    </StrictMode>
  );

  await allSettled(appStarted, {
    scope: clientScope,
  });
}

void hydrate();
