import { SideBar } from '@/components';
import { FieldName, useSingupValidation } from '@/custom-hooks/useSingupValidation';
import { useAppContext } from '@/provider';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { Box, Button, Grid, Paper, TextField, Typography } from '@mui/material';
import React, { MouseEvent, ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import style from './Registration.module.css';

export const Registration = (): ReactElement => {
  const { email, emailChange, name, nameChange, password, passwordChange, isValid } =
    useSingupValidation();
  const [file, setFile] = useState<File | null>(null);

  const { auth } = useAppContext();
  const { t } = useTranslation();

  const register = async (e: MouseEvent) => {
    e.preventDefault();
    if (!auth) throw new Error('Auth not supplied');
    try {
      const error = await auth.registerWithEmailAndPassword(
        name,
        email,
        password,
        file,
        (message) => {
          if (message) toast.error(message);
        }
      );
      if (error) {
        toast.error(error);
      } else {
        toast.success(t('Sign up succeeded'));
      }
    } catch (err) {
      toast.error(t('Something went wrong'));
    }
  };

  const data = {
    greet: t('WelcomeBack'),
    desc: t('keepConnected'),
    path: '/auth',
    btn: t('SignIn'),
  };

  return (
    <Paper className={style.paper} elevation={6} sx={{ mb: '100px' }}>
      <Grid container>
        <SideBar data={data} />

        <Grid item md={6} xs={12} order={{ xs: 2, md: 2 }}>
          <Box component="form" sx={{ p: { xs: '5px', sm: '50px' } }} aria-label={t('regform')}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 'bold', fontSize: { xs: '14px', sm: '2rem' } }}
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
              aria-label={t('reg-edit-name') as string}
              value={name}
              autoComplete="off"
              inputProps={{ 'data-testid': 'editName' }}
              error={!isValid?.has(FieldName.Name)}
              helperText={t('Name needs to be at least 3 characters')}
              onChange={(e) => e && nameChange(e.target.value)}
              sx={{
                '.MuiInputBase-input': { fontSize: '14px' },
              }}
            />
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="raised-button-file"
              multiple
              type="file"
              onChange={(e) => e && setFile((e.target.files as FileList)[0])}
            />
            <label htmlFor="raised-button-file">
              <Button component="span" variant="outlined" sx={{ fontSize: '14px' }}>
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
              autoComplete="off"
              aria-label={t('reg-edit-email') as string}
              value={email}
              inputProps={{ 'data-testid': 'editEmail' }}
              error={!isValid?.has(FieldName.Email)}
              onChange={(e) => e && emailChange(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t('Password')}
              type="password"
              id="password"
              aria-label={t('reg-edit-password') as string}
              value={password}
              helperText={t(
                'minimum 8 symbols, at least one letter, one digit, one special character'
              )}
              error={!isValid?.has(FieldName.Password)}
              inputProps={{
                'data-testid': 'editPassword',
              }}
              onChange={(e) => e && passwordChange(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, color: '#fff', fontSize: '14px' }}
              onClick={(e) => e && register(e)}
              disabled={isValid?.size !== 3}
            >
              {t('SignUp')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};
