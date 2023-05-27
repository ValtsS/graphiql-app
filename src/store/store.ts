import { editorsReducer, mainReducer, schemaReducer } from '@/slices';
import { PreloadedState, combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { switchReducer } from '../slices/lang/langSlice';

const rootReducer = combineReducers({
  main: mainReducer,
  schema: schemaReducer,
  langMode: switchReducer,
  editors: editorsReducer,
});

export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
