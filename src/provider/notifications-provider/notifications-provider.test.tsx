import { act, renderHook } from '@testing-library/react';
import React from 'react';
import { useNotifications } from './notifications-provider';
import { setupStore } from '@/store';
import { Provider } from 'react-redux';

jest.useFakeTimers();

describe('Notifications provider', () => {
  test('should work with info message', () => {
    const store = setupStore();
    const wrapper = ({ children }: { children: React.ReactElement }) => (
      <Provider store={store}>{children}</Provider>
    );
    const { result } = renderHook(() => useNotifications(), { wrapper });

    // Initial state
    expect(result.current.state.error).toBe(false);
    expect(result.current.state.queue.length).toBe(0);

    act(() => {
      result.current.setMessage('Info', false);
    });

    expect(result.current.state.error).toBe(false);
    expect(result.current.state.message).toBe('Info');
    expect(result.current.state.queue.length).toBe(1);

    act(() => {
      jest.advanceTimersByTime(7000);
    });

    expect(result.current.state.error).toBe(false);
    expect(result.current.state.message).toBeUndefined();
    expect(result.current.state.queue.length).toBe(0);
  });

  test('should work with error message', () => {
    const store = setupStore();
    const wrapper = ({ children }: { children: React.ReactElement }) => (
      <Provider store={store}>{children}</Provider>
    );
    const { result } = renderHook(() => useNotifications(), { wrapper });

    // Initial state
    expect(result.current.state.error).toBe(false);
    expect(result.current.state.queue.length).toBe(0);

    act(() => {
      result.current.setMessage('Error', true);
    });

    expect(result.current.state.error).toBe(true);
    expect(result.current.state.message).toBe('Error');
    expect(result.current.state.queue.length).toBe(1);

    act(() => {
      jest.advanceTimersByTime(15000);
    });

    expect(result.current.state.error).toBe(false);
    expect(result.current.state.message).toBeUndefined();
    expect(result.current.state.queue.length).toBe(0);
  });
});
