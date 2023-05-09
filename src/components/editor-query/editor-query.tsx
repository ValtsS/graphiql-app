import { selectEditorsData, setQuery } from '@/slices';
import { useAppDispatch } from '@/store';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Editor, getOrCreateModel } from '../editor/editor';

export const EditorQueryGraphQL = ({ uuid }: { uuid: string }) => {
  const dispatch = useAppDispatch();
  const editorData = useSelector(selectEditorsData);

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
            source: uuid,
          })
        );
      }, 300);
    });

    return modelCreate;
  }, [uuid, editorData.query, dispatch]);

  return (
    <div>
      <div style={{ width: '100%' }}>
        <Editor language={'graphql'} model={model} hoverEnabled={false} />
      </div>
    </div>
  );
};
