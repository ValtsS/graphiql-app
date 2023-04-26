import { render, screen, waitFor } from '@testing-library/react';
import App from 'App';
import React from 'react';

const ThrowsError = () => {
  const showError = true;
  return (
    <div>
      {showError &&
        (() => {
          throw new Error('Something went wrong!!');
        })()}
      <p>Other content...</p>
    </div>
  );
};

describe('App component', () => {
  const errorText = 'Something went wrong!!';

  it('should render without crash', async () => {
    render(
      <App>
        <div>Test text</div>
      </App>
    );

    await waitFor(() => {
      expect(screen.getByText('Test text')).toBeInTheDocument();
    });
  });

  it('should catch and handle errors', async () => {
    const spiedOnError = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <App>
        <ThrowsError />
      </App>
    );

    expect(spiedOnError).toHaveBeenCalledWith('error caught: ', new Error(errorText));

    await waitFor(() => {
      expect(screen.getByText(new RegExp(errorText, 'i'))).toBeInTheDocument();
    });

    spiedOnError.mockRestore();
  });
});
