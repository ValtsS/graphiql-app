import { RouteConfig } from '@/routes';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Crash } from '@/pages';
import { RootLayout } from './routes/root-layout';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
} from '@mui/material/styles';

interface Props {
  routesConfig: RouteConfig[];
}

export const GraphQLApp = (props: Props) => {
  const { routesConfig } = props;
  const theme = extendTheme({
    colorSchemes: {
      light: {
        palette: {
          primary: {
            main: '#009999',
          },
        },
      },
    },
  });
  return (
    <>
      <CssVarsProvider theme={theme}>
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

            <Route path="*" element={<Crash error={new Error('Error 404')} />} />
          </Routes>
        </BrowserRouter>
      </CssVarsProvider>
    </>
  );
};
