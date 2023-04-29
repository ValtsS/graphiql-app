import { SDLDocumentBrowser } from '@/components/sdl-document-browser/sdl-document-browser';
import { DocumentBook, generateBook } from '@/core/docs';
import { StoreStatus, selectSchemaData } from '@/slices/schema/schema';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const DocumentPage = () => {
  const [book, setBook] = useState<DocumentBook | undefined>();

  const schemaState = useSelector(selectSchemaData);

  useEffect(() => {
    if (schemaState.status == StoreStatus.succeeded) {
      setBook(generateBook(schemaState.schema));
    }
  }, [schemaState]);

  const ready = schemaState.status == StoreStatus.succeeded && book;

  return (
    <>
      {schemaState.error}
      {ready && <SDLDocumentBrowser book={book} root={'/'}></SDLDocumentBrowser>}
    </>
  );
};
