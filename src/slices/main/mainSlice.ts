import { FALLBACK_ENDPOINT } from '@/core/consts';
import { RootState } from '@/store';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const CURRENT_ENDPOINT =  import.meta.env.VITE_DEFAULT_ENDPOINT ?? FALLBACK_ENDPOINT;

export type MainState = {
  endpoint: string;
};

const initialState: MainState = {
  endpoint: CURRENT_ENDPOINT,
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
