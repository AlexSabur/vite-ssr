import { createEvent } from 'effector';
import { routes } from '../../shared/routing.ts';

export const currentRoute = routes.auth.login;

export const pageMounted = createEvent();
