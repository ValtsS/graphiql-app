import { MOCK_PASS_VALID, SetupFirebaseMock } from '@/../__mocks__/firebaseMock';
import { waitRender } from '@/../__mocks__/test-utils';
import { AppContextProvider } from '@/provider';
import { act, render, screen } from '@testing-library/react';
import React from 'react';
import useAuth from './useAuth';

describe('useAuth', () => {
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
    const mock = SetupFirebaseMock(true);
    render(
      <AppContextProvider apiClient={null} auth={mock}>
        <AuthTester />
      </AppContextProvider>
    );

    await waitRender();
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('should handle logout', async () => {
    const mock = SetupFirebaseMock(true);
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
    const mock = SetupFirebaseMock(false);

    render(
      <AppContextProvider apiClient={null} auth={mock}>
        <AuthTester />
      </AppContextProvider>
    );

    act(() => mock.signInWithEmailAndPassword('loginname', MOCK_PASS_VALID));

    await waitRender();

    expect(screen.getByText('User')).toBeInTheDocument();
  });
});
