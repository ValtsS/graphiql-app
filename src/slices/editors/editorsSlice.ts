import { sendQuery } from '@/core/api/api';
import { ApiClient } from '@/core/api/api-client';
import { RootState } from '@/store';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { StoreStatus } from '../schema/schema';

export const enum queryErrorKind {
  noError,
  variableError,
  queryError,
  unknownError,
}

export type EditorsState = {
  queryVersion: number;
  query: string;
  queryError?: string;
  queryErrorKind: queryErrorKind;

  variablesVersion: number;
  variables: string;
  response: string;
  apiStatus: StoreStatus;
};

export type queryParams = {
  client: ApiClient;
  endpoint: string;
  query: string;
  variables: string;
};

type failData = {
  error: string;
  endpoint: string;
};

export const sendQueryGQL = createAsyncThunk(
  'editors/sendQuery',
  async (params: queryParams, { rejectWithValue }) => {
    const endpoint = params.endpoint;
    try {
      const response = await sendQuery(
        params.client,
        params.endpoint,
        params.query,
        JSON.parse(params.variables)
      );
      return { response };
    } catch (error) {
      const fail: failData = {
        endpoint,
        error: (error as Error).message,
      };
      return rejectWithValue(fail);
    }
  }
);

const initialState: EditorsState = {
  query: 'query { }',
  queryVersion: -1,
  variables: '{}',
  variablesVersion: -1,
  response: '',
  apiStatus: StoreStatus.idle,
  queryErrorKind: queryErrorKind.noError,
};

export const editorsSlice = createSlice({
  name: 'editors',
  initialState: initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<{ version: number; text: string }>) => {
      if (action.payload.version > state.queryVersion) {
        state.query = action.payload.text;
        state.queryVersion = action.payload.version;
      }
    },
    setQueryError: (state, action: PayloadAction<{ error?: string; kind?: queryErrorKind }>) => {
      state.queryError = action.payload.error;
      state.queryErrorKind =
        action.payload.kind ??
        (state.queryError ? queryErrorKind.unknownError : queryErrorKind.noError);
      if (state.queryError && state.queryErrorKind == queryErrorKind.noError)
        state.queryErrorKind = queryErrorKind.unknownError;
    },

    setVariables: (state, action: PayloadAction<{ version: number; text: string }>) => {
      if (action.payload.version > state.variablesVersion) {
        state.variables = action.payload.text;
        state.variablesVersion = action.payload.version;
      }
    },
    setResponse: (state, action: PayloadAction<{ responseText: string }>) => {
      state.response = action.payload.responseText;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendQueryGQL.pending, (state) => {
        state.apiStatus = StoreStatus.loading;
      })
      .addCase(sendQueryGQL.fulfilled, (state, action) => {
        state.response = action.payload.response;
        state.apiStatus = StoreStatus.succeeded;
      })
      .addCase(sendQueryGQL.rejected, (state, action) => {
        const fail = action.payload as failData;
        state.apiStatus = StoreStatus.failed;
        state.response = fail.error;
      });
  },
});

export const { setQuery, setVariables, setResponse, setQueryError } = editorsSlice.actions;
export const editorsReducer = editorsSlice.reducer;
export const selectEditorsData = (state: RootState) => state.editors;
