import { FirebaseMock, SetupFirebaseMock } from '@/../__mocks__/firebaseMock';
import { waitRender } from '@/../__mocks__/test-utils';
import { AppContextProvider } from '@/provider';
import { defaultRoutes } from '@/routes';
import { User } from '@firebase/auth';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18next from 'i18next';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { setupStore } from '../../store';
import { Header } from './header';

describe('Header', () => {
  beforeEach(async () => {
    await i18next.changeLanguage('en');
  });

  it('render for root', async () => {
    await defaultRender('/');
  });

  async function defaultRender(path = '/') {
    const store = setupStore();
    render(
      <AppContextProvider apiClient={null} routing={defaultRoutes}>
        <Provider store={store}>
          <MemoryRouter initialEntries={[path]}>
            <Header routesConfig={defaultRoutes} />
          </MemoryRouter>
        </Provider>
      </AppContextProvider>
    );

    await waitRender();
  }
});
