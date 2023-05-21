import { Footer, Header, Toaster } from '@/components';
import { useAppContext } from '@/provider';
import { useModalDialog } from '@/provider/modal-dialog';
import { Box, Modal, SxProps } from '@mui/material';
import React, { ReactElement } from 'react';

interface RootLayoutProps {
  children: React.ReactNode;
}
const style: SxProps = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '80%', sm: '400px', md: '400px' },
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
} as const;

export const RootLayout = (props: RootLayoutProps): ReactElement => {
  const { state, hide } = useModalDialog();
  const { routing } = useAppContext();

  return (
    <>
      <Header routesConfig={routing ?? []} />
      <Modal
        open={state.show}
        onClose={hide}
        aria-labelledby="Change endpoint"
        aria-describedby="Change GraphQL Endpoint"
      >
        <Box sx={style}>{state.control}</Box>
      </Modal>
      <Toaster />

      <main>{props.children}</main>
      <Footer />
    </>
  );
};
