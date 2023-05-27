import { getOrCreateModel } from '@/components/editor/editor';
import { Debouncer } from '@/utils/debounce';
import { editor } from 'monaco-editor';
import { useMemo, useState } from 'react';

export interface Props {
  uuid: string;
  initialValue: string;
  onChange: (model: editor.ITextModel) => void;
}

export const useCertainModel = (props: Props) => {
  const [debounce] = useState<Debouncer>(new Debouncer(300));
  const model = useMemo(() => {
    const modelCreate = getOrCreateModel(props.uuid, props.initialValue);

    modelCreate.onDidChangeContent(() => {
      debounce.clear();
      debounce.run(() => {
        if (props.onChange) props.onChange(modelCreate);
      });
    });

    return modelCreate;
  }, [props, debounce]);

  return model;
};
