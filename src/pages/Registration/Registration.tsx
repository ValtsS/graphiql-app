import React, { MouseEvent, ReactElement, useEffect, useState } from 'react';
import { Button, Grid, Typography, Paper, Box, TextField } from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { Link as RouterLink } from 'react-router-dom';
import style from './Registration.module.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth, registerWithEmailAndPassword } from '@/firebase';
import { toast } from 'react-toastify';

export const Registration = (): ReactElement => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const register = async (e: MouseEvent) => {
    e.preventDefault();
    try {
      await registerWithEmailAndPassword(name, email, password, file);
      toast.success('Sign up');
    } catch {
      toast.error('Something went wrong');
    }
  };
  useEffect(() => {
    if (loading) return;
    if (user) navigate('/', { replace: true });
    console.log('userReg', user);
  }, [user, loading, navigate]);
  console.log('user', user);
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
              <Button
                variant="outlined"
                sx={{ color: 'white', border: '1px solid white', m: '50px 0' }}
                fullWidth
                component={RouterLink}
                to={'/auth'}
              >
                Sign In
              </Button>
            </Box>
          </Grid>

          <Grid item md={6} xs={12} order={{ xs: 2, md: 2 }}>
            <Box component="form" sx={{ p: '50px' }} aria-label="form">
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
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="raised-button-file"
                multiple
                type="file"
                onChange={(e) => setFile((e.target.files as FileList)[0])}
              />
              <label htmlFor="raised-button-file">
                <Button component="span" variant="outlined">
                  Upload your avatar&nbsp;&nbsp;
                  <CloudUploadOutlinedIcon />
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                inputProps={{
                  pattern: '(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}',
                }}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, color: '#fff' }}
                onClick={(e) => register(e)}
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
