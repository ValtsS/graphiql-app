import { useAppContext } from '@/provider';
import { selectEditorsData, setQuery, setQueryError } from '@/slices';
import { useAppDispatch } from '@/store';
import { parse, validate } from 'graphql';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { Editor, getOrCreateModel } from '../editor/editor';

export const EditorQueryGraphQL = () => {
  const dispatch = useAppDispatch();
  const editorData = useSelector(selectEditorsData);
  const [uuid] = useState<string>(uuidv4() + '.graphql');
  const { currentSchema } = useAppContext();

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

  const model = useMemo(() => {
    const modelCreate = getOrCreateModel(uuid, editorData.query);
    let timer: NodeJS.Timeout | null = null;

    modelCreate.onDidChangeContent(() => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        dispatch(
          setQuery({
            version: modelCreate.getVersionId(),
            text: modelCreate.getValue(),
          })
        );
      }, 300);
    });

    return modelCreate;
  }, [uuid, editorData, dispatch]);

  return (
    <div>
      <div style={{ width: '100%' }}>
        <Editor language={'graphql'} model={model} />
      </div>
    </div>
  );
};
