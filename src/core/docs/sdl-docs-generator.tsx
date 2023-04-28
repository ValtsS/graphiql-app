import { DocumentContent } from '@/components/sdl-document/sdl-document';
import { Box } from '@mui/material';
import {
  FieldDefinitionNode,
  GraphQLObjectType,
  GraphQLSchema,
  Kind,
  buildASTSchema,
  buildClientSchema,
  getIntrospectionQuery,
  parse,
  printSchema,
} from 'graphql';
import { Maybe } from 'graphql/jsutils/Maybe';
import React from 'react';
import {
  DocumentBook,
  DocumentPage,
  DocumentPageHelper,
  DocumentPartKind,
  RenderOnClick,
} from './sdl-docs';
import { prepareTypePage, renderParts } from './sdl-docs-helper';
import { getConstValue, getTypeName } from './sdl-type-helper';

export async function getremoteSchema(url: string) {
  const { data, errors } = await fetch(url, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      operationName: 'IntrospectionQuery',
      query: getIntrospectionQuery(),
    }),
  }).then((res) => res.json());

  if (errors) {
    throw new Error('Error fetching remote schema!');
  }

  return printSchema(buildClientSchema(data));
}

export function generateBook(schema: string): DocumentBook {
  const book: DocumentBook = {};

  const docNode = parse(schema);
  const ast = buildASTSchema(docNode);

  book['/404'] = Add404Page();
  generateRootPage(ast, book);
  generateTypePages(ast, book);

  return book;
}

function Add404Page() {
  const NotFoundPage: DocumentPage = {
    uuid: '/404',
    parts: [],
  };
  DocumentPageHelper.pushText(NotFoundPage, 'Not found');
  DocumentPageHelper.pushLinkToPage(NotFoundPage, 'Back to start', '/');
  return NotFoundPage;
}

function generateRootPage(ast: GraphQLSchema, book: DocumentBook) {
  const root: DocumentPage = {
    uuid: '/',
    parts: [],
  };

  const queryPage = prepQueryPage(ast.getQueryType());
  book['/query'] = queryPage;
  DocumentPageHelper.pushLinkToPage(root, 'Queries', '/query');

  const mutationPage = prepQueryPage(ast.getMutationType());
  book['/mutate'] = mutationPage;
  DocumentPageHelper.pushLinkToPage(root, 'Mutations', '/mutate');

  const subscribePage = prepQueryPage(ast.getSubscriptionType());
  book['/subscribe'] = subscribePage;
  DocumentPageHelper.pushLinkToPage(root, 'Subscriptions', '/subscribe');

  book['/'] = root;
}

function generateTypePages(ast: GraphQLSchema, book: DocumentBook) {
  const typeMap = ast.getTypeMap();
  for (const typeKey in typeMap) {
    book[typeKey] = prepareTypePage(typeMap[typeKey], typeKey);
  }
}

function prepQueryPage(queryType: Maybe<GraphQLObjectType>) {
  const page: DocumentPage = {
    uuid: '/',
    parts: [],
  };

  if (queryType?.astNode) {
    const fields = queryType.astNode.fields;
    if (fields && fields.length > 0) {
      fields.forEach((field) => {
        if (field.kind == Kind.FIELD_DEFINITION) {
          processFunction(field, page);
        }
      });
    }
  }
  return page;
}

function processFunction(f: FieldDefinitionNode, rooxt: DocumentPage) {
  const inner: DocumentPage = {
    uuid: rooxt.uuid,
    parts: [],
  };

  const desc = f.description?.value;
  if (desc) DocumentPageHelper.pushComment(inner, desc);
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

  const doc = renderParts(rooxt, inner);

  DocumentPageHelper.pushPart(rooxt, {
    kind: DocumentPartKind.Regular,
    text: (onClick: RenderOnClick) => <div data-testid="doc_function">{doc.render(onClick)}</div>,
  });
}
function describeArguments(f: FieldDefinitionNode, parent: DocumentPage): DocumentContent {
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
