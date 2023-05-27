import React from 'react';
import { act, render, renderHook, screen } from '@testing-library/react';
import { ModalDialogProvider, useModalDialog } from './modal-dialog';

describe('ModalDialogProvider', () => {
  test('should render children', () => {
    render(
      <ModalDialogProvider>
        <div>Child Component</div>
      </ModalDialogProvider>
    );

    const childComponent = screen.getByText('Child Component');
    expect(childComponent).toBeInTheDocument();
  });
});

describe('useModalDialog', () => {
  test('should return context value when used within ModalDialogProvider', () => {
    const wrapper = ({ children }: { children: React.ReactElement }) => (
      <ModalDialogProvider>{children}</ModalDialogProvider>
    );
    const { result } = renderHook(() => useModalDialog(), { wrapper });

    expect(result.current.state).toEqual({ show: false });
    expect(typeof result.current.showDialog).toEqual('function');
    expect(typeof result.current.hide).toEqual('function');
  });

  test('should return context value when used within ModalDialogProvider', () => {
    const wrapper = ({ children }: { children: React.ReactElement }) => (
      <ModalDialogProvider>{children}</ModalDialogProvider>
    );
    const { result } = renderHook(() => useModalDialog(), { wrapper });

    // Initial state
    expect(result.current.state).toEqual({ show: false });

    act(() => {
      result.current.showDialog(<div>Modal Content</div>, { param1: 'value1' });
    });

    expect(result.current.state).toEqual({
      show: true,
      control: <div>Modal Content</div>,
      parameters: { param1: 'value1' },
    });

    act(() => {
      result.current.hide();
    });

    expect(result.current.state.show).toBe(false);
  });
});
