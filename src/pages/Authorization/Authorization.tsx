import React, { FormEvent, ReactElement } from 'react';
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
  Paper,
  Box,
  TextField,
  Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import style from '../Registration/Registration.module.css';

export const Authorization = (): ReactElement => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => e.preventDefault();
  const handleSignUp = () => console.log('handleSignUp');
  return (
    <>
      <Paper elevation={6} className={style.paper}>
        <Grid container>
          <Grid item md={6} xs={12} order={{ xs: 2, md: 1 }}>
            <Box component="form" noValidate onSubmit={(e) => handleSubmit(e)} sx={{ p: '50px' }}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', md: '2rem' } }}
              >
                Sign in
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label={'Email Address'}
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label={'Password'}
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label={'Remember me'}
                sx={{ display: { xs: 'none', md: 'block' } }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, color: '#fff' }}
              >
                Sign in
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2" sx={{ textDecoration: 'none' }}>
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    variant="body2"
                    component={RouterLink}
                    to="/reg"
                    sx={{ textDecoration: 'none' }}
                  >
                    Don't have an account? Sign Up
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Grid>
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
                sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', md: '2rem' } }}
              >
                Hello, Friend!
              </Typography>
              <Typography color={'white'}>
                Enter your personal details
              </Typography>
              <Link
                variant="body2"
                component={RouterLink}
                to="/reg"
                sx={{ textDecoration: 'none' }}
              >
                <Button
                  variant="outlined"
                  sx={{ color: 'white', border: '1px solid white', m: '50px 0' }}
                  fullWidth
                  onClick={handleSignUp}
                >
                  Sign Up
                </Button>
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};
