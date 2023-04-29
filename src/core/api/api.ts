import { getIntrospectionQuery, printSchema, buildClientSchema, IntrospectionQuery } from 'graphql';
import { ApiClient } from './api-client';

type ResponseData = {
  data: IntrospectionQuery;
};

export async function getremoteSchema(client: ApiClient, url: string) {
  const body = JSON.stringify({
    operationName: 'IntrospectionQuery',
    query: getIntrospectionQuery(),
  });

  const { data } = await client.post<ResponseData>(url, body);
  return printSchema(buildClientSchema(data));
}
