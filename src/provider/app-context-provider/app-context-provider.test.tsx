import { setupMockIntrospection } from '@/../__mocks__/api-mock-helper';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { AppContextProvider, useAppContext } from './app-context-provider';

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
    const api = await setupMockIntrospection();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppContextProvider apiClient={api}>{children}</AppContextProvider>
    );

    const { result } = renderHook(() => useAppContext(), { wrapper });

    expect(result.current).toEqual({ apiClient: api });
  });
});
