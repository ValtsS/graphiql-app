import React, { useRef } from 'react';
import ReactDOM from 'react-dom';

import Editor from '@monaco-editor/react';

export const MainEditor = () => {
  function handleEditorChange(value, event) {
    console.log('here is the current model value:', value);
  }

  return (
    <Editor
      height="90vh"
      defaultLanguage="graphql"
      defaultValue="// some comment"
      onChange={handleEditorChange}
    />
  );
};
