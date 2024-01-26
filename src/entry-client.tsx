import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './app';
import { allSettled, fork } from 'effector';
import { Provider } from 'effector-react';
import createEmotionCache from './shared/emotion';
import theme from './shared/theme';
import { CacheProvider } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { appStarted } from './shared/config/init.ts';

import.meta.glob(['./assets/**/*'], { eager: true, as: 'url' });

async function hydrate() {
  const cache = createEmotionCache();

  const clientScope = fork({
    values: _SERVER_STATE_,
  });

  hydrateRoot(
    document.getElementById('root')!,
    <StrictMode>
      <Provider value={clientScope}>
        <CacheProvider value={cache}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </CacheProvider>
      </Provider>
    </StrictMode>,
  );

  await allSettled(appStarted, {
    scope: clientScope,
  });
}

void hydrate();
