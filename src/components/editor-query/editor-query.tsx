import { useCertainModel } from '@/custom-hooks/useEditorModel';
import { selectEditorsData, setQuery } from '@/slices';
import { useAppDispatch } from '@/store';
import React from 'react';
import { useSelector } from 'react-redux';
import { Editor } from '../editor/editor';
import { SxProps } from '@mui/system';

export const EditorQueryGraphQL = ({ uuid, sx }: { uuid: string; sx?: SxProps }) => {
  const dispatch = useAppDispatch();
  const editorData = useSelector(selectEditorsData);

  const model = useCertainModel({
    initialValue: editorData.query,
    uuid,
    onChange: (model) => {
      dispatch(
        setQuery({
          version: model.getVersionId(),
          text: model.getValue(),
        })
      );
    },
  });

  return (
    <Editor
      language={'graphql'}
      model={model}
      hoverEnabled={false}
      className={'query-monaco-editor'}
      sx={{ minHeight: '20vh', ...sx }}
    />
  );
};
