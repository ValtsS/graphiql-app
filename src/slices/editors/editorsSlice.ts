import { sendQuery } from '@/core/api/api';
import { ApiClient } from '@/core/api/api-client';
import { RootState } from '@/store';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { StoreStatus } from '../schema/schema';

export type EditorsState = {
  query: string;
  parameters: string;
  response: string;
  queryStatus: StoreStatus;
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
  parameters: '{}',
  response: '',
  queryStatus: StoreStatus.idle,
};

export const editorsSlice = createSlice({
  name: 'editors',
  initialState: initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<{ queryText: string }>) => {
      state.query = action.payload.queryText;
    },
    setParameters: (state, action: PayloadAction<{ parametersText: string }>) => {
      state.parameters = action.payload.parametersText;
    },
    setResponse: (state, action: PayloadAction<{ responseText: string }>) => {
      state.response = action.payload.responseText;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendQueryGQL.pending, (state) => {
        state.queryStatus = StoreStatus.loading;
      })
      .addCase(sendQueryGQL.fulfilled, (state, action) => {
        state.response = action.payload.response;
        state.queryStatus = StoreStatus.succeeded;
      })
      .addCase(sendQueryGQL.rejected, (state, action) => {
        const fail = action.payload as failData;
        state.queryStatus = StoreStatus.failed;
        state.response = fail.error;
      });
  },
});

export const { setQuery, setParameters, setResponse } = editorsSlice.actions;
export const editorsReducer = editorsSlice.reducer;
export const selectEditorsData = (state: RootState) => state.editors;
