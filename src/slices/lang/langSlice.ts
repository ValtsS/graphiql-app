import { createSlice } from '@reduxjs/toolkit';

export interface ILangMode {
  langMode: boolean;
}

export const initialState: ILangMode = {
  langMode: false,
};

export const langSlice = createSlice({
  name: 'langMode',
  initialState,
  reducers: {
    switchMode: (state) => {
      state.langMode = !state.langMode;
    },
  },
});

export const { switchMode } = langSlice.actions;

export const switchReducer = langSlice.reducer;
