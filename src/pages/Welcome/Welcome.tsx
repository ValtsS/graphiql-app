import graphqlImg from '@/assets/graphql.gif';
import { Course } from '@/components/course/course';
import { Developers } from '@/components/developers/developers';
import useAuth from '@/custom-hooks/useAuth';
import { useAppContext } from '@/provider';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

export const Welcome = (): ReactElement => {
  const { currentUser } = useAuth();
  const { routing } = useAppContext();
  const { t } = useTranslation();

  const signMenu =
    routing?.filter((el) => (currentUser ? el.path === '/main' : el.displayInRegistration)) ?? [];

  return (
    <Container>
      <Grid container spacing={8} mt={5}>
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img src={graphqlImg} alt="img" style={{ width: '-webkit-fill-available' }} />
        </Grid>

        <Grid item xs={12} md={4} sx={{ gap: '50px', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
            {signMenu.map((page) => (
              <Button
                variant="contained"
                key={page.uuid}
                component={RouterLink}
                to={page.path}
                size="large"
              >
                {page.menuText}
              </Button>
            ))}
          </Box>
          <Typography sx={{ textAlign: 'left' }}>{t('description')}</Typography>
        </Grid>
      </Grid>
      <Developers />
      <Course />
    </Container>
  );
};
