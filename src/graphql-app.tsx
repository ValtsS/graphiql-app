import { Crash } from '@/pages/Crash';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
} from '@mui/material/styles';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RootLayout } from './routes/root-layout';
import { useAppContext } from './provider';

const customTheme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#007f7f',
        },
      },
    },
  },
});

export const GraphQLApp = () => {
  const { routing } = useAppContext();

  return (
    <>
      <CssVarsProvider theme={customTheme}>
        <BrowserRouter>
          <Routes>
            {routing &&
              routing.map((c) => (
                <Route
                  path={c.path}
                  element={<RootLayout key={c.uuid}>{c.element()}</RootLayout>}
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
