import { SimpleMockApiClient } from '@/../__mocks__/SimpleMockApiClient';
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  graphql,
  getIntrospectionQuery,
} from 'graphql';
import { IntrospectionResponseData } from './api';

export const MOCK_QUERY_EXPECTED = `type Query { myNumber: Int }`;

export async function setupMockIntrospection() {
  const mockSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: {
        myNumber: {
          type: GraphQLInt,
          resolve: () => 42, // Return any number you like
        },
      },
    }),
  });

  const introspectionResult = await graphql({
    schema: mockSchema,
    source: getIntrospectionQuery(),
  });

  const fn = jest.fn().mockReturnValue(introspectionResult);
  const mockClient = new SimpleMockApiClient<IntrospectionResponseData>(fn);
  return mockClient;
}
