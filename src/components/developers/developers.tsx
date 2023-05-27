import React from 'react';
import './developers.css';
import { DEVELOPERS } from '@/utils/constants';
import { Box, Link, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const Developers = () => {
  const { t } = useTranslation();

  return (
    <Box className="developers">
      <Box className="container">
        <Typography variant="h4">{t('Developers')}</Typography>
        <Typography component="span" className="line"></Typography>
        <Box className="content">
          {DEVELOPERS.map((developer) => (
            <Paper className="card" key={developer.id}>
              <Link href={developer.link} target="_blank">
                <img src={developer.img} alt={developer.name} />
              </Link>
              <Typography>{developer.phrase}</Typography>
              <Link href={developer.link} target="_blank">
                <Typography component="span">{developer.name}</Typography>
              </Link>
            </Paper>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
