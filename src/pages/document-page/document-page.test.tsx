import { setupMockIntrospection } from '@/../__mocks__/api-mock-helper';
import { setupStore } from '@/store';
import { act, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { DocumentPageComponent } from './document-page';
import { fetchSchema } from '@/slices';

describe('Document page component', () => {
  it('should display root page and back button', async () => {
    await defaultRender();
    expect(screen.getByText('Queries')).toBeInTheDocument();
    expect(screen.getByText('Mutations')).toBeInTheDocument();
    expect(screen.getByText('Subscriptions')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled();
  });

  it('should navigate to queries', async () => {
    await defaultRender();
    act(() => screen.getByText('Queries').click());
    const functions = screen.queryAllByTestId('doc_function');
    expect(functions.length).toBeGreaterThan(0);
    expect(
      functions.filter((e) => e.textContent?.trim() == 'myNumber():Int').length
    ).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Back' })).toBeEnabled();
  });

  it('should navigate front and back', async () => {
    await defaultRender();
    act(() => screen.getByText('Queries').click());
    const back = screen.getByRole('button', { name: 'Back' });
    expect(back).toBeEnabled();
    act(() => back.click());
    expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled();
    expect(screen.getByText('Queries')).toBeVisible();
  });

  async function defaultRender() {
    const store = setupStore();
    const mockClient = await setupMockIntrospection();
    await store.dispatch(fetchSchema({ client: mockClient, endpoint: 'dummy' }));

    render(
      <Provider store={store}>
        <DocumentPageComponent />
      </Provider>
    );
    await waitFor(() => screen.getByRole('button', { name: 'Back' }));
  }
});
