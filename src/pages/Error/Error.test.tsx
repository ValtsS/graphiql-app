import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Error, unkErrorText } from './Error';

describe('Error page component', () => {
  it('should render without crash', async () => {
    const text = 'Test error 78123';

    const testError = new global.Error(text);

    render(
      <BrowserRouter>
        <Error error={testError} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(new RegExp(text, 'i'))).toBeInTheDocument();
    });
  });

  it('should render with undefined error', async () => {
    render(
      <BrowserRouter>
        <Error error={null} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(new RegExp(unkErrorText, 'i'))).toBeInTheDocument();
    });
  });
});
