import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Registration } from './Registration';
import { waitRender } from '@/../__mocks__/test-utils';

describe('Registration', () => {
  it('Registration renders correctly', async () => {
    await defaultRender();

    const textboxName = screen.getByTestId('editName');
    expect(textboxName).toBeInTheDocument;

    const textboxEmail = screen.getByTestId('editEmail');
    expect(textboxEmail).toBeInTheDocument;

    const textboxPassword = screen.getByTestId('editPassword');
    expect(textboxPassword).toBeInTheDocument;
  });

  it('Registration submited', async () => {
    await defaultRender();

    const textboxName = screen.getByTestId('editName');
    await userEvent.type(textboxName, 'Skave');
    expect((textboxName as HTMLInputElement).value).toBe('Skave');

    const textboxEmail = screen.getByTestId('editEmail');
    await userEvent.type(textboxEmail, 'user07@gmail.com');
    expect((textboxEmail as HTMLInputElement).value).toBe('user07@gmail.com');

    const textboxPassword = screen.getByTestId('editPassword');
    await userEvent.type(textboxPassword, 'myPassword');
    expect((textboxPassword as HTMLInputElement).value).toBe('myPassword');

    const btnSignUp = screen.getByRole('button', { name: 'Sign Up' });
    userEvent.click(btnSignUp);

    const form = screen.getByRole('form');

    fireEvent.submit(form);
  });

  async function defaultRender() {
    act(() =>
      render(
        <BrowserRouter>
          <Registration />
        </BrowserRouter>
      )
    );

    await waitRender();
  }
});
