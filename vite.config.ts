import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import monacoEditorPlugin, { IMonacoEditorOpts } from 'vite-plugin-monaco-editor';
import path from 'path';

type hack = (options: IMonacoEditorOpts) => Plugin;
const monacoEditorPlug: hack = monacoEditorPlugin['default'];

export default defineConfig({
  plugins: [
    react(),
    monacoEditorPlug({
      languageWorkers: ['json', 'editorWorkerService'],
      customWorkers: [
        {
          label: 'graphql',
          entry: 'monaco-graphql/dist/graphql.worker',
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
