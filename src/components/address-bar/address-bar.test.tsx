import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { AddressBar } from './address-bar';
import { setupStore } from '@/store';
import { waitRender } from '@/../__mocks__/test-utils';

describe('AddressBar component', () => {
  const testURL = 'https://new.endpoint.com';

  it('should change the endpoint when the Load button is clicked', () => {
    const store = renderDefault();

    const endpointInput = screen.getByRole('textbox');
    fireEvent.change(endpointInput, { target: { value: testURL } });

    const loadButton = screen.getByText('Load');
    fireEvent.click(loadButton);
    expect(store.getState().main.endpoint).toBe(testURL);
  });

  it('should change the endpoint when Enter key is pressed', () => {
    const store = renderDefault();

    const endpointInput = screen.getByRole('textbox');
    fireEvent.change(endpointInput, { target: { value: testURL } });

    fireEvent.keyDown(endpointInput, { key: 'Enter', code: 'Enter' });

    expect(store.getState().main.endpoint).toBe(testURL);
  });

  function renderDefault() {
    const store = setupStore();
    render(
      <Provider store={store}>
        <AddressBar />
      </Provider>
    );
    return store;
  }
});
