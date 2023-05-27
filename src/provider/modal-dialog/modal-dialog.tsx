import React, { ReactElement, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

export type DialogState = {
  show: boolean;
  control?: ReactNode;
  parameters?: object;
};

type DialogConextValue = {
  state: DialogState;
  showDialog: (control: ReactElement, parameters: object) => void;
  hide: () => void;
};

const initialState: DialogState = {
  show: false,
};

export const DialogContext = React.createContext<DialogConextValue>({
  state: initialState,
  showDialog: () => {},
  hide: () => {},
});

export const ModalDialogProvider = ({ children }: { children: ReactElement }) => {
  const [state, setState] = useState<DialogState>({ show: false });

  const showDialog = useCallback(
    (control: ReactNode, parameters: object) => {
      setState({ show: true, control, parameters });
    },

    [setState]
  );

  const hide = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      show: false,
    }));
  }, [setState]);

  const values: DialogConextValue = useMemo(
    () => ({
      state,
      showDialog,
      hide,
    }),
    [state, showDialog, hide]
  );

  return <DialogContext.Provider value={values}>{children}</DialogContext.Provider>;
};

export function useModalDialog() {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error('useModalDialog must be used within a ModalDialogProvider');
  }

  return context;
}
