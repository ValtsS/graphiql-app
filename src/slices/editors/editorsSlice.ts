import { RootState } from '@/store';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type EditorsState = {
  query: string;
  parameters: string;
};

const initialState: EditorsState = {
  query: 'query { }',
  parameters: '{}',
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
  },
});

export const { setQuery } = editorsSlice.actions;
export const editorsReducer = editorsSlice.reducer;
export const selectEditorsData = (state: RootState) => state.editors;
