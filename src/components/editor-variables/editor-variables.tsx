import { selectEditorsData, setVariables } from '@/slices';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { Editor, getOrCreateModel } from '../editor/editor';

export const EditorVariables = () => {
  const editorData = useSelector(selectEditorsData);
  const [uuid] = useState<string>(uuidv4() + '.json');
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
  }, [uuid, editorData.variables]);

  return (
    <div style={{ width: '100%' }}>
      <Editor language={'json'} model={model} />
    </div>
  );
};
function dispatch(arg0: any) {
  throw new Error('Function not implemented.');
}
