import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Authorization } from './Authorization';
import { waitRender } from '@/../__mocks__/test-utils';
import { AppContextProvider } from '@/provider';
import { FirebaseMock, MOCK_PASS_VALID, SetupFirebaseMock } from '@/../__mocks__/firebaseMock';
import { defaultRoutes } from '@/routes';

const mockToasterError = jest.fn();
const mockToasterSuccess = jest.fn();

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn().mockImplementation((...args) => mockToasterError(args)),
    success: jest.fn().mockImplementation((...args) => mockToasterSuccess(args)),
  },
}));

describe('Authorization', () => {
  const testEmail = 'user07@gmail.com';

  beforeEach(() => {});

  it('Authorization renders correctly', async () => {
    const auth = SetupFirebaseMock(false);
    await defaultRender(auth);

    const textboxEmail = screen.getByTestId('editEmail');
    expect(textboxEmail).toBeInTheDocument;

    const textboxPassword = screen.getByTestId('editPassword');
    expect(textboxPassword).toBeInTheDocument;
  });

  it('Valid Authorization submited', async () => {
    const auth = SetupFirebaseMock(false);
    await defaultRender(auth);
    await fillNameAndPass(testEmail, MOCK_PASS_VALID);

    const btnSignIn = screen.getByRole('button', { name: 'Sign In' });
    await userEvent.click(btnSignIn);
    await waitRender();

    expect(auth.signIn).toBeCalledTimes(1);
    expect(auth.signIn).toHaveBeenLastCalledWith(testEmail, MOCK_PASS_VALID);
    expect(mockToasterSuccess).toHaveBeenCalledTimes(1);
    expect(mockToasterSuccess).toHaveBeenLastCalledWith(['Successfully logged in']);
    expect(mockToasterError).toBeCalledTimes(0);
  });

  it('Invalid Authorization submited', async () => {
    const auth = SetupFirebaseMock(false);
    const badPass = 'badpassword';
    await defaultRender(auth);
    await fillNameAndPass(testEmail, badPass);

    const btnSignIn = screen.getByRole('button', { name: 'Sign In' });
    await userEvent.click(btnSignIn);
    await waitRender();
    expect(auth.signIn).toBeCalledTimes(1);

    expect(auth.signIn).toHaveBeenLastCalledWith(testEmail, badPass);
    expect(mockToasterSuccess).toHaveBeenCalledTimes(0);
    expect(mockToasterError).toBeCalledTimes(1);
    expect(mockToasterError).toHaveBeenLastCalledWith(['Invalid password']);
  });

  async function defaultRender(auth: FirebaseMock | null) {
    await act(() =>
      render(
        <AppContextProvider apiClient={null} auth={auth} routing={defaultRoutes}>
          <BrowserRouter>
            <Authorization />
          </BrowserRouter>
        </AppContextProvider>
      )
    );

    await waitRender();
  }

  it('should throw an exception', async () => {
    const badPass = 'badpassword';
    await defaultRender(null);
    await fillNameAndPass(testEmail, badPass);

    const btnSignIn = screen.getByRole('button', { name: 'Sign In' });
    try {
      await userEvent.click(btnSignIn);
      await waitRender();
      expect(true).toBe(false);
    } catch {
      expect(true).toBe(true);
    }

    expect(mockToasterError).toBeCalledTimes(1);
    expect(mockToasterError).toHaveBeenLastCalledWith(['Something went wrong']);
  });

  async function fillNameAndPass(testEmail: string, testPassword: string) {
    const textboxEmail = screen.getByTestId('editEmail');
    await userEvent.type(textboxEmail, testEmail);
    expect((textboxEmail as HTMLInputElement).value).toBe(testEmail);

    const textboxPassword = screen.getByTestId('editPassword');
    await userEvent.type(textboxPassword, testPassword);
    expect((textboxPassword as HTMLInputElement).value).toBe(testPassword);
    await waitRender();
  }
});
