import { Box, Button, Container } from '@mui/material';
import React, { ReactElement } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import useAuth from '@/custom-hooks/useAuth';
import { defaultRoutes } from '@/routes';

export const Welcome = (): ReactElement => {
  const { currentUser } = useAuth();
  const signMenu = defaultRoutes.slice(2, 4);
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
