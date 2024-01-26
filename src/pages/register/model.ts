import { createEvent } from 'effector';
import { routes } from '../../shared/routing.ts';

export const currentRoute = routes.auth.register;

export const pageMounted = createEvent();
