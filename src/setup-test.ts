import '@testing-library/jest-dom';
import dotenv from 'dotenv';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

i18next.use(initReactI18next).init({
  resources: {},
  lng: 'dev',
  returnEmptyString: false,
});

dotenv.config({ path: '.env' });
