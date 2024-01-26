import { createHistoryRouter, createRoute, createRouterControls } from 'atomic-router';
import { createEffect, sample } from 'effector';
import { createBrowserHistory, createMemoryHistory } from 'history';
import { $pathname, appStarted } from './config/init.ts';

export const routes = {
  search: createRoute(),
  auth: {
    register: createRoute(),
    login: createRoute(),
  },
};

export const controls = createRouterControls();

export const router = createHistoryRouter({
  routes: [
    {
      path: '/register',
      route: routes.auth.register,
    },
    {
      path: '/login',
      route: routes.auth.login,
    },
    {
      path: '/',
      route: routes.search,
    },
  ],
  controls,
});

const history = import.meta.env.SSR ? createMemoryHistory() : createBrowserHistory();

const historyPushFx = createEffect(({ to, state }: { to: string | null; state?: object }) => {
  history.push(to!, state);
});

sample({
  clock: appStarted,
  source: $pathname,
  filter: () => import.meta.env.SSR,
  fn: (pathname) => ({ to: pathname }),
  target: historyPushFx,
});

sample({
  clock: appStarted,
  fn: () => history,
  target: router.setHistory,
});
