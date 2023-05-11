import useAuth from '@/custom-hooks/useAuth';
import { RouteConfig } from '@/routes';
import { Box, Button, Container, Grid } from '@mui/material';
import React, { ReactElement } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Developers } from '@/components/developers/developers';
import { AboutApp } from '@/components/aboutApp/aboutApp';
import graphqlImg from '@/assets/graphql.gif';

export const Welcome = ({ routes }: { routes: RouteConfig[] }): ReactElement => {
  const { currentUser } = useAuth();
  const signMenu = routes.filter((el) => el.displayInRegistration);

  return (
    <Container>
      <Grid container spacing={5} mt={5}>
        <Grid
          item
          xs={12}
          md={4}
          sx={{ gap: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
        >
          {/* Welcome */}
          <AboutApp />
          <Box sx={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
            {currentUser ? (
              <Button variant="contained" component={RouterLink} to="/">
                Main page
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
        </Grid>
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
      </Grid>

      <Developers />
    </Container>
  );
};
