import { Crash } from '@/pages';
import { useAppContext } from '@/provider';
import { RouteConfig } from '@/routes';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
} from '@mui/material/styles';
import { parse, specifiedRules, validate } from 'graphql';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { validateVariables } from './core/api/api';
import { useApplySchema } from './custom-hooks/useApplySchema';
import { useFetchSchema } from './custom-hooks/useFetchSchema';
import { RootLayout } from './routes/root-layout';
import { selectEditorsData, setQueryError } from './slices';
import { useAppDispatch } from './store';

interface Props {
  routesConfig: RouteConfig[];
}

export const GraphQLApp = (props: Props) => {
  const { routesConfig } = props;
  const dispatch = useAppDispatch();
  const { currentSchema } = useAppContext();
  const editorData = useSelector(selectEditorsData);

  useFetchSchema();
  useApplySchema();

  useEffect(() => {
    if (currentSchema) {
      try {
        const document = parse(editorData.query);
        const errors = validate(currentSchema, document, specifiedRules);
        if (errors.length === 0) {
          const warnings = validateVariables(document, editorData.variables);
          dispatch(setQueryError({ error: warnings }));
        } else {
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
  }, [editorData.queryVersion, editorData.query, currentSchema, dispatch, editorData.variables]);

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
