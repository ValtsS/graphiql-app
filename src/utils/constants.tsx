import user1 from '@/assets/developers/11734687.jpg';
import user2 from '@/assets/developers/106548359.jpg';
import user3 from '@/assets/developers/101521194.jpg';
import { Translation } from 'react-i18next';
import React from 'react';

export const LINK_TO_THE_COURSE = 'https://rs.school/react/';

interface IDEVELOPERS {
  id: number;
  name: string;
  link: string;
  img: string;
  phrase: React.ReactNode;
}

export const DEVELOPERS: IDEVELOPERS[] = [
  {
    id: 1,
    name: 'Valts Silaputnins',
    link: 'https://github.com/ValtsS',
    img: user1,
    phrase: <Translation>{(t) => t('Valts')}</Translation>,
  },
  {
    id: 2,
    name: 'Evgeniy Onishchenko',
    link: 'https://github.com/evvgenchik',
    img: user2,
    phrase: <Translation>{(t) => t('Evgeniy')}</Translation>,
  },
  {
    id: 3,
    name: 'Natalya Polyakova',
    link: 'https://github.com/Skave-a',
    img: user3,
    phrase: <Translation>{(t) => t('Natalya')}</Translation>,
  },
];
