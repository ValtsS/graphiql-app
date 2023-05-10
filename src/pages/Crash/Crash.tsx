import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface ErrorPageProps {
  error: Error | null;
}

export const unkErrorText = 'Unknown error';

export const Crash = (props: ErrorPageProps): ReactElement => {
  const { t } = useTranslation();

  return (
    <>
      <div>
        <h1>Oops! Something went wrong.</h1>
        <p>{props.error?.message || unkErrorText}</p>
        <Link to="/">{t('GoBack')}</Link>
      </div>
    </>
  );
};
