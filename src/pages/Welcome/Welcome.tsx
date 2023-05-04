import { Box, Button, CardMedia, Container } from '@mui/material';
import React, { ReactElement } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import useAuth from '@/custom-hooks/useAuth';

const reg = [
  {
    page: 'Sing in',
    link: '/auth',
  },
  {
    page: 'Sing up',
    link: '/reg',
  },
];

export const Welcome = (): ReactElement => {
  const { currentUser } = useAuth();

  return (
    <Container>
      <CardMedia
        image={
          'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
        }
        title="Paella dish"
      />
      Welcome
      <Box sx={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
        {currentUser ? (
          <Button variant="contained" component={RouterLink} to="/">
            Main page
          </Button>
        ) : (
          reg.map((page) => (
            <Button
              variant="contained"
              key={page.page}
              // sx={{ my: 2, color: 'white', display: 'block' }}
              component={RouterLink}
              to={page.link}
              size="large"
            >
              {page.page}
            </Button>
          ))
        )}
      </Box>
    </Container>
  );
};
