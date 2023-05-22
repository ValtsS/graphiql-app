import { Button, CardMedia, Container, Typography } from '@mui/material';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

export const ErrorPage = (): ReactElement => {
  const { t } = useTranslation();
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
      }}
    >
      <Typography variant="h4">404</Typography>
      <CardMedia
        component="img"
        image="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
        alt="error404"
        sx={{ width: { xs: '80%', sm: '60%', md: '40%' } }}
      />
      <Typography variant="h5" mb={5}>
        {t('lost')}
      </Typography>
      <Button variant="outlined" component={RouterLink} to={'/'}>
        {t('toMain')}
      </Button>
    </Container>
  );
};
