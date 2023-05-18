import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEn from '@/../extractedTranslations/en/translation.json';
import translationRu from '@/../extractedTranslations/ru/translation.json';

const resources = {
  en: {
    translation: translationEn,
  },
  ru: {
    translation: translationRu,
  },
};

i18next.use(initReactI18next).init({
  resources,
  lng: 'en',
  returnEmptyString: false
});

export default i18next;
