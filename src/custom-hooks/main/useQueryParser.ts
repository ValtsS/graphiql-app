import { useAppContext } from '@/provider';
import { selectEditorsData, setQueryError } from '@/slices';
import { useAppDispatch } from '@/store';
import { parse, specifiedRules, validate } from 'graphql';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { validateVariables } from '@/core/api/api';

export const useQueryParser = () => {
  const dispatch = useAppDispatch();
  const { currentSchema } = useAppContext();
  const editorData = useSelector(selectEditorsData);

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
};
