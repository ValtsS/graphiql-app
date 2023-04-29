import { RootState } from '@/store';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const DEFAULT_ENDPOINT = 'http://lyra.velns.org:8000/graphql/';

export type MainState = {
  endpoint: string;
};

const initialState: MainState = {
  endpoint: DEFAULT_ENDPOINT,
};

export const mainSlice = createSlice({
  name: 'main',
  initialState: initialState,
  reducers: {
    changeEndpoint: (state, action: PayloadAction<{ endpoint: string }>) => {
      state.endpoint = action.payload.endpoint;
    },
  },
});

export const { changeEndpoint } = mainSlice.actions;
export const mainReducer = mainSlice.reducer;
export const selectMainData = (state: RootState) => state.main;
