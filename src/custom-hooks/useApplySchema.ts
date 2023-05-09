import { VARIABLE_EDITOR_UUID, QUERY_EDITOR_UUID } from '@/core/consts';
import { useAppContext } from '@/provider';
import { selectSchemaData, setQueryError, StoreStatus } from '@/slices';
import { useAppDispatch } from '@/store';
import { buildASTSchema, parse } from 'graphql';
import { Uri } from 'monaco-editor';
import { initializeMode } from 'monaco-graphql/esm/initializeMode';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export const useApplySchema = () => {
  const dispatch = useAppDispatch();
  const schemaData = useSelector(selectSchemaData);
  const { updateCurrentSchema } = useAppContext();
  const notifyError = (message: string) => toast(message, { type: 'error' });

  useEffect(() => {
    const fetchData = async () => {
      {
        const docNode = parse(schemaData.schema);
        const ast = buildASTSchema(docNode);
        if (updateCurrentSchema) updateCurrentSchema(ast);

        const jsonSchema = Uri.file(VARIABLE_EDITOR_UUID).toString();

        const api = initializeMode({
          diagnosticSettings: {
            validateVariablesJSON: {
              [Uri.file(QUERY_EDITOR_UUID).toString()]: [jsonSchema],
            },
            jsonDiagnosticSettings: {
              validate: true,
              schemaValidation: 'error',
              allowComments: true,
              trailingCommas: 'ignore',
              schemas: [
                {
                  uri: jsonSchema,
                },
              ],
            },
          },
        });

        api.setSchemaConfig([{ schema: ast, uri: schemaData.endpoint }]);
      }
    };

    dispatch(setQueryError({}));
    if (schemaData.status == StoreStatus.succeeded) {
      fetchData().catch((error) => {
        notifyError(error);
      });
    }
  }, [schemaData, dispatch, updateCurrentSchema]);
};
