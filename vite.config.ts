import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    (monacoEditorPlugin as any).default({
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
