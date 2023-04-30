import {
  UnionTypeDefinitionNode,
  EnumTypeDefinitionNode,
  FieldDefinitionNode,
  InputValueDefinitionNode,
  GraphQLNamedType,
  Kind,
} from 'graphql';
import { DocumentPage, DocumentPageHelper, DocumentPartKind, RenderOnClick } from './sdl-docs';
import { getConstValue, getTypeName } from './sdl-type-helper';
import { DocumentContent } from '@/components/sdl-document/sdl-document';
import React from 'react';
import { Box } from '@mui/material';

export function handleUnion(node: UnionTypeDefinitionNode, page: DocumentPage) {
  DocumentPageHelper.pushText(page, node.name.value);
  DocumentPageHelper.pushBreak(page);

  node.types?.forEach((t, i) => {
    if (i > 0) DocumentPageHelper.pushText(page, ' | ');
    DocumentPageHelper.pushType(page, getTypeName(t)[0], getTypeName(t)[1]);
  });
}

export function handleEnumeration(node: EnumTypeDefinitionNode, page: DocumentPage) {
  DocumentPageHelper.pushText(page, `${node.name.value} enum`, true);
  node.values?.forEach((val, i) => {
    if (val.description) DocumentPageHelper.pushComment(page, val.description?.value);
    if (i > 0) DocumentPageHelper.pushText(page, ' | ');
    DocumentPageHelper.pushText(page, val.name.value);
  });
}

export function describeArguments(f: FieldDefinitionNode, parent: DocumentPage): DocumentContent {
  const args: DocumentPage = {
    uuid: parent.uuid,
    parts: [],
  };

  if (f.arguments && f.arguments.length > 0) {
    const multiple = f.arguments.length > 1;

    f.arguments.forEach((a) => {
      if (a.description) {
        DocumentPageHelper.pushComment(args, a.description.value);
      }

      const typeInfo = getTypeName(a.type);
      DocumentPageHelper.pushArg(
        args,
        a.name.value,
        typeInfo[0],
        typeInfo[1],
        a.defaultValue ? getConstValue(a.defaultValue) : undefined
      );

      if (multiple) DocumentPageHelper.pushBreak(args);
    });
  }

  return renderParts(parent, args);
}

export function pushTypeText(
  page: DocumentPage,
  f: FieldDefinitionNode | InputValueDefinitionNode
) {
  if (f.kind == Kind.FIELD_DEFINITION && f.arguments && f.arguments.length > 0) {
    processFunction(f, page);
  } else {
    DocumentPageHelper.pushArg(page, f.name.value, getTypeName(f.type)[0], getTypeName(f.type)[1]);
  }
  DocumentPageHelper.pushBreak(page);
}

export function renderParts(parent: DocumentPage, child: DocumentPage): DocumentContent {
  const doc = new DocumentContent(parent.uuid);
  doc.parts = child.parts;
  return doc;
}

export function prepareTypePage(namedType: GraphQLNamedType, uuid: string): DocumentPage {
  const page: DocumentPage = {
    uuid,
    parts: [],
  };

  if (namedType.description) DocumentPageHelper.pushComment(page, namedType.description);

  if (namedType?.astNode) {
    const node = namedType?.astNode;

    switch (node.kind) {
      case Kind.SCALAR_TYPE_DEFINITION:
        DocumentPageHelper.pushText(page, node.name.value + ' ');
        DocumentPageHelper.pushLinkToPage(page, node.name.value, node.name.value);
        break;
      case Kind.OBJECT_TYPE_DEFINITION:
      case Kind.INTERFACE_TYPE_DEFINITION:
      case Kind.INPUT_OBJECT_TYPE_DEFINITION:
        DocumentPageHelper.pushText(page, node.name.value, true);
        node.fields?.forEach((f) => pushTypeText(page, f));
        break;
      case Kind.UNION_TYPE_DEFINITION:
        handleUnion(node, page);
        break;
      case Kind.ENUM_TYPE_DEFINITION:
        handleEnumeration(node, page);
        break;

      default:
        throw new Error(`Unexpected node kind in ${(node as GraphQLNamedType).name}`);
    }
  }

  const wrapper: DocumentPage = {
    uuid,
    parts: [],
  };
  const doc = renderParts(wrapper, page);

  DocumentPageHelper.pushPart(wrapper, {
    kind: DocumentPartKind.Regular,
    text: (onClick: RenderOnClick) => <div data-testid="doc_type">{doc.render(onClick)}</div>,
  });

  return wrapper;
}

export function processFunction(f: FieldDefinitionNode, parent: DocumentPage) {
  const inner: DocumentPage = {
    uuid: parent.uuid,
    parts: [],
  };

  const name = f.name.value;

  DocumentPageHelper.pushFunction(inner, name);

  const args = describeArguments(f, inner);

  DocumentPageHelper.pushPart(inner, {
    kind: DocumentPartKind.Regular,
    text: (onClick: RenderOnClick) => (
      <>
        {'('}
        <Box data-testid="doc_function_args" pl={2}>
          {args.render(onClick)}
        </Box>
        {')'}
      </>
    ),
  });

  if (f.type) {
    const typeInfo = getTypeName(f.type);
    DocumentPageHelper.pushRetType(inner, typeInfo[0], typeInfo[1]);
  }

  DocumentPageHelper.pushBreak(inner);

  const doc = renderParts(parent, inner);

  const desc = f.description?.value;
  if (desc) DocumentPageHelper.pushComment(parent, desc);

  DocumentPageHelper.pushPart(parent, {
    kind: DocumentPartKind.Regular,
    text: (onClick: RenderOnClick) => <div data-testid="doc_function">{doc.render(onClick)}</div>,
  });
}
