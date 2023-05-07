import { waitRender } from '@/../__mocks__/test-utils';
import { render } from '@testing-library/react';
import React from 'react';
import { Editor } from './editor';

describe('Monaco editor', () => {
  it('renders without crash', async () => {
    try {
      render(<Editor language={'json'} />);
      await waitRender();
    } catch (error) {
      expect(error).toBeFalsy();
    }
  });
});
