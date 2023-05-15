import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Translation } from 'react-i18next';

interface ErrorPageProps {
  error: Error | null;
}

export const unkErrorText = <Translation>{(t) => t('UnknownError')}</Translation>;

export const Crash = (props: ErrorPageProps): ReactElement => {
  const { t } = useTranslation();

  return (
    <>
      <div>
        <h1>{t('Oops')}</h1>
        <p>{props.error?.message || unkErrorText}</p>
        <Link to="/">{t('GoBack')}</Link>
      </div>
    </>
  );
};
