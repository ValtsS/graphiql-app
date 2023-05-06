import React, { useRef, useState, useEffect } from 'react';
import styles from './editorsBlock.module.css';
import Resizer from '../resizer/resizer';
import { IntrospectionQuery } from 'graphql';
import { Uri, editor, KeyMod, KeyCode, languages } from 'monaco-editor';
import { initializeMode } from 'monaco-graphql/esm/initializeMode';
import { debounce } from '@/utils/debounce';
import schemaJson from './schema.json';
import customTheme from './editorTheme';

const MONACO_OPTIONS = {
  theme: 'customTheme',
  minimap: { enabled: false },
  automaticLayout: true,
  fontSize: 12,
  lineNumbersMinChars: 2,
  lineDecorationsWidth: 0,
  scrollbar: {
    vertical: 'hidden' as const,
    horizontal: 'hidden' as const,
  },
  overviewRulerBorder: false,
};

const defaultOperations = localStorage.getItem('operations') ?? ``;

const defaultVariables = localStorage.getItem('variables') ?? ``;

const getSchema = async () => schemaJson;

const getOrCreateModel = (uri: string, value: string) => {
  return (
    editor.getModel(Uri.file(uri)) ?? editor.createModel(value, uri.split('.').pop(), Uri.file(uri))
  );
};

const execOperation = async function () {
  // const variables = editor.getModel(Uri.file('variables.json'))!.getValue();
  // const operations = editor.getModel(Uri.file('operation.graphql'))!.getValue();
  // const resultsModel = editor.getModel(Uri.file('results.json'));
  // HERE request to server
};

const queryAction = {
  id: 'graphql-run',
  label: 'Run Operation',
  contextMenuOrder: 0,
  contextMenuGroupId: 'graphql',
  keybindings: [KeyMod.CtrlCmd | KeyCode.Enter],
  run: execOperation,
};

languages.json.jsonDefaults.setDiagnosticsOptions({
  allowComments: true,
  trailingCommas: 'ignore',
});

const createEditor = (
  ref: React.MutableRefObject<null>,
  options: editor.IStandaloneEditorConstructionOptions
) => editor.create(ref.current as unknown as HTMLElement, options);

const EditorsBlock = () => {
  const leftSideRef = useRef<HTMLDivElement>(null);
  const topSideRef = useRef<HTMLDivElement>(null);
  const [leftSideWidth, setleftSideWidth] = useState('60%');
  const [topSideHeight, setTopSideHeight] = useState('70%');

  const effectRan = useRef(false);
  const opsRef = React.useRef(null);
  const varsRef = React.useRef(null);
  const resultsRef = React.useRef(null);
  const [queryEditor, setQueryEditor] = React.useState<editor.IStandaloneCodeEditor | null>(null);
  const [variablesEditor, setVariablesEditor] = React.useState<editor.IStandaloneCodeEditor | null>(
    null
  );
  const [resultsViewer, setResultsViewer] = React.useState<editor.IStandaloneCodeEditor | null>(
    null
  );
  const [schema, setSchema] = React.useState<unknown | null>(null);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    editor.defineTheme('customTheme', customTheme as never);
  }, []);

  useEffect(() => {
    const queryModel = getOrCreateModel('operation.graphql', defaultOperations);
    const variablesModel = getOrCreateModel('variables.json', defaultVariables);
    const resultsModel = getOrCreateModel('results.json', '');

    const createEditors = () => {
      if (effectRan.current === false) {
        queryEditor ??
          setQueryEditor(
            createEditor(opsRef, {
              model: queryModel,
              language: 'graphql',
              ...MONACO_OPTIONS,
            })
          );
        variablesEditor ??
          setVariablesEditor(
            createEditor(varsRef, {
              model: variablesModel,
              ...MONACO_OPTIONS,
            })
          );
        resultsViewer ??
          setResultsViewer(
            createEditor(resultsRef, {
              model: resultsModel,
              readOnly: true,
              smoothScrolling: true,
              ...MONACO_OPTIONS,
            })
          );

        queryModel.onDidChangeContent(
          debounce(300, () => {
            localStorage.setItem('operations', queryModel.getValue());
          })
        );
        variablesModel.onDidChangeContent(
          debounce(300, () => {
            localStorage.setItem('variables', variablesModel.getValue());
          })
        );
      }
    };

    createEditors();

    return () => {
      effectRan.current = true;
    };
  }, [queryEditor, resultsViewer, variablesEditor]);

  useEffect(() => {
    queryEditor?.addAction(queryAction);
    variablesEditor?.addAction(queryAction);
  }, [variablesEditor, queryEditor]);

  useEffect(() => {
    const fetchData = async () => {
      if (!schema && !loading) {
        setLoading(true);

        const schema = await getSchema();

        if (!schema.data) {
          throw Error('Incorrect request. This app does not support subscriptions yet');
        }

        initializeMode({
          diagnosticSettings: {
            validateVariablesJSON: {
              [Uri.file('operation.graphql').toString()]: [Uri.file('variables.json').toString()],
            },
            jsonDiagnosticSettings: {
              validate: true,
              schemaValidation: 'error',
              allowComments: true,
              trailingCommas: 'ignore',
            },
          },
          schemas: [
            {
              introspectionJSON: schema.data as unknown as IntrospectionQuery,
              uri: 'myschema.graphql',
            },
          ],
        });

        setSchema(schema.data);
        setLoading(false);
      }
    };

    fetchData().catch(console.error);
  }, [schema, loading]);

  return (
    <div className={styles.editorsContainer}>
      <div className={styles.editors}>
        <div ref={leftSideRef} className={styles.mainEditor} style={{ width: leftSideWidth }}>
          <div ref={topSideRef} className={styles.editor} style={{ height: topSideHeight }}>
            <div data-testid="editor" ref={opsRef} className={styles.monaco} />
          </div>
          <Resizer
            changeSideRef={topSideRef}
            setSideSize={setTopSideHeight}
            axisVector={'height'}
          />
          <div className={`${styles.editor} ${styles.variable}`}>
            <div data-testid="editor" ref={varsRef} className={styles.monaco} />
          </div>
        </div>
        <Resizer changeSideRef={leftSideRef} setSideSize={setleftSideWidth} axisVector={'width'} />
        <div className={`${styles.editor} ${styles.response}`}>
          <div data-testid="editor" ref={resultsRef} className={styles.monaco} />
        </div>
      </div>
    </div>
  );
};

export default EditorsBlock;
