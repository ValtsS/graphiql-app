import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ErrorPage, unkErrorText } from './error-page';

describe('Error page component', () => {
  it('should render without crash', async () => {
    const text = 'Test error 78123';

    const testError = new Error(text);

    render(
      <BrowserRouter>
        <ErrorPage error={testError} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(new RegExp(text, 'i'))).toBeInTheDocument();
    });
  });

  it('should render with undefined error', async () => {
    render(
      <BrowserRouter>
        <ErrorPage error={null} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(new RegExp(unkErrorText, 'i'))).toBeInTheDocument();
    });
  });
});
