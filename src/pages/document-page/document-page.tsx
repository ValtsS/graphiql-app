import { DocumentBook, generateBook } from '@/core/docs';
import { StoreStatus, selectSchemaData } from '@/slices/schema/schema';
import { CircularProgress, Typography } from '@mui/material';
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import '@/core/i18n';

const LazySDLDocumentBrowser = lazy(
  () => import('@/components/sdl-document-browser/sdl-document-browser')
);

export const DocumentPageComponent = () => {
  const [book, setBook] = useState<DocumentBook | undefined>();

  const schemaState = useSelector(selectSchemaData);
  const notifyError = (message: string) => toast(message, { type: 'error' });

  useEffect(() => {
    if (schemaState.status == StoreStatus.succeeded) {
      setBook(generateBook(schemaState.schema));
    }

    if (schemaState.error) {
      notifyError(schemaState.error);
    }
  }, [schemaState]);

  const ready = schemaState.status == StoreStatus.succeeded && book;
  const loading = schemaState.status == StoreStatus.loading;

  return (
    <>
      {schemaState.error && <Typography>{schemaState.error}</Typography>}
      <Suspense fallback={<CircularProgress />}>
        {loading && <CircularProgress />}
        {ready && <LazySDLDocumentBrowser book={book} root={'/'}></LazySDLDocumentBrowser>}
      </Suspense>
    </>
  );
};
