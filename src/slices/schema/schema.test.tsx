import { SimpleMockApiClient } from '@/../__mocks__/SimpleMockApiClient';
import { IntrospectionResponseData } from '@/core/api/api';
import { MOCK_QUERY_EXPECTED, setupMockIntrospection } from '@/../__mocks__/api-mock-helper';
import { AppStore, setupStore } from '@/store';
import fuzzball from 'fuzzball';
import { StoreStatus, fetchSchema } from './schema';

describe('schemaSlice', () => {
  let store: AppStore;
  const mockEndpoint = 'http://dummy.local/';

  beforeEach(() => {
    store = setupStore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle fetchSchema.loading', async () => {
    const fn = jest.fn().mockReturnValue({});
    const mockClient = new SimpleMockApiClient<IntrospectionResponseData>(fn);
    const initial = store.getState().schema;
    expect(initial.status).toEqual(StoreStatus.idle);

    store.dispatch(fetchSchema({ client: mockClient, endpoint: mockEndpoint }));
    const state = store.getState().schema;
    expect(state.status).toEqual(StoreStatus.loading);
  });

  it('should handle fetchSchema.rejected', async () => {
    const mockError = 'Async error';
    const fn = jest.fn().mockRejectedValue(new Error(mockError));
    const mockClient = new SimpleMockApiClient<IntrospectionResponseData>(fn);
    const initial = store.getState().schema;
    expect(initial.status).toEqual(StoreStatus.idle);

    await store.dispatch(fetchSchema({ client: mockClient, endpoint: mockEndpoint }));
    const state = store.getState().schema;
    expect(state.status).toEqual(StoreStatus.failed);
    expect(state.endpoint).toBe(mockEndpoint);
    expect(state.error).toBe(mockError);
    expect(state.errorcounter).toBe(1);
  });

  it('should handle fetchSchema.fulfilled', async () => {
    const mockClient = await setupMockIntrospection();
    await store.dispatch(fetchSchema({ client: mockClient, endpoint: mockEndpoint }));

    const state = store.getState().schema;
    expect(state.status).toEqual(StoreStatus.succeeded);
    expect(fuzzball.ratio(state.schema, MOCK_QUERY_EXPECTED)).toBeGreaterThan(98);
    expect(state.endpoint).toEqual(mockEndpoint);
    expect(state.error).toBeUndefined();
    expect(state.errorcounter).toEqual(0);
  });
});
