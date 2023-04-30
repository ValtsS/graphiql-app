import React, { useEffect } from 'react';
import Editor from '@monaco-editor/react';
import * as monacoType from 'monaco-editor';
import { customTheme } from './editorTheme';
import { loader } from '@monaco-editor/react';

export const CustomEditor = () => {
  useEffect(() => {
    loader.init().then((monaco) => monaco.editor.defineTheme('myTheme', customTheme as never));
  }, []);

  function handleEditorChange(
    value: string | undefined,
    event: monacoType.editor.IModelContentChangedEvent
  ) {
    console.log('here is the current model value:', value);
  }

  return (
    <Editor
      height="100%"
      width="100%"
      theme="myTheme"
      options={{ minimap: { enabled: false }, automaticLayout: true }}
      defaultLanguage="graphql"
      defaultValue="// some comment"
      onChange={handleEditorChange}
    />
  );
};
