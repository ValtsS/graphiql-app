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

  public render(linkClick: (uuid: string) => {}): JSX.Element {
    const eles: JSX.Element[] = [];

    this.parts.forEach((p) => {
      switch (p.kind) {
        case DocumentPartKind.Regular: {
          if (p.link_uuid) {
            eles.push(
              <a href="#" onClick={(e) => linkClick(p.link_uuid ?? '')}>
                {p.text}
              </a>
            );
          } else eles.push(<>{p.text}</>);

          break;
        }
        case DocumentPartKind.Break:
          eles.push(<p />);
          break;
        default:
          throw new Error('Unrecognized document part kind');
      }
    });

    return <>{eles.map((e) => e)}</>;
  }
}

interface Props {
  content: DocumentContent;
  onClick: (uuid: string) => {};
}

export const SDLDocument = (props: Props) => {
  return <>{props.content.render(props.onClick)}</>;
};
