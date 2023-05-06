import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Authorization } from './Authorization';

describe('Authorization', () => {
  it('Authorization renders correctly', () => {
    render(
      <BrowserRouter>
        <Authorization />
      </BrowserRouter>
    );

    const textboxEmail = screen.getByRole('textbox', { name: 'Email Address' });
    expect(textboxEmail).toBeInTheDocument;

    const textboxPassword = screen.getByLabelText('Password *');
    expect(textboxPassword).toBeInTheDocument;
  });

  it('Registration submited', async () => {
    render(
      <BrowserRouter>
        <Authorization />
      </BrowserRouter>
    );

    const textboxEmail = screen.getByRole('textbox', { name: 'Email Address' });
    await userEvent.type(textboxEmail, 'user07@gmail.com');
    expect((textboxEmail as HTMLInputElement).value).toBe('user07@gmail.com');

    const textboxPassword = screen.getByLabelText('Password *');
    await userEvent.type(textboxPassword, 'myPassword');
    expect((textboxPassword as HTMLInputElement).value).toBe('myPassword');

    const btnSignUp = screen.getByRole('button', { name: /Sign In/i });
    userEvent.click(btnSignUp);
  });
});
