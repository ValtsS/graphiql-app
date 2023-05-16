import * as React from 'react';
import { styled } from '@mui/material/styles';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { useDispatch } from 'react-redux';
import { switchMode } from '@/slices';
import i18next from 'i18next';
import { useAppSelector } from '@/store';
import { FormControlLabel, Stack, Typography } from '@mui/material';

const LangSwitch = styled((props: SwitchProps) => {
  const { className } = props;
  const dispatch = useDispatch();
  const langMode = useAppSelector((state) => state.langMode.langMode);

  const toggle = () => {
    dispatch(switchMode());
    i18next.changeLanguage(langMode ? 'en' : 'ru');
  };

  return (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      className={className}
      onChange={toggle}
      checked={!langMode}
    />
  );
})(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#007395',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: '#007395',
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#007395',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

export const SwitchMode = () => {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography className="lang">RU</Typography>
      <FormControlLabel control={<LangSwitch sx={{ m: 1 }} defaultChecked />} label="" />
      <Typography className="lang">EN</Typography>
    </Stack>
  );
};
