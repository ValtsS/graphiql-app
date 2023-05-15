import { PluginOption, defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import monacoEditorPlugin, { IMonacoEditorOpts } from 'vite-plugin-monaco-editor';
import path from 'path';

type hack = (options: IMonacoEditorOpts) => PluginOption;
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
  build: {
    minify: 'esbuild',
    chunkSizeWarningLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('@firebase') || id.includes('firebase')) {
              return 'vendor_firebase';
            } else if (id.includes('monaco-editor') || id.includes('monaco-graphql')) {
              return 'vendor_monaco';
            } else if (id.includes('@mui')) {
              return 'vendor_mui';
            }
            return 'vendor';
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
