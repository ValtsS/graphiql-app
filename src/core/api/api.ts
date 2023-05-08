import {
  getIntrospectionQuery,
  printSchema,
  buildClientSchema,
  IntrospectionQuery,
  assertValidSchema,
} from 'graphql';
import { ApiClient } from './api-client';
import { assertValidSDL } from 'graphql/validation/validate';

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

  return JSON.stringify(
    await client.post<string>(url, body, { DisableThrowOnError: true }),
    null,
    2
  );
}
