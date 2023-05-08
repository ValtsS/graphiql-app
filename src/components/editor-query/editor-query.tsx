import {
  StoreStatus,
  selectEditorsData,
  selectSchemaData,
  setQuery,
  setQueryError,
} from '@/slices';
import { useAppDispatch } from '@/store';
import { GraphQLSchema, buildASTSchema, parse, validate } from 'graphql';
import { initializeMode } from 'monaco-graphql/esm/initializeMode';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { Editor, getOrCreateModel } from '../editor/editor';

export const EditorQueryGraphQL = () => {
  const dispatch = useAppDispatch();
  const schemaData = useSelector(selectSchemaData);
  const editorData = useSelector(selectEditorsData);
  const notifyError = (message: string) => toast(message, { type: 'error' });
  const [uuid] = useState<string>(uuidv4() + '.graphql');

  const [gqlSchema, setGqlSchema] = useState<GraphQLSchema | null>(null);

  useEffect(() => {
    if (gqlSchema) {
      try {
        const document = parse(editorData.query);
        const errors = validate(gqlSchema, document);
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
  }, [editorData.queryVersion, editorData.query, gqlSchema, dispatch]);

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

  useEffect(() => {
    const fetchData = async () => {
      if (schemaData.status == StoreStatus.succeeded) {
        const docNode = parse(schemaData.schema);
        const ast = buildASTSchema(docNode);
        setGqlSchema(ast);
        const api = initializeMode();
        api.setSchemaConfig([{ schema: ast, uri: schemaData.endpoint }]);
      }
    };

    dispatch(setQueryError({}));
    fetchData().catch((error) => {
      notifyError(error);
    });
  }, [schemaData, dispatch]);

  return (
    <div>
      <div style={{ width: '100%' }}>
        <Editor language={'graphql'} model={model} />
      </div>
    </div>
  );
};
