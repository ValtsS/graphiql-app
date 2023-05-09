import { Crash } from '@/pages';
import { useAppContext } from '@/provider';
import { RouteConfig } from '@/routes';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
} from '@mui/material/styles';
import { buildASTSchema, parse, validate } from 'graphql';
import { initializeMode } from 'monaco-graphql/esm/initializeMode';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RootLayout } from './routes/root-layout';
import {
  StoreStatus,
  fetchSchema,
  selectEditorsData,
  selectMainData,
  selectSchemaData,
  setQueryError,
} from './slices';
import { useAppDispatch } from './store';

interface Props {
  routesConfig: RouteConfig[];
}

export const GraphQLApp = (props: Props) => {
  const { routesConfig } = props;
  const dispatch = useAppDispatch();
  const { apiClient, currentSchema, updateCurrentSchema } = useAppContext();

  const mainState = useSelector(selectMainData);
  const schemaData = useSelector(selectSchemaData);
  const editorData = useSelector(selectEditorsData);
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
        .catch((rejectedValueOrSerializedError: string) => {
          notifyError(rejectedValueOrSerializedError);
        });
  }, [mainState, dispatch, apiClient]);

  useEffect(() => {
    const fetchData = async () => {
      if (schemaData.status == StoreStatus.succeeded) {
        const docNode = parse(schemaData.schema);
        const ast = buildASTSchema(docNode);
        if (updateCurrentSchema) updateCurrentSchema(ast);
        const api = initializeMode();
        api.setSchemaConfig([{ schema: ast, uri: schemaData.endpoint }]);
      }
    };

    dispatch(setQueryError({}));
    fetchData().catch((error) => {
      notifyError(error);
    });
  }, [schemaData, dispatch, updateCurrentSchema]);

  useEffect(() => {
    if (currentSchema) {
      try {
        const document = parse(editorData.query);
        const errors = validate(currentSchema, document);
        if (errors.length === 0) dispatch(setQueryError({}));
        else {
          const err = errors[0];
          if (err.locations) {
            dispatch(
              setQueryError({
                error: `${err.message} at line ${err.locations[0].line}:${err.locations[0].column}`,
              })
            );
          } else dispatch(setQueryError({ error: err.message }));
        }
      } catch (e) {
        if ((e as Error).message) dispatch(setQueryError({ error: (e as Error).message }));
        else dispatch(setQueryError({ error: 'Unknown error' }));
      }
    }
  }, [editorData.queryVersion, editorData.query, currentSchema, dispatch]);

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
