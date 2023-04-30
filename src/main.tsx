import { defaultRoutes } from '@/routes';
import { setupStore } from '@/store';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { GraphQLApp } from './graphql-app';
import { ModalDialogProvider } from './provider/modal-dialog';
import { DefaultApiClient } from './core/api/api-client';
import { AppContextProvider } from './provider/app-context-provider/app-context-provider';

const store = setupStore();
const client = new DefaultApiClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App>
      <AppContextProvider apiClient={client}>
        <Provider store={store}>
          <ModalDialogProvider>
            <GraphQLApp routesConfig={defaultRoutes} />
          </ModalDialogProvider>
        </Provider>
      </AppContextProvider>
    </App>
  </React.StrictMode>
);
