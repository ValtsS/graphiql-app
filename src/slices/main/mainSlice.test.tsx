import { AppStore, setupStore } from '@/store';
import { changeEndpoint } from './mainSlice';

describe('Main Slice', () => {
  let store: AppStore;

  beforeEach(() => {
    store = setupStore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle endpoint update', async () => {
    const testString = 'dummy';
    const initial = store.getState().main;
    expect(initial.endpoint).not.toBe(testString);
    store.dispatch(changeEndpoint({ endpoint: testString }));
    const updated = store.getState().main;
    expect(updated.endpoint).toBe(testString);
  });
});
