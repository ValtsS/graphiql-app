import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Registration } from './Registration';

describe('Registration', () => {
  it('Registration renders correctly', () => {
    render(
      <BrowserRouter>
        <Registration />
      </BrowserRouter>
    );

    const textboxName = screen.getByRole('textbox', { name: 'Name' });
    expect(textboxName).toBeInTheDocument;

    const textboxEmail = screen.getByRole('textbox', { name: 'Email Address' });
    expect(textboxEmail).toBeInTheDocument;

    const textboxPassword = screen.getByLabelText('Password *');
    expect(textboxPassword).toBeInTheDocument;
  });

  it('Registration submited', async () => {
    // const onSubmit = jest.fn();
    render(
      <BrowserRouter>
        <Registration />
      </BrowserRouter>
    );

    const textboxName = screen.getByRole('textbox', { name: 'Name' });
    await userEvent.type(textboxName, 'Skave');
    expect((textboxName as HTMLInputElement).value).toBe('Skave');

    const textboxEmail = screen.getByRole('textbox', { name: 'Email Address' });
    await userEvent.type(textboxEmail, 'user07@gmail.com');
    expect((textboxEmail as HTMLInputElement).value).toBe('user07@gmail.com');

    const textboxPassword = screen.getByLabelText('Password *');
    await userEvent.type(textboxPassword, 'myPassword');
    expect((textboxPassword as HTMLInputElement).value).toBe('myPassword');

    const btnSignUp = screen.getByRole('button', { name: /Sign Up/i });
    userEvent.click(btnSignUp);

    const form = screen.getByRole('form');

    fireEvent.submit(form);

    // expect(onSubmit).toHaveBeenCalled();
  });
});
