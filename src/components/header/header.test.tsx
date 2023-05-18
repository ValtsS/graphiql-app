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

  it('render for guest', async () => {
    const auth = SetupFirebaseMock(false);
    auth.reg.mockReturnValueOnce(null);
    auth.signIn.mockReturnValueOnce(null);

    await defaultRender(auth);
    expect(screen.getAllByText(/Welcome/i).length).toBe(2);
    expect(screen.queryAllByText(/Main/i).length).toBe(0);
    expect(screen.queryAllByText(/Sign out/i).length).toBe(0);

    const language = screen.getByRole('checkbox');
    await userEvent.click(language);

    expect(screen.getAllByText(/Приветствие/i).length).toBe(2);
  });

  it('render for logged in', async () => {
    const auth = SetupFirebaseMock(true);
    auth.reg.mockReturnValueOnce(null);
    auth.signIn.mockReturnValueOnce(null);
    auth.currentUser = {
      displayName: 'Sample user',
      uid: '12345',
    } as User;

    auth.lastUser = auth.currentUser;

    await defaultRender(auth);
    expect(screen.getAllByText(/Welcome/i).length).toBe(2);
    expect(screen.getAllByText(/Main/i).length).toBe(2);
    expect(screen.getAllByText(/Sign out/i).length).toBe(2);

    const logout = screen.getByRole('button', { name: 'Sign Out' });
    await userEvent.click(logout);
    expect(auth.lastUser).toBeNull();
  });

  async function defaultRender(auth: FirebaseMock) {
    const store = setupStore();
    render(
      <AppContextProvider apiClient={null} auth={auth} routing={defaultRoutes}>
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <Header routesConfig={defaultRoutes} />
          </MemoryRouter>
        </Provider>
      </AppContextProvider>
    );

    await waitRender();
  }
});
