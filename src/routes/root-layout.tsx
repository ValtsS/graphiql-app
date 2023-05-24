import { Footer, Header, Toaster } from '@/components';
import { useAppContext } from '@/provider';
import { useModalDialog } from '@/provider/modal-dialog';
import { Box, Modal, SxProps } from '@mui/material';
import { t } from 'i18next';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <>
      <Header routesConfig={routing ?? []} />
      <Modal
        open={state.show}
        onClose={hide}
        aria-labelledby={t('Change endpoint') as string}
        aria-describedby={t('Change GraphQL Endpoint') as string}
      >
        <Box sx={style}>{state.control}</Box>
      </Modal>
      <Toaster />

      <main>{props.children}</main>
      <Footer />
    </>
  );
};
