import { renderToString } from 'react-dom/server';
import { StrictMode } from 'react';
import { Request } from 'express';
import App from './app';
import { allSettled, fork, serialize } from 'effector';
import { Provider } from 'effector-react';
import createEmotionCache from './shared/emotion';
import createEmotionServer from '@emotion/server/create-instance';
import { CacheProvider } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './shared/theme';
import { $pathname, appStarted } from './shared/config/init.ts';
import { $status } from './shared/routing.ts';

export async function render(req: Request) {
  const cache = createEmotionCache();
  const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);

  const scope = fork({
    values: [
      // some parts of app's state can be immediately set to relevant states,
      // before any computations started
      [$pathname, req.originalUrl],
    ],
  });

  // 2. start app's logic - all computations will be performed according to the model's logic,
  // as well as any required effects
  await allSettled(appStarted, {
    scope,
  });

  const status = scope.getState($status);
  console.log(status);

  // 3. Serialize the calculated state, so it can be passed over the network
  const storesValues = serialize(scope);

  const renderTemplate = renderToString(
    <StrictMode>
      <Provider value={scope}>
        <CacheProvider value={cache}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </CacheProvider>
      </Provider>
    </StrictMode>,
  );

  const emotionChunks = extractCriticalToChunks(renderTemplate);
  const emotionCss = constructStyleTagsFromChunks(emotionChunks);

  return { renderTemplate, storesValues, emotionCss, status };
}
