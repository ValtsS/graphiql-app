import { SimpleMockApiClient } from '@/../__mocks__/SimpleMockApiClient';
import { IntrospectionResponseData, getremoteSchema } from '@/core/api/api';
import fuzzball from 'fuzzball';
import {
  GraphQLSchema,
  GraphQLObjectType,
  graphql,
  getIntrospectionQuery,
  GraphQLInt,
} from 'graphql';

describe('API test', () => {
  it('should handle schema decoding', async () => {
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

    const result = await getremoteSchema(mockClient, '://');
    const expected = `type Query { myNumber: Int }`;

    expect(fuzzball.ratio(result, expected)).toBeGreaterThan(98);
  });
});
