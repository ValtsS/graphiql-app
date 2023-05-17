import { setupMockIntrospection } from '@/../__mocks__/api-mock-helper';
import { SetupFirebaseMock } from '@/../__mocks__/firebaseMock';
import { waitRender } from '@/../__mocks__/test-utils';
import { FirebaseAuth } from '@/core/firebase/firebase';
import { AppContextProvider } from '@/provider/app-context-provider/app-context-provider';
import { ModalDialogProvider } from '@/provider/modal-dialog';
import { RootLayout, defaultRoutes } from '@/routes';
import { setupStore } from '@/store';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Main } from './Main';
import userEvent from '@testing-library/user-event';

jest.mock('monaco-editor');

describe('Main page component', () => {
  const testURL = 'https://dummy/';

  let mockAuth: FirebaseAuth;

  beforeEach(() => {
    mockAuth = SetupFirebaseMock(false);
  });

  it('should render and have change button', async () => {
    const { store } = await defaultRender();
    const state = store.getState();

    expect(state.main.endpoint.toLowerCase().startsWith('http')).toBe(true);
    expect(screen.getByText(state.main.endpoint));

    const changeButton = screen.getByRole('button', { name: 'Change Endpoint' });
    expect(changeButton).toBeVisible();
  });

  it('should render Be able to change endpoint', async () => {
    const { store } = await defaultRender();

    const changeButton = screen.getByRole('button', { name: 'Change Endpoint' });
    expect(changeButton).toBeVisible();
    act(() => changeButton.click());
    await waitRender();

    const addressInput = screen.getByTestId('addressbar-input');
    expect(addressInput).toBeVisible();

    const apply = screen.getByRole('button', { name: 'Apply' });
    expect(apply).toBeVisible();

    fireEvent.change(addressInput, { target: { value: testURL } });
    act(() => apply.click());
    await waitRender();

    const state = store.getState();
    expect(state.main.endpoint).toBe(testURL);
    expect(screen.getByText(state.main.endpoint));
  });

  it('should render and allow query to be pressed', async () => {
    const { store, callback } = await defaultRender();
    const state = store.getState();

    expect(state.main.endpoint.toLowerCase().startsWith('http')).toBe(true);
    expect(screen.getByText(state.main.endpoint));

    const responseText = 'ZZZZDummy';
    callback.mockResolvedValue(responseText);

    const sendButton = screen.getByRole('button', { name: 'Send query' });
    expect(sendButton).toBeVisible();
    expect(sendButton).toBeEnabled();
    await userEvent.click(sendButton);
    await waitRender();
    expect(store.getState().editors.response).toBe(`"${responseText}"`);
  });

  async function defaultRender() {
    const store = setupStore();
    const { mockClient, callback } = await setupMockIntrospection();

    act(() => {
      render(
        <AppContextProvider apiClient={mockClient} auth={mockAuth} routing={defaultRoutes}>
          <Provider store={store}>
            <ModalDialogProvider>
              <BrowserRouter>
                <RootLayout>
                  <Main />
                </RootLayout>
              </BrowserRouter>
            </ModalDialogProvider>
          </Provider>
        </AppContextProvider>
      );
    });
    await waitRender();
    return { store, callback };
  }
});
