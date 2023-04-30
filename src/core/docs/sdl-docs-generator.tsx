import { GraphQLObjectType, GraphQLSchema, Kind, buildASTSchema, parse } from 'graphql';
import { Maybe } from 'graphql/jsutils/Maybe';
import { DocumentBook, DocumentPage, DocumentPageHelper } from './sdl-docs';
import { prepareTypePage, processFunction } from './sdl-docs-helper';

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
