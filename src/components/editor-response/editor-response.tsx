import { selectEditorsData } from '@/slices';
import { useAppDispatch } from '@/store';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { Editor, getOrCreateModel } from '../editor/editor';

export const EditorResponse = () => {
  const dispatch = useAppDispatch();

  const editorData = useSelector(selectEditorsData);

  const [uuid] = useState<string>(uuidv4() + '.json');
  const model = useMemo(() => {
    const modelCreate = getOrCreateModel(uuid, editorData.query);
    modelCreate.setValue(editorData.response);
    return modelCreate;
  }, [uuid, editorData, dispatch]);

  return (
    <div>
      <div style={{ width: '100%' }}>
        <Editor language={'json'} model={model} />
      </div>
    </div>
  );
};
