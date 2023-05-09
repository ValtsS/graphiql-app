import { selectEditorsData, setQuery } from '@/slices';
import { useAppDispatch } from '@/store';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { Editor, getOrCreateModel } from '../editor/editor';

export const EditorQueryGraphQL = () => {
  const dispatch = useAppDispatch();
  const editorData = useSelector(selectEditorsData);
  const [uuid] = useState<string>(uuidv4() + '.graphql');

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
