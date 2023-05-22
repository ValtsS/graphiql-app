import { Button, Container, Typography } from '@mui/material';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

export const ErrorPage = (): ReactElement => {
  const { t } = useTranslation();
  return (
    <>
      <Container>
        <Typography variant="h4">404</Typography>
        <img
          src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
          alt="error"
          style={{ width: '40%' }}
        />
        <Typography variant="h5">{t('lost')}</Typography>
        <Typography variant="h6">{t('notAvaible')}</Typography>
        <Button
          variant="outlined"
          sx={{ color: 'white', border: '1px solid white', m: '50px 0' }}
          fullWidth
          component={RouterLink}
          to={'/'}
        >
          {t('toMain')}
        </Button>
      </Container>
    </>
  );
};
