import {
  EnumTypeDefinitionNode,
  FieldDefinitionNode,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLSchema,
  InputValueDefinitionNode,
  Kind,
  UnionTypeDefinitionNode,
  buildASTSchema,
  buildClientSchema,
  getIntrospectionQuery,
  parse,
  printSchema,
} from 'graphql';
import { Maybe } from 'graphql/jsutils/Maybe';
import { DocumentBook, DocumentPage, DocumentPageHelper } from './sdl-docs';
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

function generateTypePages(ast: GraphQLSchema, book: DocumentBook) {
  const typeMap = ast.getTypeMap();
  for (const typeKey in typeMap) {
    book[typeKey] = prepareTypePage(typeMap[typeKey], typeKey);
  }
}

function prepareTypePage(namedType: GraphQLNamedType, uuid: string): DocumentPage {
  const page: DocumentPage = {
    uuid,
    parts: [],
  };

  if (namedType.description) DocumentPageHelper.pushText(page, namedType.description);

  if (namedType?.astNode) {
    const node = namedType?.astNode;
    switch (node.kind) {
      case Kind.SCALAR_TYPE_DEFINITION:
        DocumentPageHelper.pushText(page, node.name.value);
        DocumentPageHelper.pushLinkToPage(page, node.name.value, node.name.value);
        break;
      case Kind.OBJECT_TYPE_DEFINITION:
      case Kind.INTERFACE_TYPE_DEFINITION:
      case Kind.INPUT_OBJECT_TYPE_DEFINITION:
        DocumentPageHelper.pushText(page, node.name.value);
        node.fields?.forEach((f) => pushTypeText(page, f));
        break;
      case Kind.UNION_TYPE_DEFINITION:
        handleUnion(node, page);
        //uni.types as links
        break;
      case Kind.ENUM_TYPE_DEFINITION:
        handleEnumeration(node, page);
        break;

      default:
        throw new Error(`Unexpected node kind in ${(node as GraphQLNamedType).name}`);
    }
  }

  return page;
}

function handleUnion(node: UnionTypeDefinitionNode, page: DocumentPage) {
  if (node.description) DocumentPageHelper.pushComment(page, node.description?.value);
  DocumentPageHelper.pushText(page, node.name.value);
}

function handleEnumeration(node: EnumTypeDefinitionNode, page: DocumentPage) {
  if (node.description) DocumentPageHelper.pushComment(page, node.description?.value);
  DocumentPageHelper.pushText(page, `${node.name.value} enum`);
  node.values?.forEach((val, i) => {
    if (val.description) DocumentPageHelper.pushComment(page, val.description?.value);
    if (i > 0) DocumentPageHelper.pushText(page, ' | ');
    DocumentPageHelper.pushText(page, val.name.value);
  });
}

function pushTypeText(page: DocumentPage, f: FieldDefinitionNode | InputValueDefinitionNode) {
  DocumentPageHelper.pushArg(page, f.name.value, getTypeName(f.type)[0], getTypeName(f.type)[1]);
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

function prepQueryPage(queryType: Maybe<GraphQLObjectType>) {
  const page: DocumentPage = {
    uuid: '/',
    parts: [],
  };

  if (queryType?.astNode) {
    const fields = queryType.astNode.fields;
    if (fields && fields.length > 0) {
      DocumentPageHelper.pushOpenBrace(page);

      fields.forEach((field) => {
        if (field.kind == Kind.FIELD_DEFINITION) {
          processFunction(field, page);
        }
      });

      DocumentPageHelper.pushCloseBrace(page);
    }
  }
  return page;
}

function processFunction(f: FieldDefinitionNode, root: DocumentPage) {
  const desc = f.description?.value;
  if (desc) DocumentPageHelper.pushComment(root, desc);

  const name = f.name.value;

  DocumentPageHelper.pushFunction(root, name);

  DocumentPageHelper.pushOpenArg(root);

  if (f.arguments && f.arguments.length > 0) {
    const multiple = f.arguments.length > 1;

    f.arguments.forEach((a) => {
      if (a.description) {
        DocumentPageHelper.pushComment(root, a.description.value);
      }

      const typeInfo = getTypeName(a.type);
      DocumentPageHelper.pushArg(
        root,
        a.name.value,
        typeInfo[0],
        typeInfo[1],
        a.defaultValue ? getConstValue(a.defaultValue) : undefined
      );

      if (multiple) DocumentPageHelper.pushBreak(root);
    });
  }

  DocumentPageHelper.pushCloseArg(root);
  DocumentPageHelper.pushBreak(root);
}
