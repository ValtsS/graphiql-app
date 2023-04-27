import { Header } from '@/components';
import { useNotifications } from '@/provider/notifications-provider';
import React, { ReactElement } from 'react';

interface RootLayoutProps {
  children: React.ReactNode;
}

export const RootLayout = (props: RootLayoutProps): ReactElement => {
  const { state: notify } = useNotifications();

  return (
    <>
      <Header />
      {notify && (
        <>
          {notify.message}
          <>{notify.error}</>
        </>
      )}
      <main >{props.children}</main>
      <footer></footer>
    </>
  );
};
