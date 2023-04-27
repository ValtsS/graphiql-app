import { render } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Main } from './Main';

describe('Main renders', () => {
  it('should render', () => {
    render(
      <BrowserRouter>
        <Main />
      </BrowserRouter>
    );
  });
});
