import { render, screen } from '@testing-library/react';
import { Editor } from './editor';
import React from 'react';
import { waitRender } from '@/../__mocks__/test-utils';

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
