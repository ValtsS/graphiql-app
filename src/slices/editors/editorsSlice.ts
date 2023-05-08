import { RootState } from '@/store';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type EditorsState = {
  query: string;
  parameters: string;
  response: string;
};

const initialState: EditorsState = {
  query: 'query { }',
  parameters: '{}',
  response: ''
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
});

export const { setQuery, setParameters, setResponse } = editorsSlice.actions;
export const editorsReducer = editorsSlice.reducer;
export const selectEditorsData = (state: RootState) => state.editors;
