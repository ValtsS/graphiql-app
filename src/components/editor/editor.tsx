import React, { useRef, useEffect } from 'react';
import { Uri, editor } from 'monaco-editor';
import customTheme from './editorTheme';
import './editor.css';
import { Box, SxProps } from '@mui/system';

export const enum EditorEventType {
  willMount,
  Mounted,
}

export type EditorEvent = (
  editor: editor.IStandaloneCodeEditor | null,
  event: EditorEventType
) => void;

interface Props {
  language: string;
  model?: editor.ITextModel;
  readOnly?: boolean;
  hoverEnabled: boolean;
  onEvent?: EditorEvent;
  className?: string;
  sx?: SxProps;
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
  const monacoEl = useRef(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    editor.defineTheme('customTheme', customTheme as never);
  }, []);

  const initOnce = () => {
    if (monacoEl.current && editorRef.current === null) {
      if (props.onEvent) props.onEvent(editorRef.current, EditorEventType.willMount);
      editorRef.current = editor.create(monacoEl.current, {
        language: props.language,
        theme: 'customTheme',
        model: props.model,
        ...MONACO_OPTIONS,
        readOnly: props.readOnly,
        ...(props.className ? { extraEditorClassName: props.className } : {}),
        hover: {
          enabled: props.hoverEnabled,
        },
      });
      if (props.onEvent) props.onEvent(editorRef.current, EditorEventType.Mounted);
    }
  };
  useEffect(() => {
    initOnce();
  });

  useEffect(() => {
    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) editor.setModelLanguage(model, props.language);
    }
  }, [props.language]);

  useEffect(() => {
    if (editorRef.current && props.model) {
      editorRef.current.setModel(props.model);
    }
  }, [props.model]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        readOnly: props.readOnly,
        hover: {
          enabled: props.hoverEnabled,
        },
        ...(props.className ? { extraEditorClassName: props.className } : {}),
      });
    }
  }, [props.hoverEnabled, props.readOnly, props.className]);

  return (
    <Box
      ref={monacoEl}
      className={props.className}
      sx={{
        boxShadow: ' 0px 5px 10px 2px rgba(34, 60, 80, 0.2)',
        textAlign: 'left',
        ...props.sx,
      }}
    />
  );
};

export function getOrCreateModel(uri: string, value: string): editor.ITextModel {
  return (
    editor.getModel(Uri.file(uri)) ?? editor.createModel(value, uri.split('.').pop(), Uri.file(uri))
  );
}
