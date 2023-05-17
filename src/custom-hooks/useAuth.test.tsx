import { FirebaseMock } from '@/../__mocks__/firebaseMock';
import useAuth from './useAuth';
import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { AppContextProvider } from '@/provider';
import { waitRender } from '@/../__mocks__/test-utils';
import { User } from '@firebase/auth';

describe('useAuth', () => {
  const mock = new FirebaseMock();

  const AuthTester = () => {
    const { currentUser } = useAuth();
    return (
      <>
        {!currentUser && 'NotFound'}
        {currentUser?.displayName}
      </>
    );
  };

  it('should set the initial currentUser value to the lastUser', async () => {
    mock.currentUser = {
      displayName: '123',
    } as User;
    mock.lastUser = mock.currentUser;

    render(
      <AppContextProvider apiClient={null} auth={mock}>
        <AuthTester />
      </AppContextProvider>
    );

    await waitRender();
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('should handle logout', async () => {
    mock.currentUser = {
      displayName: '123',
    } as User;
    mock.lastUser = mock.currentUser;
    mock.logOut.mockReturnValue(null);

    render(
      <AppContextProvider apiClient={null} auth={mock}>
        <AuthTester />
      </AppContextProvider>
    );

    act(() => mock.logout());

    await waitRender();

    expect(screen.getByText('NotFound')).toBeInTheDocument();
  });

  it('should handle login', async () => {
    mock.currentUser = undefined;
    mock.lastUser = null;
    mock.signIn.mockReturnValue(null);

    render(
      <AppContextProvider apiClient={null} auth={mock}>
        <AuthTester />
      </AppContextProvider>
    );

    act(() => mock.signInWithEmailAndPassword('log', 'pass'));

    await waitRender();

    expect(screen.getByText('User')).toBeInTheDocument();
  });
});
