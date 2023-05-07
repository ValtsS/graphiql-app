import { StoreStatus, selectSchemaData } from '@/slices';
import { buildASTSchema, parse } from 'graphql';
import { initializeMode } from 'monaco-graphql/esm/initializeMode';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Editor } from '../editor/editor';

export const EditorQueryGraphQL = () => {
  const schemaData = useSelector(selectSchemaData);
  const notifyError = (message: string) => toast(message, { type: 'error' });

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
      <div style={{ width: '100%', border: '2px solid red' }}>
        <Editor language={'graphql'} />
      </div>
    </div>
  );
};
