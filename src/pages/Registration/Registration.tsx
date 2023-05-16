import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { Box, Button, Grid, Paper, TextField, Typography } from '@mui/material';
import React, { MouseEvent, ReactElement, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './Registration.module.css';

import { SideBar } from '@/components';
import { useAppContext } from '@/provider';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import useAuth from '@/custom-hooks/useAuth';

export const Registration = (): ReactElement => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  const { auth } = useAppContext();
  const { currentUser } = useAuth();

  const navigate = useNavigate();
  const register = async (e: MouseEvent) => {
    e.preventDefault();
    if (!auth) throw new Error('Auth not supplied');
    try {
      const error = await auth.registerWithEmailAndPassword(name, email, password, file);
      if (error) {
        toast.error(error);
      } else {
        toast.success('Sign up');
      }
    } catch (err) {
      toast.error('Something went wrong');
      console.log(err);
    }
  };

  useEffect(() => {
    if (!auth) return;
    if (currentUser) navigate('/main');
  }, [auth, navigate, currentUser]);

  const { t } = useTranslation();

  const data = {
    greet: t('WelcomeBack'),
    desc: t('keepConnected'),
    path: '/auth',
    btn: t('SignIn'),
  };

  return (
    <>
      <Paper className={style.paper} elevation={6}>
        <Grid container>
          <SideBar data={data} />

          <Grid item md={6} xs={12} order={{ xs: 2, md: 2 }}>
            <Box component="form" sx={{ p: '50px' }} aria-label="form">
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', md: '2rem' } }}
              >
                {t('Create')}
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                id="userName"
                label={t('Name')}
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
                  {t('Upload')}
                  <CloudUploadOutlinedIcon />
                </Button>
              </label>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label={t('Email')}
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
                label={t('Password')}
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
                {t('SignUp')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};
