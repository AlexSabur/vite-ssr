import { Button } from '@mui/material';
import { createEvent, createStore, createEffect, sample, combine } from 'effector';
import { useUnit } from 'effector-react';
import { Form } from './form.tsx';

const sleep = (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout));

// model
export const appStarted = createEvent();
export const $pathname = createStore<string | null>(null);

const $counter = createStore<number | null>(null);

const fetchUserCounterFx = createEffect(async () => {
  await sleep(100); // in real life it would be some api request

  return Math.floor(Math.random() * 100);
});

const buttonClicked = createEvent();
const saveUserCounterFx = createEffect(async () => {
  await sleep(100); // in real life it would be some api request
});

sample({
  clock: appStarted,
  source: $counter,
  filter: (count) => count === null, // if count is already fetched - do not fetch it again
  target: fetchUserCounterFx,
});

sample({
  clock: fetchUserCounterFx.doneData,
  target: $counter,
});

sample({
  clock: buttonClicked,
  source: $counter,
  fn: (count) => (count || 0) + 1,
  target: [$counter, saveUserCounterFx],
});

const $countUpdatePending = combine([fetchUserCounterFx.pending, saveUserCounterFx.pending], (updates) =>
  updates.some((upd) => upd),);

const $isClient = createStore(typeof document !== 'undefined', {
  /**
   * Here we're explicitly telling effector, that this store, which depends on the environment,
   * should be never included in serialization
   * as it's should be always calculated based on actual current env
   *
   * This is not actually necessary, because only diff of state changes is included into serialization
   * and this store is not going to be changed.
   *
   * But it is good to add this setting anyway - to highlight the intention
   */
  serialize: 'ignore',
});

const notifyFx = createEffect((message: string) => {
  alert(message);
});

sample({
  clock: [
    saveUserCounterFx.done.map(() => 'Counter update is saved successfully'),
    saveUserCounterFx.fail.map(() => 'Could not save the counter update :('),
  ],
  // It is totally ok to have some splits in the app's logic based on current environment
  //
  // Here we want to trigger notification alert only at the client
  filter: $isClient,
  target: notifyFx,
});

// ui
function App() {
  const clickButton = useUnit(buttonClicked);
  const { count, updatePending } = useUnit({
    count: $counter,
    updatePending: $countUpdatePending,
  });

  return (
    <div>
      <h1>Counter App</h1>
      <h2>{updatePending ? 'Counter is updating' : `Current count is ${count ?? 'unknown'}`}</h2>
      <Button onClick={() => clickButton()}>Update counter</Button>
      <Form />
    </div>
  );
}

export default App;
