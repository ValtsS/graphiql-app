import { getremoteSchema } from '@/core/api/api';
import { ApiClient } from '@/core/api/api-client';
import { RootState } from '@/store';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export type fetchParams = {
  client: ApiClient;
  endpoint: string;
};

type failData = {
  error: string;
  endpoint: string;
};

export const fetchSchema = createAsyncThunk(
  'schema/fetch',
  async (params: fetchParams, { rejectWithValue }) => {
    const endpoint = params.endpoint;
    try {
      const schema = await getremoteSchema(params.client, endpoint);
      return { schema, endpoint };
    } catch (error) {
      const fail: failData = {
        endpoint,
        error: (error as Error).message,
      };
      return rejectWithValue(fail);
    }
  }
);

export const enum StoreStatus {
  idle = 'idle',
  loading = 'loading',
  failed = 'failed',
  succeeded = 'succeeded',
}

export interface SchemaStore {
  status: StoreStatus;
  schema: string;
  error?: string;
  errorcounter: number;
  endpoint: string;
}

const initialState: SchemaStore = {
  errorcounter: 0,
  schema: '',
  status: StoreStatus.idle,
  endpoint: '',
};

export const schemaSlice = createSlice({
  name: 'schema',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchema.pending, (state) => {
        state.status = StoreStatus.loading;
      })
      .addCase(fetchSchema.fulfilled, (state, action) => {
        state.endpoint = action.payload.endpoint;
        state.status = StoreStatus.succeeded;
        state.schema = action.payload.schema;
        state.error = undefined;
        state.errorcounter = 0;
      })
      .addCase(fetchSchema.rejected, (state, action) => {
        const fail = action.payload as failData;
        state.endpoint = fail.endpoint;
        state.status = StoreStatus.failed;
        state.error = fail.error;
        state.errorcounter++;
      });
  },
});

export const { reducer: schemaReducer } = schemaSlice;
export const selectSchemaData = (state: RootState) => state.schema;
