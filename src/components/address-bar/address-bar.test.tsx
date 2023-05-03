import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { AddressBar } from './address-bar';

describe('AddressBar component', () => {
  const testURL = 'https://new.endpoint.com';

  it('should change the endpoint when the button is clicked', () => {
    const fn = jest.fn();
    render(<AddressBar onChanged={fn} initialAddress="A" />);

    const endpointInput = screen.getByRole('textbox');
    fireEvent.change(endpointInput, { target: { value: testURL } });

    const loadButton = screen.getByText('Apply');
    fireEvent.click(loadButton);
    expect(fn).lastCalledWith(testURL);
  });

  it('should change the endpoint when Enter key is pressed', () => {
    const fn = jest.fn();
    render(<AddressBar onChanged={fn} initialAddress="B" />);

    const endpointInput = screen.getByRole('textbox');
    fireEvent.change(endpointInput, { target: { value: testURL } });

    fireEvent.keyDown(endpointInput, { key: 'Enter', code: 'Enter' });

    expect(fn).lastCalledWith(testURL);
  });
});
