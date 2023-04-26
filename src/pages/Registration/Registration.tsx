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

export const Registration = (): ReactElement => {
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
                Welcome Back!
              </Typography>
              <Typography color={'white'}>
                To keep connected with us please login with your personal info
              </Typography>
              <Button
                variant="outlined"
                sx={{ color: 'white', border: '1px solid white', m: '50px 0' }}
                fullWidth
                onClick={handleSignUp}
              >
                Sign In
              </Button>
            </Box>
          </Grid>

          <Grid item md={6} xs={12} order={{ xs: 1, md: 2 }}>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ p: '50px' }}>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Create Account
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
        </Grid>
      </Paper>
    </>
  );
};

{
  /* <form action="#">
            <h1>Create Account</h1>
            <div className="social-container">
              <a href="#" className="social">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social">
                <i className="fab fa-google-plus-g"></i>
              </a>
              <a href="#" className="social">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <span>or use your email for registration</span>
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button>Sign Up</button>
          </form> */
}
