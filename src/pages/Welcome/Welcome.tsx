import useAuth from '@/custom-hooks/useAuth';
import { RouteConfig } from '@/routes';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import React, { ReactElement } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Developers } from '@/components/developers/developers';
import graphqlImg from '@/assets/graphql.gif';
import { useTranslation } from 'react-i18next';
import { Course } from '@/components/course/course';
import { useAppSelector } from '@/store';

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
          <img src={graphqlImg} alt="img" style={{ width: '-webkit-fill-available' }} />
        </Grid>

        <Grid item xs={12} md={4} sx={{ gap: '50px', display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              display: 'flex',
              gap: langMode ? 2 : 5,
              justifyContent: 'center',
              flexDirection: langMode ? 'column' : 'row',
            }}
          >
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
                  // sx={{
                  //   fontSize: { xs: '8px', sm: '8px', md: '14px' },
                  // }}
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
