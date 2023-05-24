import { DEVELOPERS, LINK_TO_THE_COURSE } from '@/utils/constants';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import style from './Footer.module.css';

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <Box component="footer" sx={{ p: 2 }} className={style.footer}>
      <Box component={Box} maxWidth="sm" className={style.dev}>
        {DEVELOPERS.map((develop) => (
          <Box key={develop.id}>
            <Link
              href={develop.link}
              target="_blank"
              rel="noreferrer"
              className={style.link}
              sx={{ fontSize: { xs: '14px', sm: '16px' } }}
            >
              {develop.name}
            </Link>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
        <Link
          className={style.rss}
          href={LINK_TO_THE_COURSE}
          target="_blank"
          rel="noreferrer"
          aria-label={t('Logo') as string}
        />
        <Typography component="span">2023</Typography>
      </Box>
    </Box>
  );
};
