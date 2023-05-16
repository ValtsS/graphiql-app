import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Header } from './header';
import { Provider } from 'react-redux';
import { setupStore } from '../../store';

const store = setupStore();
describe('Header', () => {
  it('renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Header routesConfig={[]} />
        </MemoryRouter>
      </Provider>
    );
  });
});
