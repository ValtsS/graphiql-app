import { SideBar } from '@/components';
import useAuth from '@/custom-hooks/useAuth';
import { FieldName, useSingupValidation } from '@/custom-hooks/useSingupValidation';
import { useAppContext } from '@/provider';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { Box, Button, Grid, Paper, TextField, Typography } from '@mui/material';
import React, { MouseEvent, ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import style from './Registration.module.css';

export const Registration = (): ReactElement => {
  const { email, emailChange, name, nameChange, password, passwordChange, isValid } =
    useSingupValidation();
  const [file, setFile] = useState<File | null>(null);

  const { auth } = useAppContext();
  const { currentUser } = useAuth();
  const { t } = useTranslation();

  const navigate = useNavigate();
  const register = async (e: MouseEvent) => {
    e.preventDefault();
    if (!auth) throw new Error('Auth not supplied');
    try {
      const error = await auth.registerWithEmailAndPassword(name, email, password, file);
      if (error) {
        toast.error(error);
      } else {
        toast.success(t('Sign up succeeded'));
      }
    } catch (err) {
      toast.error(t('Something went wrong'));
      console.log('Firebase error', err);
    }
  };

  useEffect(() => {
    if (!auth) return;
    if (currentUser) navigate('/main');
  }, [auth, navigate, currentUser]);

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
                inputProps={{ 'data-testid': 'editName' }}
                error={!isValid?.has(FieldName.Name)}
                helperText={t('Name needs to be at least 3 characters')}
                onChange={(e) => nameChange(e.target.value)}
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
                inputProps={{ 'data-testid': 'editEmail' }}
                error={!isValid?.has(FieldName.Email)}
                onChange={(e) => emailChange(e.target.value)}
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
                helperText={t("minimum 8 symbols, at least one letter, one digit, one special character")}
                error={!isValid?.has(FieldName.Password)}
                inputProps={{
                  'data-testid': 'editPassword',
                }}
                onChange={(e) => passwordChange(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, color: '#fff' }}
                onClick={(e) => register(e)}
                disabled={isValid?.size !== 3}
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
