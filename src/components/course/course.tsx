import { Grid, Link, Typography } from '@mui/material';
import React from 'react';
import { LINK_TO_THE_COURSE } from '../../utils/constants';
import { useTranslation } from 'react-i18next';

export const Course = () => {
  const { t } = useTranslation();

  return (
    <Grid container mb={20}>
      <Grid item xs={12} md={6}>
        <img
          src="https://rs.school/images/rs_school_js.svg"
          alt="rss"
          style={{ maxWidth: '400px' }}
        />
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        sx={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}
      >
        <Typography variant="h4" sx={{ background: '#faea68', p: '10px' }}>
          {t('React')}
        </Typography>
        <Typography>{t('free')}</Typography>
        <Link
          href={LINK_TO_THE_COURSE}
          sx={{ background: '#000', color: '#fff', p: '10px' }}
          target="_blank"
        >
          {t('Enroll')}
        </Link>
      </Grid>
    </Grid>
  );
};
