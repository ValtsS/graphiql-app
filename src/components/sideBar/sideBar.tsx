import React from 'react';
import { Button, Grid, Typography, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface IData {
  data: { greet: string; desc: string; path: string; btn: string };
}

export const SideBar = (props: IData) => {
  const { greet, desc, path, btn } = props.data;
  return (
    <Grid item md={6} xs={12} order={{ xs: 1, md: 2 }}>
      <Box
        sx={{
          background: 'linear-gradient(to right, #009999, #007195)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '0 40px',
          height: '100%',
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          color={'white'}
          mt={5}
          mb={5}
          sx={{ fontWeight: 'bold', fontSize: { xs: '14px', sm: '2rem' } }}
        >
          {greet}
        </Typography>
        <Typography color={'white'} sx={{ fontSize: { xs: '10px', sm: '14px' } }}>
          {desc}
        </Typography>
        <Button
          variant="outlined"
          sx={{
            color: 'white',
            border: '1px solid white',
            m: '50px 0',
            fontSize: { xs: '9px', sm: '14px' },
          }}
          fullWidth
          component={RouterLink}
          to={path}
        >
          {btn}
        </Button>
      </Box>
    </Grid>
  );
};
