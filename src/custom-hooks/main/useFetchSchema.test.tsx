import { SimpleMockApiClient } from '@/../__mocks__/SimpleMockApiClient';
import { MOCK_QUERY_EXPECTED, setupMockIntrospection } from '@/../__mocks__/api-mock-helper';
import { waitRender } from '@/../__mocks__/test-utils';
import { ApiClient } from '@/core/api/api-client';
import { AppContextProvider } from '@/provider';
import { StoreStatus } from '@/slices';
import { AppStore, setupStore } from '@/store';
import { render } from '@testing-library/react';
import fuzzball from 'fuzzball';
import React from 'react';
import { Provider } from 'react-redux';
import { useFetchSchema } from './useFetchSchema';

const TestFetchSchema = () => {
  useFetchSchema();
  return <></>;
};

describe('useFetchSchema', () => {
  let store: AppStore;

  beforeEach(() => {
    const defaultStore = setupStore();
    const initial = defaultStore.getState();
    store = setupStore({
      ...initial,
      main: {
        ...initial.main,
        endpoint: 'https://fake/',
      },
    });
  });

  test('should create and return the model', async () => {
    const { mockClient, callback } = await setupMockIntrospection();
    expect(callback).toBeCalledTimes(0);
    await defaultRender(mockClient);
    expect(callback).toBeCalledTimes(1);
    const post = store.getState();
    expect(fuzzball.ratio(post.schema.schema, MOCK_QUERY_EXPECTED)).toBeGreaterThan(98);
    expect(post.schema.status).toBe(StoreStatus.succeeded);
  });

  test('should create and return the model', async () => {
    const fn = jest.fn();
    const errorText = 'Network error';
    fn.mockRejectedValue(new Error(errorText));
    const mockClient = new SimpleMockApiClient(fn);
    await defaultRender(mockClient);
    expect(fn).toBeCalledTimes(1);
    const post = store.getState();
    expect(post.schema.status).toBe(StoreStatus.failed);
    expect(post.schema.error).toBe(errorText);
  });

  async function defaultRender(mockClient: ApiClient) {
    render(
      <AppContextProvider apiClient={mockClient}>
        <Provider store={store}>
          <TestFetchSchema></TestFetchSchema>
        </Provider>
      </AppContextProvider>
    );
    await waitRender();
  }
});
