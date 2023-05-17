import React, { ReactElement, useEffect, useState, MouseEvent } from 'react';
import { Button, Grid, Typography, Paper, Box, TextField, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import style from '../Registration/Registration.module.css';
import { toast } from 'react-toastify';
import { SideBar } from '@/components';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '@/provider';
import useAuth from '@/custom-hooks/useAuth';

export const Authorization = (): ReactElement => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { auth } = useAppContext();
  const { currentUser } = useAuth();

  const handleSignUp = async (e: MouseEvent) => {
    e.preventDefault();
    try {
      if (!auth) throw new Error('Missing auth');

      const error = await auth.signInWithEmailAndPassword(email, password);
      if (error) {
        toast.error(error);
      } else {
        toast.success('Successefully logged in');
        navigate('/main');
      }
    } catch (err) {
      toast.error('something went wrong');
      console.log(err);
    }
  };

  useEffect(() => {
    if (!auth) return;
    if (currentUser) navigate('/main');
  }, [auth, navigate, currentUser]);

  const { t } = useTranslation();

  const data = {
    greet: t('Hello'),
    desc: t('personal'),
    path: '/reg',
    btn: t('SignUp'),
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
                {t('SignIn')}
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label={t('Email')}
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                inputProps={{ 'data-testid': 'editEmail' }}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label={t('Password')}
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                inputProps={{ 'data-testid': 'editPassword' }}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, color: '#fff' }}
                onClick={(e) => handleSignUp(e)}
              >
                {t('SignIn')}
              </Button>
              <Grid container sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <Grid item>
                  <Link variant="body2" component={RouterLink} to="/reg">
                    {t(`Don'tHave`)}
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
