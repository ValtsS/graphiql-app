import { DocumentPage, DocumentPart, DocumentPartKind, RenderOnClick } from '@/core/docs/sdl-docs';
import { Box, Link } from '@mui/material';
import React from 'react';

export const UNKNOWNDOCUMENTPARTERROR = 'Unrecognized document part kind';
export class DocumentContent {
  private _page: DocumentPage;

  constructor(uuid: string) {
    this._page = {
      parts: [],
      uuid,
    };
  }

  public get parts(): DocumentPart[] {
    return this._page.parts;
  }

  public set parts(parts: DocumentPart[]) {
    this._page.parts = parts;
  }

  public render(linkClick: RenderOnClick): JSX.Element {
    const eles: JSX.Element[] = [];

    this._page.parts.forEach((p, i) => {
      switch (p.kind) {
        case DocumentPartKind.Regular: {
          const link = p.link_uuid;
          if (link) {
            eles.push(
              <Link
                href="#"
                onClick={() => linkClick(link)}
                key={`${this._page.uuid}${i.toString()}`}
              >
                {p.text && p.text(linkClick)}
              </Link>
            );
          } else
            eles.push(
              <React.Fragment key={`${this._page.uuid}${i.toString()}`}>
                {p.text && p.text(linkClick)}
              </React.Fragment>
            );

          break;
        }
        case DocumentPartKind.Break:
          eles.push(<p key={`${this._page.uuid}${i.toString()}`} />);
          break;
        default:
          throw new Error(UNKNOWNDOCUMENTPARTERROR);
      }
    });

    return (
      <Box key={this._page.uuid} mt={2}>
        {eles}
      </Box>
    );
  }
}

interface Props {
  content: DocumentContent;
  onClick: (uuid: string) => void;
}

export const SDLDocument = (props: Props) => {
  return <>{props.content.render(props.onClick)}</>;
};
