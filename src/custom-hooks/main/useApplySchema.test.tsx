import { MOCK_QUERY_EXPECTED } from '@/../__mocks__/api-mock-helper';
import { waitRender } from '@/../__mocks__/test-utils';
import { AppStore, setupStore } from '@/store';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { useApplySchema } from './useApplySchema';
import { AppContextProvider, useAppContext } from '@/provider';
import { StoreStatus } from '@/slices';
import { initializeMode } from 'monaco-graphql/esm/initializeMode';

const mockToaster = jest.fn();

jest.mock('react-toastify', () => ({
  toast: jest.fn().mockImplementation((...expected) => mockToaster(expected)),
}));

const TestApplySchema = () => {
  useApplySchema();
  const a = useAppContext();
  return <>{a.currentSchema ? 'SET' : 'missing'}</>;
};

describe('useFetchSchema', () => {
  let store: AppStore;
  const defaultStore = setupStore();
  const textTest = 'DUMMY';
  const dummyURL = 'https://fake/';
  const initial = defaultStore.getState();

  beforeEach(() => {
    mockToaster.mockReset();
  });

  test('should parse and apply ', async () => {
    store = setupStore({
      ...initial,
      main: {
        ...initial.main,
        endpoint: dummyURL,
      },
      schema: {
        ...initial.schema,
        endpoint: dummyURL,
        schema: MOCK_QUERY_EXPECTED,
        status: StoreStatus.succeeded,
      },
      editors: {
        ...initial.editors,
        queryError: textTest,
      },
    });
    expect(store.getState().editors.queryError).toBe(textTest);
    await defaultRender();
    expect(screen.getByText('SET')).toBeInTheDocument();
    const api = initializeMode({});
    expect(api.setSchemaConfig).toHaveBeenCalledTimes(1);
    expect(store.getState().editors.queryError).toBeUndefined();
    expect(mockToaster).toBeCalledTimes(0);
  });

  test('should throw error', async () => {
    store = setupStore({
      ...initial,
      main: {
        ...initial.main,
        endpoint: dummyURL,
      },
      schema: {
        ...initial.schema,
        endpoint: dummyURL,
        schema: '{}',
        status: StoreStatus.succeeded,
      },
      editors: {
        ...initial.editors,
        queryError: textTest,
      },
    });
    expect(store.getState().editors.queryError).toBe(textTest);
    await defaultRender();
    expect(screen.getByText('missing')).toBeInTheDocument();
    const api = initializeMode({});
    expect(api.setSchemaConfig).toHaveBeenCalledTimes(0);
    expect(store.getState().editors.queryError).toBeUndefined();
    expect(mockToaster).toBeCalledTimes(1);
  });

  async function defaultRender() {
    render(
      <AppContextProvider apiClient={null} auth={null}>
        <Provider store={store}>
          <TestApplySchema />
        </Provider>
      </AppContextProvider>
    );
    await waitRender();
  }
});
