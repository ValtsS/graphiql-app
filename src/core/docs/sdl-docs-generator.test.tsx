import * as fs from 'fs';
import * as path from 'path';
import { generateBook } from './sdl-docs-generator';
import { DocumentBook } from './sdl-docs';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { DocumentContent, SDLDocument } from '@/components/sdl-document/sdl-document';

describe('Book generator test', () => {
  let book: DocumentBook;

  beforeAll(() => {
    const currentPath = path.resolve(__dirname);
    const testSchema = fs.readFileSync(path.join(currentPath, 'test.sdl'));
    book = generateBook(testSchema.toString());
  });

  it.each(['/', '/404', '/query', '/mutate', '/subscribe'])(
    'Expect to contain page %s',
    (page: string) => {
      expect(book[page]).toBeTruthy();
    }
  );

  it('should render correct root', () => {
    renderPage('/');
    expect(screen.getByText('Queries')).toHaveAttribute('href');
    expect(screen.getByText('Mutations')).toHaveAttribute('href');
    expect(screen.getByText('Subscriptions')).toHaveAttribute('href');
  });

  it('should render correct root', () => {
    renderPage('/query');
    screen.debug();
  });

  function renderPage(uuid: string) {
    const c = new DocumentContent(uuid);
    c.parts = book[uuid].parts;
    render(<SDLDocument content={c} onClick={jest.fn()} />);
  }
});
