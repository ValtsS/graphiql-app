import graphqlImg from '@/assets/graphql.gif';
import { Course } from '@/components/course/course';
import { Developers } from '@/components/developers/developers';
import useAuth from '@/custom-hooks/useAuth';
import { useAppContext } from '@/provider';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { useAppSelector } from '@/store';

export const Welcome = (): ReactElement => {
  const { currentUser } = useAuth();
  const { routing } = useAppContext();
  const { t } = useTranslation();
  const langMode = useAppSelector((state) => state.langMode.langMode);

  const signMenu =
    routing?.filter((el) => (currentUser ? el.path === '/main' : el.displayInRegistration)) ?? [];

  return (
    <Container>
      <Grid container spacing={6} mt={5}>
        <Grid
          item
          xs={12}
          md={7}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          order={{ xs: '2', md: '1' }}
        >
          <img src={graphqlImg} alt="img" style={{ width: '-webkit-fill-available' }} />
        </Grid>

        <Grid
          item
          xs={12}
          md={5}
          sx={{ gap: '50px', display: 'flex', flexDirection: 'column' }}
          order={{ xs: '1', md: '2' }}
        >
          <Grid container spacing={3}>
            {signMenu.map((page) => (
              <Grid item xs={12} md={6} key={page.uuid} sx={{ minWidth: '230px' }}>
                <Button
                  variant="contained"
                  component={RouterLink}
                  to={page.path}
                  size="large"
                  sx={{ minWidth: '229px' }}
                >
                  {page.buttonText ?? page.menuText}
                </Button>
              </Grid>
            ))}
          </Grid>
          <Typography sx={{ textAlign: 'left' }}>{t('description')}</Typography>
        </Grid>
      </Grid>
      <Developers />
      <Course />
    </Container>
  );
};
