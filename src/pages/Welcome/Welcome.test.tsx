import { waitRender } from '@/../__mocks__/test-utils';
import { setupStore } from '@/store';
import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Welcome } from './Welcome';

const store = setupStore();

describe('Welcome', () => {
  it('renders Welcome', async () => {
    act(() =>
      render(
        <Provider store={store}>
          <BrowserRouter>
            <Welcome />
          </BrowserRouter>
        </Provider>
      )
    );
    await waitRender();
    const developers = screen.getByText('Developers');
    expect(developers).toBeInTheDocument;
  });
});
