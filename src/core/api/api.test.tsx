import { getremoteSchema } from '@/core/api/api';
import fuzzball from 'fuzzball';
import { MOCK_QUERY_EXPECTED, setupMockIntrospection } from '../../../__mocks__/api-mock-helper';

describe('API test', () => {
  it('should handle schema decoding', async () => {
    const mockClient = await setupMockIntrospection();
    const result = await getremoteSchema(mockClient, '://');
    expect(fuzzball.ratio(result, MOCK_QUERY_EXPECTED)).toBeGreaterThan(98);
  });
});
