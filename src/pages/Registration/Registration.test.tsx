import { FirebaseMock, SetupFirebaseMock } from '@/../__mocks__/firebaseMock';
import { waitRender } from '@/../__mocks__/test-utils';
import { AppContextProvider } from '@/provider';
import { defaultRoutes } from '@/routes';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Registration } from './Registration';

const mockToasterError = jest.fn();
const mockToasterSuccess = jest.fn();

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn().mockImplementation((...args) => mockToasterError(args)),
    success: jest.fn().mockImplementation((...args) => mockToasterSuccess(args)),
  },
}));

describe('Registration', () => {
  it('Registration renders correctly', async () => {
    const auth = SetupFirebaseMock(false);
    await defaultRender(auth);

    const textboxName = screen.getByTestId('editName');
    expect(textboxName).toBeInTheDocument;

    const textboxEmail = screen.getByTestId('editEmail');
    expect(textboxEmail).toBeInTheDocument;

    const textboxPassword = screen.getByTestId('editPassword');
    expect(textboxPassword).toBeInTheDocument;
  });

  it('should handle valid registration', async () => {
    const auth = SetupFirebaseMock(false);
    await defaultRender(auth);
    await fillBoxes();
    await waitRender();

    expect(auth.reg).toBeCalledTimes(1);
    expect(auth.reg).toHaveBeenLastCalledWith('Skave', 'user07@gmail.com', 'password', null);

    expect(mockToasterSuccess).toHaveBeenCalledTimes(1);
    expect(mockToasterSuccess).toHaveBeenLastCalledWith(['Sign up succeeded']);
    expect(mockToasterError).toBeCalledTimes(0);
  });

  it('should handle invalid registration', async () => {
    const auth = SetupFirebaseMock(false);
    await defaultRender(auth);
    await fillBoxes('bad');
    await waitRender();

    expect(auth.reg).toBeCalledTimes(1);
    expect(auth.reg).toHaveBeenLastCalledWith('bad', 'user07@gmail.com', 'password', null);

    expect(mockToasterSuccess).toHaveBeenCalledTimes(0);
    expect(mockToasterError).toBeCalledTimes(1);
  });

  async function defaultRender(auth: FirebaseMock) {
    act(() =>
      render(
        <AppContextProvider apiClient={null} auth={auth} routing={defaultRoutes}>
          <BrowserRouter>
            <Registration />
          </BrowserRouter>
        </AppContextProvider>
      )
    );

    await waitRender();
  }

  async function fillBoxes(name = 'Skave') {
    const textboxName = screen.getByTestId('editName');
    await userEvent.type(textboxName, name);
    expect((textboxName as HTMLInputElement).value).toBe(name);

    const textboxEmail = screen.getByTestId('editEmail');
    const testEmail = 'user07@gmail.com';
    await userEvent.type(textboxEmail, testEmail);
    expect((textboxEmail as HTMLInputElement).value).toBe(testEmail);

    const textboxPassword = screen.getByTestId('editPassword');
    const testPass = 'password';
    await userEvent.type(textboxPassword, testPass);
    expect((textboxPassword as HTMLInputElement).value).toBe(testPass);

    const btnSignUp = screen.getByRole('button', { name: 'Sign Up' });
    await userEvent.click(btnSignUp);
  }
});
