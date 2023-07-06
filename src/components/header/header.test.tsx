import { waitRender } from '@/../__mocks__/test-utils';
import { AppContextProvider } from '@/provider';
import { defaultRoutes } from '@/routes';
import { render } from '@testing-library/react';
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
            <Header />
          </MemoryRouter>
        </Provider>
      </AppContextProvider>
    );

    await waitRender();
  }
});
