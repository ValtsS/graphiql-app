import React, { useEffect } from 'react';
import Editor from '@monaco-editor/react';
import * as monacoType from 'monaco-editor';
import { customTheme } from './editorTheme';
import { loader } from '@monaco-editor/react';
import autocomplete from './showAutocompletion';

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

  function handleEditorWillMount(monaco) {
    autocomplete(monaco, {
      query: {
        character: { id: '' },
        characters: {
          page: '',
          filter: '',
        },
        locations: {
          page: '',
          filter: '',
        },
        locationsByIds: {
          ids: '',
        },
        episode: {
          id: '',
        },
        episodes: {},
      },
      mutation: {},
      subscription: {},
    });
  }

  function handleEditorMount(editor) {
    editor.onDidFocusEditorText(() => {
      if (editor.getValue() === '') {
        editor.trigger('', 'editor.action.triggerSuggest', {});
      }
    });
  }

  return (
    <Editor
      height="100%"
      width="100%"
      theme="myTheme"
      options={{
        minimap: { enabled: false },
        automaticLayout: true,
      }}
      defaultLanguage="graphql"
      defaultValue=""
      onChange={handleEditorChange}
      beforeMount={handleEditorWillMount}
      onMount={handleEditorMount}
    />
  );
};
