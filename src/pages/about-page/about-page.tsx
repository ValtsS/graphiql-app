import { useNotifications } from '@/provider/notifications-provider';
import React, { useEffect } from 'react';

export const AboutPage = () => {
  const { setMessage } = useNotifications();

  useEffect(() => {
    setMessage('Test notification message', false);
  }, [setMessage]);

  return <>About page</>;
};
