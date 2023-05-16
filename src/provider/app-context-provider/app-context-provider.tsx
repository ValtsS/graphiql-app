import { ApiClient } from '@/core/api/api-client';
import { FirebaseAuth } from '@/core/firebase/firebase';
import { GraphQLSchema } from 'graphql';
import React, { useCallback, useMemo, useState } from 'react';

type AppContextValue = {
  apiClient: ApiClient | null;
  auth: FirebaseAuth | null;
  currentSchema?: GraphQLSchema;
  updateCurrentSchema?: (schema?: GraphQLSchema) => void;
};

export const AppContext = React.createContext<AppContextValue>({
  apiClient: null,
  auth: null,
});

type AppContextProviderProps = {
  children: React.ReactNode;
  apiClient: ApiClient | null;
  auth: FirebaseAuth | null;
};

export const AppContextProvider = ({ children, apiClient, auth }: AppContextProviderProps) => {
  const [currentSchema, setCurrentSchema] = useState<GraphQLSchema | undefined>(undefined);

  const updateCurrentSchema = useCallback((schema?: GraphQLSchema) => {
    setCurrentSchema(schema);
  }, []);

  const contextValue: AppContextValue = useMemo(() => {
    return {
      apiClient,
      currentSchema,
      updateCurrentSchema,
      auth,
    };
  }, [apiClient, currentSchema, updateCurrentSchema, auth]);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export function useAppContext() {
  const store = React.useContext(AppContext);
  if (!store) {
    throw new Error('useAppContext must be used within a AppContextProvider');
  }
  return store;
}
