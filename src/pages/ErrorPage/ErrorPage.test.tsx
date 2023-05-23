import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ErrorPage } from './ErrorPage';

describe('ErrorPage', () => {
  it('renders ErrorPage', () => {
    render(<ErrorPage />, { wrapper: MemoryRouter });
    const element = screen.queryByText('lost');
    expect(element).toBeInTheDocument();
  });
});
