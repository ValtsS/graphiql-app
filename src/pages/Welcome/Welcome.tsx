import { CardMedia, Container } from '@mui/material';
import React, { ReactElement } from 'react';

export const Welcome = (): ReactElement => {
  return (
    <Container>
      <CardMedia
        image={
          'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
        }
        title="Paella dish"
      />
      Welcome
    </Container>
  );
};
