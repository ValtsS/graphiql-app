import {
  DefinitionNode,
  DocumentNode,
  IntrospectionQuery,
  Kind,
  OperationDefinitionNode,
  assertValidSchema,
  buildClientSchema,
  getIntrospectionQuery,
  printSchema,
} from 'graphql';
import { ApiClient } from './api-client';
import { getTypeName } from '../docs/sdl-type-helper';
import { boolean } from 'yargs';

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

function extractVariables(doc: DocumentNode): usedVariable[] {
  const variables: usedVariable[] = [];

  doc.definitions
    .filter((d) => d.kind === Kind.OPERATION_DEFINITION)
    .forEach((dd: DefinitionNode) => {
      const defs = (dd as OperationDefinitionNode).variableDefinitions;
      if (defs)
        defs
          .filter((x) => x.kind === Kind.VARIABLE_DEFINITION)
          .forEach((v) => {
            const [varTypeName] = getTypeName(v.type);
            variables.push({
              variablename: v.variable.name.value.toString(),
              hasDefault: Boolean(v.defaultValue),
              variableTypeName: varTypeName,
            });
          });
    });

  return variables;
}

export function validateVariables(document: DocumentNode, jsonstring: string): string | undefined {
  if (document.kind !== Kind.DOCUMENT) return;

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
