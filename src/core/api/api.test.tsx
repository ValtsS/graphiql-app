import { extractVariables, getremoteSchema, validateVariables } from '@/core/api/api';
import fuzzball from 'fuzzball';
import { parse } from 'graphql';
import { MOCK_QUERY_EXPECTED, setupMockIntrospection } from '../../../__mocks__/api-mock-helper';

describe('API test', () => {
  const doc = parse(`
  query QQ($filter: CardFilterInput!, $selector:string = "1234") {
  getCards(filter: $filter, selector: $selector) {
  items{ uuid } }}`);

  it('should handle schema decoding', async () => {
    const { mockClient } = await setupMockIntrospection();
    const result = await getremoteSchema(mockClient, '://');
    expect(fuzzball.ratio(result, MOCK_QUERY_EXPECTED)).toBeGreaterThan(98);
  });

  it('test variable extraction', async () => {
    const vars = extractVariables(doc);
    expect(vars.length).toBe(2);
    expect(vars[0].hasDefault).toBe(false);
    expect(vars[0].variablename).toBe('filter');
    expect(vars[0].variableTypeName).toBe('CardFilterInput!');

    expect(vars[1].hasDefault).toBe(true);
    expect(vars[1].variablename).toBe('selector');
    expect(vars[1].variableTypeName).toBe('string');
  });

  it.each([['{}', `Warning, missing variable 'filter' of type 'CardFilterInput!' in variables`]])(
    'Test variable validation  %s',
    (json: string, expected: string) => {
      expect(fuzzball.ratio(validateVariables(doc, json) ?? '', expected)).toBeGreaterThan(98);
    }
  );
});
