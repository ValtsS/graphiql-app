import { Crash } from '@/pages';
import { RouteConfig } from '@/routes';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
} from '@mui/material/styles';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useApplySchema } from './custom-hooks/useApplySchema';
import { useFetchSchema } from './custom-hooks/useFetchSchema';
import { useQueryParser } from './custom-hooks/useQueryParser';
import { RootLayout } from './routes/root-layout';

interface Props {
  routesConfig: RouteConfig[];
}

export const GraphQLApp = (props: Props) => {
  const { routesConfig } = props;

  useFetchSchema();
  useApplySchema();
  useQueryParser();

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
            {routesConfig.map((c) => (
              <Route
                path={c.path}
                element={<RootLayout key={c.uuid}>{c.element}</RootLayout>}
                key={c.uuid}
              />
            ))}

            <Route path="*" element={<Crash error={new Error('Error 404')} />} />
          </Routes>
        </BrowserRouter>
      </CssVarsProvider>
    </>
  );
};
