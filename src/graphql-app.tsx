import { RouteConfig } from '@/routes';
import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Crash } from '@/pages';
import { RootLayout } from './routes/root-layout';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
} from '@mui/material/styles';
import { useAppContext } from '@/provider';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { selectMainData } from './slices/main/mainSlice';
import { useAppDispatch } from './store';
import { fetchSchema } from './slices/schema/schema';

interface Props {
  routesConfig: RouteConfig[];
}

export const GraphQLApp = (props: Props) => {
  const { routesConfig } = props;
  const dispatch = useAppDispatch();
  const { apiClient } = useAppContext();
  const mainState = useSelector(selectMainData);
  const notifyError = (message: string) => toast(message, { type: 'error' });

  useEffect(() => {
    if (mainState.endpoint.length > 0 && apiClient)
      dispatch(
        fetchSchema({
          client: apiClient,
          endpoint: mainState.endpoint,
        })
      )
        .unwrap()
        .catch((rejectedValueOrSerializedError) => {
          notifyError(rejectedValueOrSerializedError);
        });
  }, [mainState, dispatch, apiClient]);

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
