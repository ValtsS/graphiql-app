import { RouteConfig } from '@/routes';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import React, { ReactElement } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Developers } from '@/components/developers/developers';
import graphqlImg from '@/assets/graphql.gif';
import { useTranslation } from 'react-i18next';
import { Course } from '@/components/course/course';
import { useAppContext } from '@/provider';

export const Welcome = ({ routes }: { routes: RouteConfig[] }): ReactElement => {
  const { auth } = useAppContext();
  const signMenu = routes.filter((el) => el.displayInRegistration);
  const { t } = useTranslation();

  const currentUser = auth?.getUser();

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
            {currentUser ? (
              <Button variant="contained" component={RouterLink} to="/main">
                {t('mainPage')}
              </Button>
            ) : (
              signMenu.map((page) => (
                <Button
                  variant="contained"
                  key={page.uuid}
                  component={RouterLink}
                  to={page.path}
                  size="large"
                >
                  {page.menuText}
                </Button>
              ))
            )}
          </Box>
          <Typography sx={{ textAlign: 'left' }}>{t('description')}</Typography>
        </Grid>
      </Grid>
      <Developers />
      <Course />
    </Container>
  );
};
