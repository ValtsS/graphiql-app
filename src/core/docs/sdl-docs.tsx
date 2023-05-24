import { Typography } from '@mui/material';
import React from 'react';

const COLOR_COMMENT = 'gray';
const COLOR_FUNCTION = '#7F5342';
const COLOR_TYPE = '#066555';
const COLOR_VAR = '#1F377F';

export const enum DocumentPartKind {
  Regular = 'Regular',
  Break = 'BR',
  Unknown = 'Unknown', // Should not happen
}

export type RenderOnClick = (uuid: string) => void;
export type JSXCallback = (event: RenderOnClick) => JSX.Element;

export type DocumentPart = {
  kind: DocumentPartKind;
  text?: JSXCallback;
  link_uuid?: string;
};

export type DocumentPage = {
  uuid: string;
  parts: DocumentPart[];
};

export type DocumentBook = {
  [uuid: string]: DocumentPage;
};

function formatText(e: JSX.Element, color?: string, testId?: string) {
  return (
    <Typography
      sx={{ color, fontFamily: 'monospace', fontSize: '14px' }}
      component={'span'}
      data-testid={testId}
    >
      {e}
    </Typography>
  );
}

export class DocumentPageHelper {
  static pushPart(page: DocumentPage, part: DocumentPart) {
    page.parts.push(part);
  }

  static pushLinkToPage(page: DocumentPage, text: React.ReactNode, link_uuid: string) {
    const part: DocumentPart = {
      kind: DocumentPartKind.Regular,
      link_uuid,
      text: () =>
        formatText(
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
      text: () => <br />,
    };
    DocumentPageHelper.pushPart(page, part);
  }

  static pushFunction(page: DocumentPage, name: string) {
    const part: DocumentPart = {
      kind: DocumentPartKind.Regular,
      text: () => formatText(<>{name}</>, COLOR_FUNCTION),
    };
    DocumentPageHelper.pushPart(page, part);
  }

  static pushText(page: DocumentPage, text: string, BreakLine = false) {
    const partName: DocumentPart = {
      kind: DocumentPartKind.Regular,
      text: () => formatText(<>{text}</>),
    };
    DocumentPageHelper.pushPart(page, partName);
    if (BreakLine) DocumentPageHelper.pushBreak(page);
  }

  static pushComment(page: DocumentPage, comment: string) {
    const partName: DocumentPart = {
      kind: DocumentPartKind.Regular,
      text: () =>
        formatText(
          <>
            {'//'}
            {comment}
          </>,
          COLOR_COMMENT,
          'doc_comment'
        ),
    };
    DocumentPageHelper.pushPart(page, partName);
  }

  static pushType(page: DocumentPage, typename: string, link?: string) {
    const parType: DocumentPart = {
      kind: DocumentPartKind.Regular,
      link_uuid: link,
      text: () => formatText(<>{typename}</>, COLOR_TYPE),
    };
    DocumentPageHelper.pushPart(page, parType);
  }

  static pushRetType(page: DocumentPage, typename: string, link?: string) {
    const partCol: DocumentPart = {
      kind: DocumentPartKind.Regular,
      text: () => formatText(<>:</>),
    };
    DocumentPageHelper.pushPart(page, partCol);
    DocumentPageHelper.pushType(page, typename, link);
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
      text: () => formatText(<>{name}:</>, COLOR_VAR),
    };
    DocumentPageHelper.pushPart(page, partName);

    const partType: DocumentPart = {
      kind: DocumentPartKind.Regular,
      link_uuid: link,
      text: () => formatText(<>{typename}</>, COLOR_TYPE),
    };
    DocumentPageHelper.pushPart(page, partType);

    if (defaultval) {
      const defaultVal: DocumentPart = {
        kind: DocumentPartKind.Regular,
        text: () =>
          formatText(
            <>
              {'='}
              {defaultval}
            </>
          ),
      };
      DocumentPageHelper.pushPart(page, defaultVal);
    }
  }
}
