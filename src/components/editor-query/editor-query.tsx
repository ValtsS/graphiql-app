import { useCertainModel } from '@/custom-hooks/useEditorModel';
import { selectEditorsData, setQuery } from '@/slices';
import { useAppDispatch } from '@/store';
import React from 'react';
import { useSelector } from 'react-redux';
import { Editor } from '../editor/editor';

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
    <div>
      <div style={{ width: '100%' }}>
        <Editor language={'graphql'} model={model} hoverEnabled={false} />
      </div>
    </div>
  );
};
