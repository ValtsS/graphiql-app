import { DocumentBook } from '@/core/docs/sdl-docs';
import { Box } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { DocumentContent, SDLDocument } from '../sdl-document/sdl-document';

interface Props {
  book: DocumentBook;
  root: string;
}

export const SDLDocumentBrowser = (props: Props) => {
  const [state, setState] = useState<string[]>([props.root]);

  if (state.length == 0) setState([props.root]);

  const page = props.book[state[state.length - 1]];

  const content = useMemo(() => {
    const c = new DocumentContent(page.uuid);
    c.parts = page.parts;
    return c;
  }, [page]);

  const navigate = (uuid: string) => {
    if (!props.book[uuid]) uuid = '/404';
    setState((prev) => [...prev, uuid]);
  };

  const backAvailable = state.length > 1;

  function goBack(): void {
    setState((prev) => [...prev.slice(0, prev.length - 1)]);
  }

  return (
    <Box
      sx={{
        alignItems: 'left',
        justifyContent: 'left',
        textAlign: 'left',
      }}
    >
      <button disabled={!backAvailable} onClick={goBack}>
        Back
      </button>
      <SDLDocument content={content} onClick={navigate}></SDLDocument>
    </Box>
  );
};
