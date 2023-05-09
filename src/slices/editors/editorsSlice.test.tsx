import { SimpleMockApiClient } from '@/../__mocks__/SimpleMockApiClient';
import { IntrospectionResponseData } from '@/core/api/api';
import { AppStore, setupStore } from '@/store';
import { StoreStatus } from '../schema/schema';
import { sendQueryGQL, setQuery, setQueryError, setResponse, setVariables } from './editorsSlice';

describe('Editors Slice', () => {
  let store: AppStore;

  const mockEndpoint = 'http://dummy.local/';

  beforeEach(() => {
    store = setupStore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle query update', async () => {
    const initial = store.getState().editors;
    const testText = 'TestText';
    store.dispatch(setQuery({ version: 1, text: testText }));
    const updated = store.getState().editors;
    expect(updated.query).not.toBe(initial.query);
    expect(updated.query).toBe(testText);
    expect(updated.queryVersion).toBe(1);
  });

  it('should handle query update-skip', async () => {
    const initial = store.getState().editors;
    store.dispatch(setQuery({ version: -999, text: 'Skip' }));
    const updated = store.getState().editors;
    expect(updated.query).toBe(initial.query);
    expect(updated.queryVersion).toBe(initial.queryVersion);
  });

  it('should handle query error update', async () => {
    const initial = store.getState().editors;
    const error = 'ErrorText';
    store.dispatch(setQueryError({ error }));
    const updated = store.getState().editors;
    expect(updated.queryError).not.toBe(initial.queryError);
    expect(updated.queryError).toBe(error);
  });

  it('should handle variables update', async () => {
    const initial = store.getState().editors;
    const testText = 'TestText2';
    store.dispatch(setVariables({ version: 2, text: testText }));
    const updated = store.getState().editors;
    expect(updated.variables).not.toBe(initial.query);
    expect(updated.variables).toBe(testText);
    expect(updated.variablesVersion).toBe(2);
  });

  it('should handle variable update-skip', async () => {
    const initial = store.getState().editors;
    store.dispatch(setVariables({ version: -998, text: 'Skip-Two' }));
    const updated = store.getState().editors;
    expect(updated.variables).toBe(initial.variables);
    expect(updated.variablesVersion).toBe(initial.variablesVersion);
  });

  it('should handle response update', async () => {
    const initial = store.getState().editors;
    const responseText = 'TestText3';
    store.dispatch(setResponse({ responseText }));
    const updated = store.getState().editors;
    expect(updated.response).not.toBe(initial.response);
    expect(updated.response).toBe(responseText);
  });

  it('should handle sendQueryGQL.loading', async () => {
    const fn = jest.fn().mockReturnValue({});
    const mockClient = new SimpleMockApiClient<IntrospectionResponseData>(fn);
    const initial = store.getState().editors;
    expect(initial.apiStatus).toBe(StoreStatus.idle);
    store.dispatch(
      sendQueryGQL({
        client: mockClient,
        endpoint: mockEndpoint,
        query: '{ Q }',
        variables: '{ V }',
      })
    );
    const state = store.getState().editors;
    expect(state.apiStatus).toEqual(StoreStatus.loading);
  });

  it('should handle sendQueryGQL.fulfilled', async () => {
    const dummy = { data: { re: '1235' } };
    const fn = jest.fn().mockReturnValue(dummy);
    const mockClient = new SimpleMockApiClient<IntrospectionResponseData>(fn);
    const initial = store.getState().editors;
    expect(initial.apiStatus).toBe(StoreStatus.idle);
    await store.dispatch(
      sendQueryGQL({
        client: mockClient,
        endpoint: mockEndpoint,
        query: '{  }',
        variables: '{  }',
      })
    );
    const state = store.getState().editors;

    expect(state.apiStatus).toEqual(StoreStatus.succeeded);
    expect(JSON.parse(state.response)).toEqual(dummy);
  });

  it('should handle sendQueryGQL.rejected', async () => {
    const mockError = 'Async error';
    const fn = jest.fn().mockRejectedValue(new Error(mockError));
    const mockClient = new SimpleMockApiClient<IntrospectionResponseData>(fn);
    const initial = store.getState().editors;
    expect(initial.apiStatus).toEqual(StoreStatus.idle);

    await store.dispatch(
      sendQueryGQL({
        client: mockClient,
        endpoint: mockEndpoint,
        query: '{  }',
        variables: '{  }',
      })
    );
    const state = store.getState().editors;
    expect(state.apiStatus).toEqual(StoreStatus.failed);
  });
});
