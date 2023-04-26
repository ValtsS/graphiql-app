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

export class DocumentContent {
  uuid: string;
  parts: DocumentPart[] = [];

  constructor(uuid: string) {
    this.uuid = uuid;
  }

  public render(linkClick: (uuid: string) => void): JSX.Element {
    const eles: JSX.Element[] = [];

    this.parts.forEach((p, i) => {
      switch (p.kind) {
        case DocumentPartKind.Regular: {
          if (p.link_uuid) {
            eles.push(
              <a
                href="#"
                onClick={() => linkClick(p.link_uuid ?? '')}
                key={`${this.uuid}${i.toString()}`}
              >
                {p.text}
              </a>
            );
          } else
            eles.push(
              <React.Fragment key={`${this.uuid}${i.toString()}`}>{p.text}</React.Fragment>
            );

          break;
        }
        case DocumentPartKind.Break:
          eles.push(<p key={`${this.uuid}${i.toString()}`} />);
          break;
        default:
          throw new Error('Unrecognized document part kind');
      }
    });

    return <div key={this.uuid}>{eles}</div>;
  }
}

interface Props {
  content: DocumentContent;
  onClick: (uuid: string) => void;
}

export const SDLDocument = (props: Props) => {
  return <>{props.content.render(props.onClick)}</>;
};
