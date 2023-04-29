import { getIntrospectionQuery, printSchema, buildClientSchema, IntrospectionQuery } from 'graphql';
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
  return printSchema(buildClientSchema(data));
}
