import { RootState } from '@/store';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type NotificationState = {
  message?: string;
  error: boolean;
  queue: { message: string; error: boolean }[];
};

const initialState: NotificationState = {
  message: undefined,
  error: false,
  queue: [],
};

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<{ message: string; error: boolean }>) => {
      state.queue.push({ message: action.payload.message, error: action.payload.error });
      const next = state.queue[0];
      state.message = next.message;
      state.error = next.error;
    },
    clearMessage: (state) => {
      state.queue.shift();
      const next = state.queue[0];
      state.message = next?.message;
      state.error = next?.error ?? false;
    },
  },
});

export const { clearMessage, setMessage } = notificationsSlice.actions;

export const notificationsReducer = notificationsSlice.reducer;

export const selectNotificationData = (state: RootState) => state.notifications;
