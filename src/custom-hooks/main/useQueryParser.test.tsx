import { AppContextProvider, useAppContext } from '@/provider';
import { GraphQLSchema, buildASTSchema, parse } from 'graphql';
import React, { useEffect } from 'react';
import { useQueryParser } from './useQueryParser';
import { AppStore, setupStore } from '@/store';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { waitRender } from '@/../__mocks__/test-utils';
import { setupMockIntrospection } from '@/../__mocks__/api-mock-helper';
import fuzzball from 'fuzzball';

const TestQueryParser = ({ schema }: { schema: GraphQLSchema }) => {
  useQueryParser();
  const context = useAppContext();

  useEffect(() => {
    if (context.updateCurrentSchema) context.updateCurrentSchema(schema);
  }, [context, schema]);

  return <></>;
};

describe('useQueryparser', () => {
  let store: AppStore;
  const initial = setupStore().getState();

  const textTestState = '-------';

  const testSchema = `
  type Query {
    myNumber: Int
    get( v:Int ) : Int
    }
  `;

  it.each([
    ['query { myNumber }', undefined],
    ['', 'Syntax Error: Unexpected <EOF>.'],
    [
      'query { myNumber, yournumber }',
      'Cannot query field "yournumber" on type "Query". Did you mean "myNumber"? at line 1:19',
    ],
    [
      'query ($filter: Int) { get(v:$filter) }',
      `Warning, missing variable 'filter' of type 'Int' in variables`,
    ],
  ])('should parse without errors (%s)', async (query: string, expected?: string) => {
    const docNode = parse(testSchema);
    const mockSchema = buildASTSchema(docNode);

    store = setupStore({
      ...initial,
      editors: {
        ...initial.editors,
        query,
        queryVersion: 1,
        queryError: textTestState,
      },
    });

    expect(store.getState().editors.queryError).toBe(textTestState);
    await defaultRender(mockSchema);
    const res = store.getState().editors.queryError;
    if (expected === undefined) {
      expect(res).toBe(expected);
    } else {
      expect(fuzzball.ratio(res ?? '', expected)).toBeGreaterThan(98);
    }
  });

  async function defaultRender(schema: GraphQLSchema) {
    render(
      <AppContextProvider apiClient={null}>
        <Provider store={store}>
          <TestQueryParser schema={schema} />
        </Provider>
      </AppContextProvider>
    );
    await waitRender();
  }
});
