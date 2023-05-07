import React, { useRef, useState, useEffect } from 'react';
import { editor } from 'monaco-editor';
import customTheme from './editorTheme';
import styles from './editor.module.css';

interface Props {
  language: string;
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
          ...MONACO_OPTIONS,
        });

        return newEditor;
      });
    }

    return () => editorControl?.dispose();
  }, [props.language, editorControl]);

  return <div className={styles.Editor} ref={monacoEl}></div>;
};
