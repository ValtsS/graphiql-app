import { waitRender } from '@/../__mocks__/test-utils';
import { defaultRoutes } from '@/routes';
import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Welcome } from './Welcome';
import { Provider } from 'react-redux';
import { setupStore } from '@/store';

const store = setupStore();

describe('Welcome', () => {
  it('renders Welcome', async () => {
    act(() =>
      render(
        <Provider store={store}>
          <BrowserRouter>
            <Welcome routes={defaultRoutes} />
          </BrowserRouter>
        </Provider>
      )
    );
    await waitRender();
    const developers = screen.getByText('Developers');
    expect(developers).toBeInTheDocument;
  });
});
