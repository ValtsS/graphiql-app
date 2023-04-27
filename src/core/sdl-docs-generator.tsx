import {
  ConstListValueNode,
  ConstValueNode,
  FieldDefinitionNode,
  GraphQLObjectType,
  Kind,
  ListTypeNode,
  NamedTypeNode,
  NonNullTypeNode,
  TypeNode,
  buildASTSchema,
  buildClientSchema,
  getIntrospectionQuery,
  parse,
  printSchema,
} from 'graphql';
import { Maybe } from 'graphql/jsutils/Maybe';
import { DocumentBook, DocumentPage, DocumentPageHelper } from './sdl-docs';

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

  // const dirs = schema.getDirectives();
  // const types = schema.getTypeMap();

  // const print2 = printSchema(schema);
  // console.log(print2);

  book['/'] = root;

  return book;
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

function getTypeName(type: TypeNode): [string, string?] {
  switch (type.kind) {
    case Kind.NAMED_TYPE:
      const v = (type as NamedTypeNode).name.value;
      return [v, v];
    case Kind.LIST_TYPE:
      const [listType, listTypeName] = getTypeName((type as ListTypeNode).type);
      return [listType, listTypeName];
    case Kind.NON_NULL_TYPE:
      const [nonNullType, nonNullTypeName] = getTypeName((type as NonNullTypeNode).type);
      return [nonNullType, nonNullTypeName];
    default:
      throw new Error(`Unsupported TypeNode kind: ${(type as TypeNode)?.kind}`);
  }
}

function getConstValue(value: ConstValueNode): string {
  switch (value.kind) {
    case Kind.INT:
    case Kind.FLOAT:
    case Kind.STRING:
    case Kind.BOOLEAN:
    case Kind.ENUM:
      return value.value.toString();
    case Kind.NULL:
      return 'NULL';
    case Kind.LIST:
      return (
        '[' +
        (value as ConstListValueNode).values
          .map((v) => getConstValue(v))
          .reduce((prev, curr) => prev + ', ' + curr) +
        ']'
      );
    case Kind.OBJECT: {
      let objstr = '';
      value.fields.forEach((f) => {
        const fieldValue = getConstValue(f.value);
        objstr += '\n' + f.name.value + ' = ' + fieldValue;
      });

      return objstr;
    }

    default:
      throw new Error(`Unsupported ConstValueNode kind: ${(value as ConstValueNode).kind}`);
  }
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
