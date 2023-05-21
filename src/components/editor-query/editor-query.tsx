import { useCertainModel } from '@/custom-hooks/useEditorModel';
import { selectEditorsData, setQuery } from '@/slices';
import { useAppDispatch } from '@/store';
import React from 'react';
import { useSelector } from 'react-redux';
import { Editor } from '../editor/editor';
import { Box } from '@mui/system';

export const EditorQueryGraphQL = ({ uuid }: { uuid: string }) => {
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
    <Box
      sx={{
        width: '100%',
        borderRadius: '8px',
      }}
    >
      <Editor
        language={'graphql'}
        model={model}
        hoverEnabled={false}
        extraClassName={'query-monaco-editor'}
      />
    </Box>
  );
};
