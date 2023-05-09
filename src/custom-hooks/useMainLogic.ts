import { useApplySchema } from './main/useApplySchema';
import { useFetchSchema } from './main/useFetchSchema';
import { useQueryParser } from './main/useQueryParser';

export const useMainLogic = () => {
  useFetchSchema();
  useApplySchema();
  useQueryParser();
};
