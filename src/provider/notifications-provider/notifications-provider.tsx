import * as Slice from '@/slices/notifications/notificationsSlice';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export type NotificationsContextValue = {
  state: Slice.NotificationState;
  setMessage: (message: string, error: boolean) => void;
};

export function useNotifications() {
  const dispatch = useDispatch();

  const data = useSelector(Slice.selectNotificationData);

  const setMessage = useCallback(
    (message: string, error: boolean) => {
      dispatch(Slice.setMessage({ message, error }));
      setTimeout(
        () => {
          dispatch(Slice.clearMessage());
        },
        error ? 5000 : 1000
      );
    },
    [dispatch]
  );

  const value: NotificationsContextValue = useMemo(
    () => ({
      state: data,
      setMessage,
    }),
    [data, setMessage]
  );

  return value;
}
