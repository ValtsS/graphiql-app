import { selectEditorsData } from '@/slices';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { Editor, getOrCreateModel } from '../editor/editor';

export const EditorResponse = () => {
  const editorData = useSelector(selectEditorsData);
  const [uuid] = useState<string>(uuidv4() + '.json');
  const model = useMemo(() => {
    const modelCreate = getOrCreateModel(uuid, editorData.response);
    modelCreate.setValue(editorData.response);
    return modelCreate;
  }, [uuid, editorData.response]);

  return (
    <div style={{ width: '100%' }}>
      <Editor language={'json'} model={model} readOnly={true} hoverEnabled={true} />
    </div>
  );
};
