import { render, screen } from '@testing-library/react';
import React from 'react';
import EditorsBlock from './editorsBlock';

describe('editorBlock component', () => {
  it('should should render 3 editors', () => {
    render(<EditorsBlock />);
    const editors = screen.getAllByTestId('editor');
    expect(editors).toHaveLength(3);
  });
});
