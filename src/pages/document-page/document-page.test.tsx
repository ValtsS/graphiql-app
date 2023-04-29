import { setupMockIntrospection } from '@/core/api/api-mock-helper';
import { fetchSchema } from '@/slices/schema/schema';
import { setupStore } from '@/store';
import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { DocumentPage } from './document-page';

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

  it('should navigate front and back', async () => {
    const store = setupStore();
    const mockClient = await setupMockIntrospection();
    await store.dispatch(fetchSchema({ client: mockClient, endpoint: 'dummy' }));

    render(
      <Provider store={store}>
        <DocumentPage />
      </Provider>
    );

    act(() => screen.getByText('Queries').click());
    const back = screen.getByRole('button', { name: 'Back' });
    expect(back).toBeEnabled();
    act(() => back.click());
    expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled();
    expect(screen.getByText('Queries')).toBeVisible();
  });
});
