import { setupStore } from '@/store';
import { notificationsSlice } from './notificationsSlice';

describe('notificationsSlice tests', () => {
  it('tests queue', async () => {
    const store = setupStore();
    const testVal = '134567';
    const testVal2 = '988765';

    let action = notificationsSlice.actions.setMessage({ message: testVal, error: false });

    store.dispatch(action);

    let updatedState = store.getState();
    expect(updatedState.notifications.message).toEqual(testVal);
    expect(updatedState.notifications.error).toEqual(false);

    action = notificationsSlice.actions.setMessage({ message: testVal2, error: true });

    store.dispatch(action);

    updatedState = store.getState();
    expect(updatedState.notifications.message).toEqual(testVal);
    expect(updatedState.notifications.error).toEqual(false);

    const clearaction = notificationsSlice.actions.clearMessage();
    store.dispatch(clearaction);

    updatedState = store.getState();
    expect(updatedState.notifications.message).toEqual(testVal2);
    expect(updatedState.notifications.error).toEqual(true);

    store.dispatch(clearaction);

    updatedState = store.getState();
    expect(updatedState.notifications.message).toBeUndefined();
    expect(updatedState.notifications.error).toEqual(false);
  });
});
