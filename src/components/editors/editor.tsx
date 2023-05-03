import React, { useEffect } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import * as monacoType from 'monaco-editor';
import customTheme from './editorTheme';

export const CustomEditor = () => {
  useEffect(() => {
    loader.init().then((monaco) => {
      monaco.editor.defineTheme('myTheme', customTheme as never);
    });
  }, []);

  function handleEditorChange(
    value: string | undefined,
    event: monacoType.editor.IModelContentChangedEvent
  ) {
    //console.log('here is the current model value:', value);
  }

  return (
    <Editor
      height="100%"
      width="100%"
      theme="myTheme"
      options={{
        minimap: { enabled: false },
        automaticLayout: true,
        fontSize: 12,
      }}
      defaultLanguage="graphql"
      defaultValue=""
      onChange={handleEditorChange}
    />
  );
};
