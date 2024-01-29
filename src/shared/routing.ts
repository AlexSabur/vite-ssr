import {
  createHistoryRouter,
  createRoute,
  createRouterControls,
} from 'atomic-router';
import { createStore, sample } from 'effector';
import { createBrowserHistory, createMemoryHistory, History } from 'history';
import { $pathname, appStarted } from './config/init.ts';

export const routes = {
  search: createRoute(),
  auth: {
    register: createRoute(),
    login: createRoute(),
  },
  notFoundRoute: createRoute(),
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
  notFoundRoute: routes.notFoundRoute,
  controls,
});

export const $status = createStore(200)
  .on(router.routeNotFound, () => 404)

const $history = createStore<History>(null as never, {
  serialize: 'ignore',
})

sample({
  clock: appStarted,
  source: $pathname,
  fn: (pathname) => import.meta.env.SSR ? createMemoryHistory({
    initialEntries: [pathname]
  }) : createBrowserHistory(),
  target: $history,
})

sample({
  clock: appStarted,
  source: $history,
  target: router.setHistory,
});
