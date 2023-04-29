import { MOCK_QUERY_EXPECTED } from '@/core/api/api-mock-helper';
import { generateBook } from '@/core/docs';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { SDLDocumentBrowser } from './sdl-document-browser';
import { scryRenderedComponentsWithType } from 'react-dom/test-utils';

describe('Document browser', () => {
  it('should render / ', () => {
    renderPage('/');
    expect(screen.getByText('Queries')).toBeInTheDocument();
    expect(screen.getByText('Mutations')).toBeInTheDocument();
    expect(screen.getByText('Subscriptions')).toBeInTheDocument();
  });

  it('should render /queries ', () => {
    renderPage('/query');
    const functions = screen.queryAllByTestId('doc_function');
    expect(functions.length).toBeGreaterThan(0);
    expect(
      functions.filter((e) => e.textContent?.trim() == 'myNumber():Int').length
    ).toBeGreaterThan(0);
  });

  function renderPage(root: string) {
    const book = generateBook(MOCK_QUERY_EXPECTED);
    render(<SDLDocumentBrowser book={book} root={root}></SDLDocumentBrowser>);
  }
});
