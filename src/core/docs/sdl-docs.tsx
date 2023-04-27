import React from 'react';

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

export class DocumentPageHelper {
  static pushPart(page: DocumentPage, part: DocumentPart) {
    page.parts.push(part);
  }

  static pushLinkToPage(page: DocumentPage, text: string, link_uuid: string) {
    const part: DocumentPart = {
      kind: DocumentPartKind.Regular,
      link_uuid,
      text: (
        <>
          {text}
          <br />
        </>
      ),
    };
    DocumentPageHelper.pushPart(page, part);
  }

  static pushBreak(page: DocumentPage) {
    const part: DocumentPart = {
      kind: DocumentPartKind.Regular,
      text: <br />,
    };
    DocumentPageHelper.pushPart(page, part);
  }

  static pushFunction(page: DocumentPage, name: string) {
    const part: DocumentPart = {
      kind: DocumentPartKind.Regular,
      text: <>{name}</>,
    };
    DocumentPageHelper.pushPart(page, part);
  }

  static pushOpenBrace(page: DocumentPage) {
    const part: DocumentPart = {
      kind: DocumentPartKind.Regular,
      text: (
        <>
          {'{'}
          <p />
        </>
      ),
    };
    DocumentPageHelper.pushPart(page, part);
  }

  static pushCloseBrace(page: DocumentPage) {
    const part: DocumentPart = {
      kind: DocumentPartKind.Regular,
      text: (
        <>
          {'}'}
          <p />
        </>
      ),
    };
    DocumentPageHelper.pushPart(page, part);
  }

  static pushText(page: DocumentPage, text: string, BreakLine: boolean = false) {
    const partName: DocumentPart = {
      kind: DocumentPartKind.Regular,
      text: <>{text}</>,
    };
    DocumentPageHelper.pushPart(page, partName);
    if (BreakLine) DocumentPageHelper.pushBreak(page);
  }

  static pushComment(page: DocumentPage, comment: string) {
    const partName: DocumentPart = {
      kind: DocumentPartKind.Regular,
      text: (
        <p>
          {'//'}
          {comment}:
        </p>
      ),
    };
    DocumentPageHelper.pushPart(page, partName);
  }

  static pushArg(
    page: DocumentPage,
    name: string,
    typename: string,
    link?: string,
    defaultval?: string
  ) {
    const partName: DocumentPart = {
      kind: DocumentPartKind.Regular,
      text: <>{name}:</>,
    };
    DocumentPageHelper.pushPart(page, partName);

    const partType: DocumentPart = {
      kind: DocumentPartKind.Regular,
      link_uuid: link,
      text: <>{typename}</>,
    };
    DocumentPageHelper.pushPart(page, partType);

    if (defaultval) {
      const defaultVal: DocumentPart = {
        kind: DocumentPartKind.Regular,
        text: (
          <>
            {'='}
            {defaultval}
          </>
        ),
      };
      DocumentPageHelper.pushPart(page, defaultVal);
    }
  }

  static pushOpenArg(page: DocumentPage) {
    const part: DocumentPart = {
      kind: DocumentPartKind.Regular,
      text: <>{'('}</>,
    };
    DocumentPageHelper.pushPart(page, part);
  }

  static pushCloseArg(page: DocumentPage) {
    const part: DocumentPart = {
      kind: DocumentPartKind.Regular,
      text: <>{')'}</>,
    };
    DocumentPageHelper.pushPart(page, part);
  }
}
