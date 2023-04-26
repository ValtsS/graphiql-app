import { RouteConfig } from '@/routes';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ErrorPage } from '@/pages';
import { RootLayout } from './routes/root-layout';

interface Props {
  routesConfig: RouteConfig[];
}

export const GraphQLApp = (props: Props) => {
  const { routesConfig } = props;

  return (
    <>
      <BrowserRouter>
        <Routes>
          {routesConfig.map((c, index) => (
            <Route
              path={c.path}
              element={
                <RootLayout key={'rootlayout_ca_' + index.toString()}>{c.element}</RootLayout>
              }
              key={'route_ca_' + index.toString()}
            />
          ))}

          <Route path="*" element={<ErrorPage error={new Error('Error 404')} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};
