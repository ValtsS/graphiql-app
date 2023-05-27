import { SimpleMockApiClient } from '@/../__mocks__/SimpleMockApiClient';
import { setupMockIntrospection } from '@/../__mocks__/api-mock-helper';
import { IntrospectionResponseData } from '@/core/api/api';
import { fetchSchema } from '@/slices';
import { setupStore } from '@/store';
import { waitFor } from '@testing-library/dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { DocAccordeon } from './doc-accordeon';

describe('Document Accordeon component', () => {
  it('should handle errors', async () => {
    const mockError = 'Async error';
    const fn = jest.fn().mockRejectedValue(new Error(mockError));
    const mockClient = new SimpleMockApiClient<IntrospectionResponseData>(fn);
    const store = setupStore();
    await store.dispatch(fetchSchema({ client: mockClient, endpoint: 'dummy' }));

    render(
      <Provider store={store}>
        <DocAccordeon />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Documentation...')).toBeInTheDocument();
    });
    expect(screen.queryByText(/Async error/)).toBeInTheDocument();
  });

  it('render default', async () => {
    const store = setupStore();
    const { mockClient } = await setupMockIntrospection();
    await store.dispatch(fetchSchema({ client: mockClient, endpoint: 'dummy' }));

    render(
      <Provider store={store}>
        <DocAccordeon />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Documentation')).toBeInTheDocument();
    });
  });
});
