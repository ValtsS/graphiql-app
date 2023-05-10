import { useFetchSchema, useApplySchema, useQueryParser } from './main';

export const useMainLogic = () => {
  useFetchSchema();
  useApplySchema();
  useQueryParser();
};
