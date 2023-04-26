export const enum DocumentPartKind {
  Regular = 'Regular',
  Break = 'BR',
}

export type DocumentPart = {
  kind: DocumentPartKind;
  text?: JSX.Element;
  link_uuid?: string;
};

export type DocumentPage = {
  uuid: string;
  parts: DocumentPart[];
};

export type DocumentBook = {
  [uuid: string]: DocumentPage;
};
