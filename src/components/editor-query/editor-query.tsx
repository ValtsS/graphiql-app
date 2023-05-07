import { StoreStatus, selectEditorsData, selectSchemaData, setQuery } from '@/slices';
import { useAppDispatch } from '@/store';
import { buildASTSchema, parse } from 'graphql';
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
  const model = useMemo(() => {
    const modelCreate = getOrCreateModel(uuid, editorData.query);

    let timer: NodeJS.Timeout | null = null;

    modelCreate.onDidChangeContent(() => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        const val = modelCreate.getValue();
        dispatch(setQuery({ queryText: val }));
      }, 300);
    });

    return modelCreate;
  }, [uuid, editorData, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      if (schemaData.status == StoreStatus.succeeded) {
        const docNode = parse(schemaData.schema);
        const ast = buildASTSchema(docNode);

        const api = initializeMode();
        api.setSchemaConfig([{ schema: ast, uri: schemaData.endpoint }]);
      }
    };

    fetchData().catch((error) => {
      notifyError(error);
    });
  }, [schemaData]);

  return (
    <div>
      <div style={{ width: '100%' }}>
        <Editor language={'graphql'} model={model} />
      </div>
    </div>
  );
};
