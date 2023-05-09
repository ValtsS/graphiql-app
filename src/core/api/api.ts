import {
  DefinitionNode,
  DocumentNode,
  IntrospectionQuery,
  Kind,
  assertValidSchema,
  buildClientSchema,
  getIntrospectionQuery,
  printSchema,
} from 'graphql';
import { ApiClient } from './api-client';
import { getTypeName } from '../docs/sdl-type-helper';

export type IntrospectionResponseData = {
  data: IntrospectionQuery;
};

export async function getremoteSchema(client: ApiClient, url: string): Promise<string> {
  const body = JSON.stringify({
    operationName: 'IntrospectionQuery',
    query: getIntrospectionQuery(),
  });

  const { data } = await client.post<IntrospectionResponseData>(url, body);
  const schema = buildClientSchema(data);
  assertValidSchema(schema);
  return printSchema(schema);
}

export async function sendQuery(
  client: ApiClient,
  url: string,
  query: string,
  variables: unknown
): Promise<string> {
  const body = JSON.stringify({
    query: query,
    variables: variables,
  });
  const response = await client.post<unknown>(url, body, { DisableThrowOnError: true });
  return JSON.stringify(response, null, 2);
}

type usedVariable = {
  variablename: string;
  variableTypeName: string;
  hasDefault: boolean;
};

export function extractVariables(doc: DocumentNode): usedVariable[] {
  const variables: usedVariable[] = [];

  if (doc.kind == Kind.DOCUMENT) {
    doc.definitions.forEach((def: DefinitionNode) => {
      switch (def.kind) {
        case Kind.OPERATION_DEFINITION:
        case Kind.FRAGMENT_DEFINITION:
          if (def.variableDefinitions) {
            def.variableDefinitions.forEach((v) => {
              if (v.kind == Kind.VARIABLE_DEFINITION) {
                const [varTypeName] = getTypeName(v.type);
                variables.push({
                  variablename: v.variable.name.value.toString(),
                  hasDefault: v.defaultValue ? true : false,
                  variableTypeName: varTypeName,
                });
              }
            });
          }
          break;
        default:
          throw Error(`Unknown ${def.kind} passed to extractVariables`);
      }
    });
  }

  return variables;
}

export function validateVariables(document: DocumentNode, jsonstring: string): string | undefined {
  let res: string | undefined = undefined;
  const requriredVars = extractVariables(document);
  const varsJSON = JSON.parse(jsonstring);

  requriredVars.forEach((v) => {
    if (!v.hasDefault) {
      if (!varsJSON[v.variablename]) {
        const line = `Warning, missing variable '${v.variablename}' of type '${v.variableTypeName}' in variables`;
        if (!res) res = line;
        else res += '\n' + line;
      }
    }
  });

  return res;
}
