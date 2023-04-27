import React, { FormEvent, ReactElement } from 'react';
import { Button, Grid, Typography, Paper, Box, TextField, Link } from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { Link as RouterLink } from 'react-router-dom';
import style from './Registration.module.css';

export const Registration = (): ReactElement => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => e.preventDefault();
  // const handleSubmit = (e: FormEvent<HTMLFormElement>) => console.log('handleSignUp');
  const handleSignUp = () => console.log('handleSignUp');
  return (
    <>
      <Paper className={style.paper} elevation={6}>
        <Grid container>
          <Grid item md={6} xs={12} order={{ xs: 1, md: 1 }}>
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
                Welcome Back!
              </Typography>
              <Typography color={'white'}>
                To keep connected with us please login with your personal info
              </Typography>
              <Link
                variant="body2"
                component={RouterLink}
                to="/auth"
                sx={{ textDecoration: 'none' }}
              >
                <Button
                  variant="outlined"
                  sx={{ color: 'white', border: '1px solid white', m: '50px 0' }}
                  fullWidth
                  onClick={handleSignUp}
                >
                  Sign In
                </Button>
              </Link>
            </Box>
          </Grid>

          <Grid item md={6} xs={12} order={{ xs: 2, md: 2 }}>
            <Box component="form" onSubmit={(e) => handleSubmit(e)} sx={{ p: '50px' }} aria-label="form">
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', md: '2rem' } }}
              >
                Create Account
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                id="userName"
                label={'Name'}
                name="userName"
                aria-label="textbox-name"
              />
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="raised-button-file"
                multiple
                type="file"
              />
              <label htmlFor="raised-button-file">
                <Button component="span" variant="outlined">
                  Upload your avatar&nbsp;&nbsp;<CloudUploadOutlinedIcon />
                </Button>
              </label>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label={'Email Address'}
                name="email"
                aria-label="textbox-email"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label={'Password'}
                type="password"
                id="password"
                aria-label="textbox-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, color: '#fff' }}
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
