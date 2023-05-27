import { selectEditorsData } from '@/slices';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { Editor, getOrCreateModel } from '../editor/editor';
import { SxProps } from '@mui/system';

export const EditorResponse = ({ sx }: { sx?: SxProps }) => {
  const editorData = useSelector(selectEditorsData);
  const [uuid] = useState<string>(uuidv4() + '.json');
  const model = useMemo(() => {
    const modelCreate = getOrCreateModel(uuid, editorData.response);
    modelCreate.setValue(editorData.response);
    return modelCreate;
  }, [uuid, editorData.response]);

  return (
    <Editor
      language={'json'}
      model={model}
      readOnly={true}
      hoverEnabled={true}
      className={'response-monaco-editor'}
      sx={{ minHeight: '20vh', ...sx }}
    />
  );
};
