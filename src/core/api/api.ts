import { getIntrospectionQuery, printSchema, buildClientSchema } from 'graphql';

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
