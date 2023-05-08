import React, { useRef, useState, useEffect } from 'react';
import { Uri, editor } from 'monaco-editor';
import customTheme from './editorTheme';
import styles from './editor.module.css';

interface Props {
  language: string;
  model?: editor.ITextModel;
  readOnly?: boolean;
}

const MONACO_OPTIONS: editor.IEditorOptions = {
  minimap: { enabled: false },
  automaticLayout: true,
  fontSize: 14,
  lineNumbersMinChars: 2,
  lineDecorationsWidth: 0,
  scrollbar: {
    vertical: 'visible' as const,
    horizontal: 'hidden' as const,
  },
  overviewRulerBorder: false,
};

export const Editor = (props: Props) => {
  const [editorControl, setEditorControl] = useState<editor.IStandaloneCodeEditor | null>(null);
  const monacoEl = useRef(null);

  useEffect(() => {
    editor.defineTheme('customTheme', customTheme as never);
  }, []);

  useEffect(() => {
    if (monacoEl) {
      setEditorControl((editorControl) => {
        if (editorControl) return editorControl;
        const newEditor = editor.create(monacoEl.current!, {
          language: props.language,
          theme: 'customTheme',
          model: props.model,
          ...MONACO_OPTIONS,
          readOnly: props.readOnly,
        });

        return newEditor;
      });
    }

    return () => editorControl?.dispose();
  }, [props.language, props.model, props.readOnly, editorControl]);

  return <div className={styles.Editor} ref={monacoEl}></div>;
};

export function getOrCreateModel(uri: string, value: string): editor.ITextModel {
  return (
    editor.getModel(Uri.file(uri)) ?? editor.createModel(value, uri.split('.').pop(), Uri.file(uri))
  );
}
