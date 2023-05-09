import useAuth from '@/custom-hooks/useAuth';
import { RouteConfig } from '@/routes';
import { Box, Button, Container } from '@mui/material';
import React, { ReactElement } from 'react';
import { Link as RouterLink } from 'react-router-dom';

export const Welcome = ({ routes }: { routes: RouteConfig[] }): ReactElement => {
  const { currentUser } = useAuth();
  const signMenu = routes.filter((el) => el.displayInRegistration);

  return (
    <Container>
      Welcome
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
    </Container>
  );
};
