import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Footer } from './footer';

describe('Footer', () => {
  it('renders Footer', () => {
    render(<Footer />, { wrapper: MemoryRouter });
    const element = screen.queryByText('2023');
    expect(element).toBeInTheDocument();
  });
});
