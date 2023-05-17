import { FirebaseMock } from '@/../__mocks__/firebaseMock';
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
  const auth = new FirebaseMock();

  it('Registration renders correctly', async () => {
    await defaultRender();

    const textboxName = screen.getByTestId('editName');
    expect(textboxName).toBeInTheDocument;

    const textboxEmail = screen.getByTestId('editEmail');
    expect(textboxEmail).toBeInTheDocument;

    const textboxPassword = screen.getByTestId('editPassword');
    expect(textboxPassword).toBeInTheDocument;
  });

  it('should handle valid registration', async () => {
    await defaultRender();

    auth.reg.mockReturnValueOnce(null);
    auth.signIn.mockReturnValueOnce(null);

    await fillBoxes();
    await waitRender();

    expect(auth.reg).toBeCalledTimes(1);
    expect(auth.reg).toHaveBeenLastCalledWith('Skave', 'user07@gmail.com', 'myPassword12', null);

    expect(mockToasterSuccess).toHaveBeenCalledTimes(1);
    expect(mockToasterSuccess).toHaveBeenLastCalledWith(['Sign up succeeded']);
    expect(mockToasterError).toBeCalledTimes(0);
  });

  it('should handle invalid registration', async () => {
    await defaultRender();

    auth.reg.mockReturnValueOnce('Duplicate');
    auth.signIn.mockReturnValueOnce(null);

    await fillBoxes();
    await waitRender();

    expect(auth.reg).toBeCalledTimes(1);
    expect(auth.reg).toHaveBeenLastCalledWith('Skave', 'user07@gmail.com', 'myPassword12', null);

    expect(mockToasterSuccess).toHaveBeenCalledTimes(0);
    expect(mockToasterError).toBeCalledTimes(1);
  });

  async function defaultRender() {
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

  async function fillBoxes() {
    const textboxName = screen.getByTestId('editName');
    await userEvent.type(textboxName, 'Skave');
    expect((textboxName as HTMLInputElement).value).toBe('Skave');

    const textboxEmail = screen.getByTestId('editEmail');
    const testEmail = 'user07@gmail.com';
    await userEvent.type(textboxEmail, testEmail);
    expect((textboxEmail as HTMLInputElement).value).toBe(testEmail);

    const textboxPassword = screen.getByTestId('editPassword');
    const testPass = 'myPassword12';
    await userEvent.type(textboxPassword, testPass);
    expect((textboxPassword as HTMLInputElement).value).toBe(testPass);

    const btnSignUp = screen.getByRole('button', { name: 'Sign Up' });
    await userEvent.click(btnSignUp);
  }
});
