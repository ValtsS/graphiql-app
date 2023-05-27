import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RootLayout } from './root-layout';
import { Provider } from 'react-redux';
import { setupStore } from '@/store';

describe('RootLayout', () => {
  const store = setupStore();

  test('renders without crashing', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <RootLayout>
            <p>Test</p>
          </RootLayout>
        </MemoryRouter>
      </Provider>
    );
  });
});
