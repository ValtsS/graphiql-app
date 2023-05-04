import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { About } from './About';

describe('About', () => {
  it('renders About', () => {
    render(<About />, { wrapper: MemoryRouter });
    const element = screen.queryByText('About page');
    expect(element).toBeInTheDocument();
  });
});
