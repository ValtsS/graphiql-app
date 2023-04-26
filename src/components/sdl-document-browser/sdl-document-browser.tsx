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

  const page = props.book[state[0]];

  const content = useMemo(() => {
    const c = new DocumentContent(page.uuid);
    c.parts = page.parts;
    return c;
  }, [page]);

  return (
    <div>
      <SDLDocument
        content={content}
        onClick={function (uuid: string): void {
          throw new Error('Function not implemented. UUID=' + uuid);
        }}
      ></SDLDocument>
    </div>
  );
};
