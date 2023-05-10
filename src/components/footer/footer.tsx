import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import style from './Footer.module.css';
import React from 'react';

const LINK_TO_THE_COURSE = 'https://rs.school/react/';

export const develops = [
  {
    id: 1,
    name: 'Valts Silaputnins',
    link: 'https://github.com/ValtsS',
  },
  {
    id: 2,
    name: 'Evgeniy Onishchenko',
    link: 'https://github.com/evvgenchik',
  },
  {
    id: 3,
    name: 'Natalya Polyakova',
    link: 'https://github.com/Skave-a',
  },
];

export const Footer = () => {
  return (
    <Box component="footer" sx={{}} className={style.footer}>
      <Box component={Box} maxWidth="sm" className={style.dev}>
        {develops.map((develop) => (
          <Box key={develop.id}>
            <Link href={develop.link} target="_blank" rel="noreferrer" className={style.link}>
              {develop.name}
            </Link>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
        <Link className={style.rss} href={LINK_TO_THE_COURSE} target="_blank" rel="noreferrer" />
        <Typography component="span">2023</Typography>
      </Box>
    </Box>
  );
};
