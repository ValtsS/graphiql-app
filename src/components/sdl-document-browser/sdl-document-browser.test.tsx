import { MOCK_QUERY_EXPECTED } from '@/../__mocks__/api-mock-helper';
import { DocumentBook, DocumentPage, DocumentPageHelper, generateBook } from '@/core/docs';
import { act, render, screen } from '@testing-library/react';
import React from 'react';
import SDLDocumentBrowser from './sdl-document-browser';

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

  it('should not fail with bad links', () => {
    const book: DocumentBook = {};
    const badpage: DocumentPage = {
      uuid: '/',
      parts: [],
    };

    DocumentPageHelper.pushLinkToPage(badpage, 'AAAA', 'BadLink');
    book['/'] = badpage;
    render(<SDLDocumentBrowser book={book} root={'/'}></SDLDocumentBrowser>);

    const link = screen.getByRole('link');
    expect(link).toBeVisible();
    act(() => link.click());
    expect(screen.getByText('notFound')).toBeVisible();
  });

  function renderPage(root: string) {
    const book = generateBook(MOCK_QUERY_EXPECTED);
    render(<SDLDocumentBrowser book={book} root={root}></SDLDocumentBrowser>);
  }
});
