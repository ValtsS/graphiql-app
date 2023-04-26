import { defaultRoutes } from '@/routes';
import { setupStore } from '@/store';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { GraphQLApp } from './graphql-app';
import { ModalDialogProvider } from './provider/modal-dialog';

const store = setupStore();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App>
      <Provider store={store}>
        <ModalDialogProvider>
          <GraphQLApp routesConfig={defaultRoutes} />
        </ModalDialogProvider>
      </Provider>
    </App>
  </React.StrictMode>
);
