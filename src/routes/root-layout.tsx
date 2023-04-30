import { Header, Toaster } from '@/components';
import React, { ReactElement } from 'react';

interface RootLayoutProps {
  children: React.ReactNode;
}

export const RootLayout = (props: RootLayoutProps): ReactElement => {
  return (
    <>
      <Header />
      <Toaster />
      <main>{props.children}</main>
      <footer></footer>
    </>
  );
};
