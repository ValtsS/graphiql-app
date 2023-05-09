import { selectEditorsData, setVariables } from '@/slices';
import { useAppDispatch } from '@/store';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Editor, getOrCreateModel } from '../editor/editor';
import { Debouncer } from '@/utils/debounce';

export const EditorVariables = ({ uuid }: { uuid: string }) => {
  const dispatch = useAppDispatch();
  const editorData = useSelector(selectEditorsData);
  const [debounce] = useState<Debouncer>(new Debouncer(300));

  const model = useMemo(() => {
    const modelCreate = getOrCreateModel(uuid, editorData.variables);

    modelCreate.onDidChangeContent(() => {
      debounce.clear();
      debounce.run(() => {
        dispatch(
          setVariables({
            version: modelCreate.getVersionId(),
            text: modelCreate.getValue(),
          })
        );
      });
    });

    return modelCreate;
  }, [uuid, editorData.variables, dispatch, debounce]);

  return (
    <div style={{ width: '100%' }}>
      <Editor language={'json'} model={model} hoverEnabled={true} />
    </div>
  );
};
