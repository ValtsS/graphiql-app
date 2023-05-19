import { FirebaseMock, SetupFirebaseMock } from '@/../__mocks__/firebaseMock';
import { waitRender } from '@/../__mocks__/test-utils';
import { AppContextProvider } from '@/provider';
import { defaultRoutes } from '@/routes';
import { setupStore } from '@/store';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Welcome } from './Welcome';

const store = setupStore();

describe('Welcome', () => {
  it('should render Welcome for guest', async () => {
    const auth = SetupFirebaseMock(false);

    defaultRender(auth);
    await waitRender();
    const developers = screen.getByText('Developers');
    expect(developers).toBeInTheDocument;
    expect(screen.getByRole('link', { name: 'Sign In' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Sign Up' })).toBeVisible();
  });

  it('should render Welcome for logged in user', async () => {
    const auth = SetupFirebaseMock(true);

    defaultRender(auth);
    await waitRender();
    const developers = screen.getByText('Developers');
    expect(developers).toBeInTheDocument;
    expect(screen.getByRole('link', { name: 'Go to Main Page' })).toBeVisible();
  });

  function defaultRender(auth: FirebaseMock) {
    render(
      <AppContextProvider apiClient={null} auth={auth} routing={defaultRoutes}>
        <Provider store={store}>
          <BrowserRouter>
            <Welcome />
          </BrowserRouter>
        </Provider>
      </AppContextProvider>
    );
  }
});
