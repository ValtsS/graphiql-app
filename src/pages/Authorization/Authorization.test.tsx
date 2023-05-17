import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Authorization } from './Authorization';
import { waitRender } from '@/../__mocks__/test-utils';
import { AppContextProvider } from '@/provider';
import { FirebaseMock } from '@/../__mocks__/firebaseMock';
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
  const auth = new FirebaseMock();
  const testEmail = 'user07@gmail.com';
  const testPassword = 'myPassword';

  beforeEach(() => {});

  it('Authorization renders correctly', async () => {
    await defaultRender();

    const textboxEmail = screen.getByTestId('editEmail');
    expect(textboxEmail).toBeInTheDocument;

    const textboxPassword = screen.getByTestId('editPassword');
    expect(textboxPassword).toBeInTheDocument;
  });

  it('Valid Authorization submited', async () => {
    await defaultRender();
    await fillNameAndPass(testEmail, testPassword);

    const btnSignIn = screen.getByRole('button', { name: 'Sign In' });

    auth.signIn.mockReturnValueOnce(null);
    await userEvent.click(btnSignIn);

    expect(auth.signIn).toBeCalledTimes(1);
    expect(auth.signIn).toHaveBeenLastCalledWith(testEmail, testPassword);
    expect(mockToasterSuccess).toHaveBeenCalledTimes(1);
    expect(mockToasterSuccess).toHaveBeenLastCalledWith(['Successefully logged in']);
    expect(mockToasterError).toBeCalledTimes(0);
  });

  it('Invalid Authorization submited', async () => {
    await defaultRender();
    await fillNameAndPass(testEmail, testPassword);

    const btnSignIn = screen.getByRole('button', { name: 'Sign In' });

    const errorMessage = 'Invalid password';
    auth.signIn.mockReturnValueOnce(errorMessage);

    await userEvent.click(btnSignIn);

    expect(auth.signIn).toBeCalledTimes(1);
    expect(auth.signIn).toHaveBeenLastCalledWith(testEmail, testPassword);
    expect(mockToasterSuccess).toHaveBeenCalledTimes(0);
    expect(mockToasterError).toBeCalledTimes(1);
    expect(mockToasterError).toHaveBeenLastCalledWith([errorMessage]);
  });

  async function defaultRender() {
    act(() =>
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

  async function fillNameAndPass(testEmail: string, testPassword: string) {
    const textboxEmail = screen.getByTestId('editEmail');
    await userEvent.type(textboxEmail, testEmail);
    expect((textboxEmail as HTMLInputElement).value).toBe(testEmail);

    const textboxPassword = screen.getByTestId('editPassword');
    await userEvent.type(textboxPassword, testPassword);
    expect((textboxPassword as HTMLInputElement).value).toBe(testPassword);
  }
});
