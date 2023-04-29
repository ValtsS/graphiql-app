import { ApiClient } from '@/core/api/api-client';
import React from 'react';

type AppContextValue = {
  apiClient: ApiClient | null;
};

export const AppContext = React.createContext<AppContextValue>({
  apiClient: null,
});

type AppContextProviderProps = {
  children: React.ReactNode;
  apiClient: ApiClient | null;
};

export const AppContextProvider = ({ children, apiClient }: AppContextProviderProps) => {
  return (
    <AppContext.Provider
      value={{
        apiClient,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext() {
  const store = React.useContext(AppContext);
  if (!store) {
    throw new Error('useAppContext must be used within a AppContextProvider');
  }
  return store;
}
