import { useAppContext } from '@/provider';
import { selectMainData, fetchSchema } from '@/slices';
import { useAppDispatch } from '@/store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export const useFetchSchema = () => {
  const dispatch = useAppDispatch();
  const { apiClient } = useAppContext();
  const mainState = useSelector(selectMainData);
  const notifyError = (message: string) => toast(message, { type: 'error' });

  useEffect(() => {
    if (mainState.endpoint.length > 0 && apiClient)
      dispatch(
        fetchSchema({
          client: apiClient,
          endpoint: mainState.endpoint,
        })
      )
        .unwrap()
        .catch((rejectedValueOrSerializedError: string) => {
          notifyError(rejectedValueOrSerializedError);
        });
  }, [mainState, dispatch, apiClient]);
};
