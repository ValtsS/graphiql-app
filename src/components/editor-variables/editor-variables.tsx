import { selectEditorsData, setVariables } from '@/slices';
import { useAppDispatch } from '@/store';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Editor, getOrCreateModel } from '../editor/editor';

export const EditorVariables = ({ uuid }: { uuid: string }) => {
  const dispatch = useAppDispatch();
  const editorData = useSelector(selectEditorsData);
  const model = useMemo(() => {
    const modelCreate = getOrCreateModel(uuid, editorData.variables);

    let timer: NodeJS.Timeout | null = null;

    modelCreate.onDidChangeContent(() => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        dispatch(
          setVariables({
            version: modelCreate.getVersionId(),
            text: modelCreate.getValue(),
          })
        );
      }, 300);
    });

    return modelCreate;
  }, [uuid, editorData.variables, dispatch]);

  return (
    <div style={{ width: '100%' }}>
      <Editor language={'json'} model={model} hoverEnabled={true} />
    </div>
  );
};
