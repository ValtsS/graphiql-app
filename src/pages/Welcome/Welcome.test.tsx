import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Welcome } from './Welcome';

describe('Welcome', () => {
  it('renders Welcome', () => {
    render(
      <BrowserRouter>
        <Welcome />
      </BrowserRouter>
    );
    const btns = screen.getAllByRole('link');
    expect(btns.length).toBe(2);
  });
});
