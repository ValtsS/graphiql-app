import { ApiClient } from '@/core/api/api-client';
import { FirebaseAuth } from '@/core/firebase/firebase';
import { RouteConfig } from '@/routes';
import { GraphQLSchema } from 'graphql';
import React, { useCallback, useMemo, useState } from 'react';

type AppContextValue = {
  apiClient: ApiClient | null;
  auth: FirebaseAuth | null;
  currentSchema?: GraphQLSchema;
  updateCurrentSchema?: (schema?: GraphQLSchema) => void;
  routing: RouteConfig[] | undefined;
};

export const AppContext = React.createContext<AppContextValue>({
  apiClient: null,
  auth: null,
  routing: [],
});

type AppContextProviderProps = {
  children: React.ReactNode;
  apiClient: ApiClient | null;
  auth: FirebaseAuth | null;
  routing?: RouteConfig[];
};

export const AppContextProvider = ({
  children,
  apiClient,
  auth,
  routing,
}: AppContextProviderProps) => {
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
      routing,
    };
  }, [apiClient, currentSchema, updateCurrentSchema, auth, routing]);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export function useAppContext() {
  const store = React.useContext(AppContext);
  if (!store) {
    throw new Error('useAppContext must be used within a AppContextProvider');
  }
  return store;
}
