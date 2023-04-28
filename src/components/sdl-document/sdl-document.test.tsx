import { DocumentPartKind } from '@/core/docs/sdl-docs';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { DocumentContent, SDLDocument, UNKNOWNDOCUMENTPARTERROR } from './sdl-document';
import App from '@/App';

describe('Document', () => {
  const content = new DocumentContent('123');

  beforeEach(() => {
    content.parts = [
      { kind: DocumentPartKind.Regular, text: () => <>Hello</> },
      { kind: DocumentPartKind.Regular, text: () => <>world</>, link_uuid: '456' },
      { kind: DocumentPartKind.Break },
    ];
  });

  it('renders the document content', () => {
    const { getByText } = render(<SDLDocument content={content} onClick={jest.fn()} />);
    expect(getByText('Hello')).toBeInTheDocument();
    expect(getByText('world')).toBeInTheDocument();
    expect(getByText('world')).toHaveAttribute('href', '#');
  });

  it('test that get works', () => {
    expect(content.parts.length).toBe(3);
  });

  it('renders the document content', () => {
    const spiedOnError = jest.spyOn(console, 'error').mockImplementation(() => {});
    content.parts = [{ kind: DocumentPartKind.Unknown }];
    render(
      <App>
        <SDLDocument content={content} onClick={jest.fn()} />
      </App>
    );
    expect(spiedOnError).toHaveBeenCalledWith(
      'error caught: ',
      new Error(UNKNOWNDOCUMENTPARTERROR)
    );
  });

  it('calls the onClick handler when a link is clicked', () => {
    const onClick = jest.fn();
    const { getByText } = render(<SDLDocument content={content} onClick={onClick} />);
    fireEvent.click(getByText('world'));
    expect(onClick).toHaveBeenCalledWith('456');
  });
});
