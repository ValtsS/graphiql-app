import { useNotifications } from '@/provider/notifications-provider';
import React, { useEffect } from 'react';
import { MainEditor } from '@/components/editor';

export const GraphqlPage = () => {
  const { setMessage } = useNotifications();

  useEffect(() => {
    setMessage('Test notification message', false);
  }, [setMessage]);

  return (
    <>
      <MainEditor />
    </>
  );
};
