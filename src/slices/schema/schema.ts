import { getremoteSchema } from '@/core/api/api';
import { ApiClient } from '@/core/api/api-client';
import { RootState } from '@/store';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export type fetchParams = {
  client: ApiClient;
  endpoint: string;
};

export const fetchSchema = createAsyncThunk(
  'schema/fetch',
  async (params: fetchParams, { rejectWithValue }) => {
    try {
      const schema = await getremoteSchema(params.client, params.endpoint);
      return { schema };
    } catch (error) {
      return rejectWithValue((error as Error).message);
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
}

const initialState: SchemaStore = {
  errorcounter: 0,
  schema: '',
  status: StoreStatus.idle,
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
        state.status = StoreStatus.succeeded;
        state.schema = action.payload.schema;
        state.error = undefined;
        state.errorcounter = 0;
      })
      .addCase(fetchSchema.rejected, (state, action) => {
        state.status = StoreStatus.failed;
        state.error = action.payload as string;
        state.errorcounter++;
      });
  },
});

export const { reducer: schemaReducer } = schemaSlice;
export const selectSchemaData = (state: RootState) => state.schema;
