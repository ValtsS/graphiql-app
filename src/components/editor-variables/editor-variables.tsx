import { selectEditorsData, setVariables } from '@/slices';
import { useAppDispatch } from '@/store';
import React from 'react';
import { useSelector } from 'react-redux';
import { Editor } from '../editor/editor';
import { useCertainModel } from '@/custom-hooks/useEditorModel';

export const EditorVariables = ({ uuid }: { uuid: string }) => {
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
    <div style={{ width: '100%' }}>
      <Editor
        language={'json'}
        model={model}
        hoverEnabled={true}
        extraClassName={'variables-monaco-editor'}
      />
    </div>
  );
};
