import { ApiClient } from '@/core/api/api-client';
import { GraphQLSchema } from 'graphql';
import React, { useCallback, useMemo, useState } from 'react';

type AppContextValue = {
  apiClient: ApiClient | null;
  currentSchema?: GraphQLSchema;
  updateCurrentSchema?: (schema?: GraphQLSchema) => void;
};

export const AppContext = React.createContext<AppContextValue>({
  apiClient: null,
});

type AppContextProviderProps = {
  children: React.ReactNode;
  apiClient: ApiClient | null;
};

export const AppContextProvider = ({ children, apiClient }: AppContextProviderProps) => {
  const [currentSchema, setCurrentSchema] = useState<GraphQLSchema | undefined>(undefined);

  const updateCurrentSchema = useCallback((schema?: GraphQLSchema) => {
    setCurrentSchema(schema);
  }, []);

  const contextValue: AppContextValue = useMemo(() => {
    return {
      apiClient,
      currentSchema,
      updateCurrentSchema,
    };
  }, [apiClient, currentSchema]);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export function useAppContext() {
  const store = React.useContext(AppContext);
  if (!store) {
    throw new Error('useAppContext must be used within a AppContextProvider');
  }
  return store;
}
