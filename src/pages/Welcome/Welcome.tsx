import useAuth from '@/custom-hooks/useAuth';
import { RouteConfig } from '@/routes';
import { Box, Button, Container, Grid } from '@mui/material';
import React, { ReactElement } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Developers } from '@/components/developers/developers';
import { AboutApp } from '@/components/aboutApp/aboutApp';
import graphqlImg from '@/assets/graphql.gif';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store';
import { Course } from '@/components/course/course';

export const Welcome = ({ routes }: { routes: RouteConfig[] }): ReactElement => {
  const { currentUser } = useAuth();
  const signMenu = routes.filter((el) => el.displayInRegistration);
  const { t } = useTranslation();
  const langMode = useAppSelector((state) => state.langMode.langMode);

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
          <img src={graphqlImg} alt="" style={{ width: '-webkit-fill-available' }} />
        </Grid>

        <Grid item xs={12} md={4} sx={{ gap: '50px', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
            {currentUser ? (
              <Button variant="contained" component={RouterLink} to="/">
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
                  {langMode ? page.menuTextRu : page.menuText}
                </Button>
              ))
            )}
          </Box>
          <AboutApp />
        </Grid>
      </Grid>
      <Developers />
      <Course />
    </Container>
  );
};
