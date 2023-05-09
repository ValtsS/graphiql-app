import {
  IntrospectionQuery,
  assertValidSchema,
  buildClientSchema,
  getIntrospectionQuery,
  printSchema,
} from 'graphql';
import { ApiClient } from './api-client';

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
