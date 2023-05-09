import { selectEditorsData, setQuery } from '@/slices';
import { useAppDispatch } from '@/store';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Editor, getOrCreateModel } from '../editor/editor';
import { Debouncer } from '@/utils/debounce';

export const EditorQueryGraphQL = ({ uuid }: { uuid: string }) => {
  const dispatch = useAppDispatch();
  const editorData = useSelector(selectEditorsData);
  const [debounce] = useState<Debouncer>(new Debouncer(300));

  const model = useMemo(() => {
    const modelCreate = getOrCreateModel(uuid, editorData.query);

    modelCreate.onDidChangeContent(() => {
      debounce.clear();
      debounce.run(() => {
        dispatch(
          setQuery({
            version: modelCreate.getVersionId(),
            text: modelCreate.getValue(),
          })
        );
      });
    });

    return modelCreate;
  }, [uuid, editorData.query, dispatch, debounce]);

  return (
    <div>
      <div style={{ width: '100%' }}>
        <Editor language={'graphql'} model={model} hoverEnabled={false} />
      </div>
    </div>
  );
};
