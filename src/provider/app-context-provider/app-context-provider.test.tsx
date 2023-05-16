import { setupMockIntrospection } from '@/../__mocks__/api-mock-helper';
import { renderHook } from '@testing-library/react';
import React, { useEffect } from 'react';
import { AppContextProvider, useAppContext } from './app-context-provider';
import { GraphQLSchema } from 'graphql';
import { FirebaseMock } from '@/../__mocks__/firebaseMock';

describe('useAppContext', () => {
  test('should throw an error when used outside of AppContextProvider', () => {
    const original = React.useContext;
    const spiedOnError = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      React.useContext = jest.fn().mockReturnValueOnce(null);
      expect(spiedOnError).toHaveBeenCalledTimes(0);
      expect(() => {
        renderHook(() => useAppContext());
      }).toThrowError();
      expect(spiedOnError).toHaveBeenCalled();
    } finally {
      React.useContext = original;
      spiedOnError.mockRestore();
    }
  });

  test('should return the app context value when used within AppContextProvider', async () => {
    const { mockClient: api } = await setupMockIntrospection();

    const auth = new FirebaseMock();
    auth.user.mockReturnValue({
      displayName: 'Dummy',
      uid: 'uid',
    });

    const Internal = () => {
      const { apiClient, updateCurrentSchema } = useAppContext();

      useEffect(() => {
        const update = async () => {
          if (updateCurrentSchema) updateCurrentSchema(new GraphQLSchema({}));
        };

        update();
      }, [apiClient, updateCurrentSchema]);

      return <>Heh</>;
    };

    const Wrapper = ({ children }: { children: React.ReactNode }) => {
      return (
        <AppContextProvider apiClient={api} auth={auth}>
          <Internal />
          {children}
        </AppContextProvider>
      );
    };

    const { result } = renderHook(() => useAppContext(), { wrapper: Wrapper });

    expect(result.current.apiClient).toEqual(api);
    expect(result.current.currentSchema).toBeTruthy();
    expect(result.current.auth).toBe(auth);
  });
});
