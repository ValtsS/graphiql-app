import { waitRender } from '@/../__mocks__/test-utils';
import { defaultRoutes } from '@/routes';
import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Welcome } from './Welcome';

describe('Welcome', () => {
  it('renders Welcome', async () => {
    act(() =>
      render(
        <BrowserRouter>
          <Welcome routes={defaultRoutes} />
        </BrowserRouter>
      )
    );
    await waitRender();
    const developers = screen.getByText('Developers');
    expect(developers).toBeInTheDocument;
  });
});
