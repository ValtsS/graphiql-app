import { SDLDocumentBrowser } from '@/components/sdl-document-browser/sdl-document-browser';
import { DefaultApiClient } from '@/core/api/api-client';
import { DocumentBook, generateBook } from '@/core/docs';
import { StoreStatus, fetchSchema, selectSchemaData } from '@/slices/schema/schema';
import { useAppDispatch } from '@/store';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const DocumentPage = ({ url }: { url: string }) => {
  const [book, setBook] = useState<DocumentBook | undefined>();

  const schemaState = useSelector(selectSchemaData);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      fetchSchema({
        client: new DefaultApiClient(),
        endpoint: url,
      })
    )
      .unwrap()
      .catch((rejectedValueOrSerializedError) => {
        console.error(rejectedValueOrSerializedError);
      });
  }, [url, dispatch]);

  useEffect(() => {
    if (schemaState.status == StoreStatus.succeeded) {
      setBook(generateBook(schemaState.schema));
    }
  }, [schemaState]);

  return (
    <>
      {schemaState.error}
      {book && <SDLDocumentBrowser book={book} root={'/'}></SDLDocumentBrowser>}
    </>
  );
};
