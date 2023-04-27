import { DocumentBook } from '@/core/sdl-docs';
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
    setState((prev) => [...prev, uuid]);
  };

  return (
    <div>
      <SDLDocument content={content} onClick={navigate}></SDLDocument>
    </div>
  );
};
