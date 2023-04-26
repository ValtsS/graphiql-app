import React, { ReactElement } from 'react';
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
  Paper,
  Box,
  TextField,
} from '@mui/material';

export const Authorization = (): ReactElement => {
  const handleSubmit = () => console.log('handleSubmit');
  const handleSignUp = () => console.log('handleSignUp');
  return (
    <>
      <Paper
        sx={{
          width: '50%',
          margin: '100px auto',
          textAlign: 'center',
          display: 'flex',
        }}
        elevation={6}
      >
        <Grid container>
          <Grid item md={6} xs={12} order={{ xs: 2, md: 1 }}>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ p: '50px' }}>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
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
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, color: '#fff' }}
              >
                Sign in
              </Button>
              {/* <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    {t('Forgot password?')}
                  </Link>
                </Grid>
                <Grid item>
                  <Link variant="body2" component={RouterLink} to="/registration">
                    {t("Don't have an account? Sign Up")}
                  </Link>
                </Grid>
              </Grid>
              <Copyright /> */}
            </Box>
          </Grid>
          <Grid item md={6} xs={12} order={{ xs: 1, md: 2 }}>
            <Box
              sx={{
                background: 'linear-gradient(to right, #FF4B2B, #FF416C)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                padding: '0 40px',
                height: '100%',
              }}
            >
              <Typography variant="h4" component="h2" color={'white'} mt={5}>
                Hello, Friend!
              </Typography>
              <Typography color={'white'}>
                Enter your personal details and start journey with us
              </Typography>
              <Button
                variant="outlined"
                sx={{ color: 'white', border: '1px solid white', m: '50px 0' }}
                fullWidth
                onClick={handleSignUp}
              >
                Sign Up
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};
