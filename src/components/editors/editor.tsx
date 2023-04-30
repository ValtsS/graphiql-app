import React from 'react';
import Editor from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

export const CustomEditor = () => {
  function handleEditorChange(
    value: string | undefined,
    event: monaco.editor.IModelContentChangedEvent
  ) {
    console.log('here is the current model value:', value);
  }

  return (
    <Editor
      height="100%"
      width="100%"
      theme="vs-dark"
      defaultLanguage="graphql"
      defaultValue="// some comment"
      onChange={handleEditorChange}
    />
  );
};
