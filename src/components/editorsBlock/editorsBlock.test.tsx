import { render, screen } from '@testing-library/react';
import { languages, KeyMod, KeyCode } from '../../../__mocks__/monaco-editor';
import React from 'react';
import EditorsBlock from './editorsBlock';

jest.mock('monaco-editor', () => {
  const FakeEditor = jest.fn((props) => {
    return (
      <textarea
        data-auto={props.wrapperClassName}
        onChange={(e) => props.onChange(e.target.value)}
        value={props.value}
      ></textarea>
    );
  });
  return FakeEditor;
});

describe('editorBlock component', () => {
  it('should should render 3 editors', () => {
    render(<EditorsBlock />);
    const editors = screen.getAllByTestId('editor');
    expect(editors).toHaveLength(3);
  });
});
