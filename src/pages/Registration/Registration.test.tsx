import {
  FirebaseMock,
  MOCK_PASS_VALID,
  MOCK_USER_BAD,
  SetupFirebaseMock,
} from '@/../__mocks__/firebaseMock';
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
  const testEmail = 'user07@gmail.com';

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
    expect(auth.reg).toBeCalledTimes(1);

    expect(auth.reg).toHaveBeenLastCalledWith('Skave', testEmail, MOCK_PASS_VALID, null);

    expect(mockToasterSuccess).toHaveBeenCalledTimes(1);
    expect(mockToasterSuccess).toHaveBeenLastCalledWith(['Sign up succeeded']);
    expect(mockToasterError).toBeCalledTimes(0);
  });

  it('should handle invalid registration', async () => {
    const auth = SetupFirebaseMock(false);
    await defaultRender(auth);
    await fillBoxes(MOCK_USER_BAD);
    expect(auth.reg).toBeCalledTimes(1);
    expect(auth.reg).toHaveBeenLastCalledWith(MOCK_USER_BAD, testEmail, MOCK_PASS_VALID, null);

    expect(mockToasterSuccess).toHaveBeenCalledTimes(0);
    expect(mockToasterError).toBeCalledTimes(1);
    expect(mockToasterError).toHaveBeenLastCalledWith(['Bad name']);
  });

  it('should handle error in firebase', async () => {
    const auth = SetupFirebaseMock(false);
    await defaultRender(auth);
    auth.reg.mockRejectedValue(new Error('Firebase down'));
    await fillBoxes();
    expect(auth.reg).toBeCalledTimes(1);
    expect(auth.reg).toHaveBeenLastCalledWith('Skave', testEmail, MOCK_PASS_VALID, null);

    expect(mockToasterSuccess).toHaveBeenCalledTimes(0);
    expect(mockToasterError).toBeCalledTimes(1);
    expect(mockToasterError).toHaveBeenLastCalledWith(['Something went wrong']);
  });

  it('should throw exception', async () => {
    try {
      await defaultRender(null);
      expect(true).toBe(false);
    } catch {
      expect(true).toBe(true);
    }
  });

  async function defaultRender(auth: FirebaseMock | null) {
    await act(() =>
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
    await userEvent.type(textboxEmail, testEmail);
    expect((textboxEmail as HTMLInputElement).value).toBe(testEmail);

    const textboxPassword = screen.getByTestId('editPassword');

    await userEvent.type(textboxPassword, MOCK_PASS_VALID);
    expect((textboxPassword as HTMLInputElement).value).toBe(MOCK_PASS_VALID);

    await waitRender();

    const btnSignUp = screen.getByRole('button', { name: 'Sign Up' });
    await userEvent.click(btnSignUp);
    await waitRender();
  }
});
