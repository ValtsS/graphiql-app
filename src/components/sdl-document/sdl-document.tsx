import { DocumentPage, DocumentPart, DocumentPartKind } from '@/core/sdl-docs';
import React from 'react';

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

  public render(linkClick: (uuid: string) => void): JSX.Element {
    const eles: JSX.Element[] = [];

    this._page.parts.forEach((p, i) => {
      switch (p.kind) {
        case DocumentPartKind.Regular: {
          if (p.link_uuid) {
            eles.push(
              <a
                href="#"
                onClick={() => linkClick(p.link_uuid ?? '')}
                key={`${this._page.uuid}${i.toString()}`}
              >
                {p.text}
              </a>
            );
          } else
            eles.push(
              <React.Fragment key={`${this._page.uuid}${i.toString()}`}>{p.text}</React.Fragment>
            );

          break;
        }
        case DocumentPartKind.Break:
          eles.push(<p key={`${this._page.uuid}${i.toString()}`} />);
          break;
        default:
          throw new Error('Unrecognized document part kind');
      }
    });

    return <div key={this._page.uuid}>{eles}</div>;
  }
}

interface Props {
  content: DocumentContent;
  onClick: (uuid: string) => void;
}

export const SDLDocument = (props: Props) => {
  return <>{props.content.render(props.onClick)}</>;
};
