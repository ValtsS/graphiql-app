import { selectEditorsData, setVariables } from '@/slices';
import { useAppDispatch } from '@/store';
import React from 'react';
import { useSelector } from 'react-redux';
import { Editor } from '../editor/editor';
import { useCertainModel } from '@/custom-hooks/useEditorModel';
import { SxProps } from '@mui/system';

export const EditorVariables = ({ uuid, sx }: { uuid: string; sx?: SxProps }) => {
  const dispatch = useAppDispatch();
  const editorData = useSelector(selectEditorsData);
  const model = useCertainModel({
    initialValue: editorData.variables,
    uuid,
    onChange: (model) => {
      dispatch(
        setVariables({
          version: model.getVersionId(),
          text: model.getValue(),
        })
      );
    },
  });

  return (
    <Editor
      language={'json'}
      model={model}
      hoverEnabled={true}
      className={'variables-monaco-editor'}
      sx={{ minHeight: '20vh', ...sx }}
    />
  );
};
