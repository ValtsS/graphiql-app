import { SDLDocumentBrowser } from '@/components/sdl-document-browser/sdl-document-browser';
import { DocumentBook } from '@/core/docs/sdl-docs';
import { generateBook, getremoteSchema } from '@/core/docs/sdl-docs-generator';
import React, { useCallback, useEffect, useState } from 'react';

export const DocumentPage = ({ url }: { url: string }) => {
  const [book, setBook] = useState<DocumentBook | undefined>();

  const loadBook = useCallback(
    async (url: string) => {
      try {
        const schema = await getremoteSchema(url);
        const book = generateBook(schema);
        setBook(book);
      } catch (e) {
        console.error('Add error handling', e);
      }
    },

    [setBook]
  );

  useEffect(() => {
    loadBook(url);
  }, [loadBook, url]);

  return (
    <>
      Test page
      {book && <SDLDocumentBrowser book={book} root={'/'}></SDLDocumentBrowser>}
    </>
  );
};
