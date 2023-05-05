import React, { ReactElement, useEffect, useState, MouseEvent } from 'react';
import { Button, Grid, Typography, Paper, Box, TextField, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import style from '../Registration/Registration.module.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/core/firebase';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { toast } from 'react-toastify';
import { SideBar } from '@/components';

export const Authorization = (): ReactElement => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  const handleSignUp = async (e: MouseEvent) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Successefully logged in');
      navigate('/');
    } catch (err) {
      toast.error('something went wrong');
      console.log(err);
    }
  };

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) navigate('/');
  }, [user, loading, navigate]);

  const data = {
    greet: 'Hello, Friend!',
    desc: 'Enter your personal details',
    path: '/reg',
    btn: 'Sign Up',
  };

  return (
    <>
      <Paper elevation={6} className={style.paper}>
        <Grid container>
          <Grid item md={6} xs={12} order={{ xs: 2, md: 1 }}>
            <Box component="form" noValidate sx={{ p: '50px' }}>
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, color: '#fff' }}
                onClick={(e) => handleSignUp(e)}
              >
                Sign in
              </Button>
              <Grid container sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <Grid item>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link variant="body2" component={RouterLink} to="/reg">
                    Don&apos;t have an account? Sign Up
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <SideBar data={data} />
        </Grid>
      </Paper>
    </>
  );
};
