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

export class DocumentPageHelper {
  static pushPart(page: DocumentPage, part: DocumentPart) {
    page.parts.push(part);
  }

  static pushLinkToPage(page: DocumentPage, text: React.ReactNode, link_uuid: string) {
    const part: DocumentPart = {
      kind: DocumentPartKind.Regular,
      link_uuid,
      text: () => (
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
      text: () => <Typography sx={{ color: COLOR_FUNCTION }}>{name}</Typography>,
    };
    DocumentPageHelper.pushPart(page, part);
  }

  static pushText(page: DocumentPage, text: string, BreakLine = false) {
    const partName: DocumentPart = {
      kind: DocumentPartKind.Regular,
      text: () => <>{text}</>,
    };
    DocumentPageHelper.pushPart(page, partName);
    if (BreakLine) DocumentPageHelper.pushBreak(page);
  }

  static pushComment(page: DocumentPage, comment: string) {
    const partName: DocumentPart = {
      kind: DocumentPartKind.Regular,
      text: () => (
        <Typography sx={{ color: COLOR_COMMENT }} data-testid={'doc_comment'}>
          {'//'}
          {comment}
        </Typography>
      ),
    };
    DocumentPageHelper.pushPart(page, partName);
  }

  static pushType(page: DocumentPage, typename: string, link?: string) {
    const parType: DocumentPart = {
      kind: DocumentPartKind.Regular,
      link_uuid: link,
      text: () => (
        <Typography sx={{ color: COLOR_TYPE }} component={'span'}>
          {typename}
        </Typography>
      ),
    };
    DocumentPageHelper.pushPart(page, parType);
  }

  static pushRetType(page: DocumentPage, typename: string, link?: string) {
    const partCol: DocumentPart = {
      kind: DocumentPartKind.Regular,
      text: () => <>:</>,
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
      text: () => (
        <Typography component={'span'} sx={{ color: COLOR_VAR }}>
          {name}:
        </Typography>
      ),
    };
    DocumentPageHelper.pushPart(page, partName);

    const partType: DocumentPart = {
      kind: DocumentPartKind.Regular,
      link_uuid: link,
      text: () => (
        <Typography sx={{ color: COLOR_TYPE }} component={'span'}>
          {typename}
        </Typography>
      ),
    };
    DocumentPageHelper.pushPart(page, partType);

    if (defaultval) {
      const defaultVal: DocumentPart = {
        kind: DocumentPartKind.Regular,
        text: () => (
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
