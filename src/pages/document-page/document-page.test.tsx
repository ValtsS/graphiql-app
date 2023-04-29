import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { setupStore } from '@/store';
import { DocumentPage } from './document-page';
import { setupMockIntrospection } from '@/core/api/api-mock-helper';
import { fetchSchema } from '@/slices/schema/schema';

describe('Document page component', () => {
  it('should display root page and back button', async () => {
    const store = setupStore();
    const mockClient = await setupMockIntrospection();
    await store.dispatch(fetchSchema({ client: mockClient, endpoint: 'dummy' }));

    render(
      <Provider store={store}>
        <DocumentPage />
      </Provider>
    );

    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    expect(screen.getByText('Queries')).toBeInTheDocument();
    expect(screen.getByText('Mutations')).toBeInTheDocument();
    expect(screen.getByText('Subscriptions')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled();
  });

  it('should navigate to queries', async () => {
    const store = setupStore();
    const mockClient = await setupMockIntrospection();
    await store.dispatch(fetchSchema({ client: mockClient, endpoint: 'dummy' }));

    render(
      <Provider store={store}>
        <DocumentPage />
      </Provider>
    );

    act(() => screen.getByText('Queries').click());
    const functions = screen.queryAllByTestId('doc_function');
    expect(functions.length).toBeGreaterThan(0);
    expect(
      functions.filter((e) => e.textContent?.trim() == 'myNumber():Int').length
    ).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Back' })).toBeEnabled();
  });
});
