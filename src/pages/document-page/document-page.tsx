import { SDLDocumentBrowser } from '@/components';
import { DocumentBook, generateBook } from '@/core/docs';
import { StoreStatus, selectSchemaData } from '@/slices/schema/schema';
import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

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

  return (
    <>
      {schemaState.error && <Typography>{schemaState.error}</Typography>}
      {ready && <SDLDocumentBrowser book={book} root={'/'}></SDLDocumentBrowser>}
    </>
  );
};
