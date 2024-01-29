import { createEvent, createStore } from 'effector';

export const appStarted = createEvent();
export const $pathname = createStore<string>(null as never);
