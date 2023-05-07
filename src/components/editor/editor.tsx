import React, { useRef, useState, useEffect } from 'react';
import { editor as monacoEditor } from 'monaco-editor';
import customTheme from './editorTheme';
import styles from './editor.module.css';

interface Props {
  language: string;
}

const MONACO_OPTIONS: monacoEditor.IEditorOptions = {
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
  const [editor, setEditor] = useState<monacoEditor.IStandaloneCodeEditor | null>(null);
  const monacoEl = useRef(null);

  useEffect(() => {
    monacoEditor.defineTheme('customTheme', customTheme as never);
  }, []);

  useEffect(() => {
    if (monacoEl) {
      setEditor((editor) => {
        if (editor) return editor;
        const newEditor = monacoEditor.create(monacoEl.current!, {
          language: props.language,
          theme: 'customTheme',
          ...MONACO_OPTIONS,
        });

        return newEditor;
      });
    }

    return () => editor?.dispose();
  }, [props.language, editor]);

  return <div className={styles.Editor} ref={monacoEl}></div>;
};
