import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';

interface ErrorPageProps {
  error: Error | null;
}

export const unkErrorText = 'Unknown error';

export const ErrorPage = (props: ErrorPageProps): ReactElement => {
  return (
    <>
      <div>
        <h1>Oops! Something went wrong.</h1>
        <p>{props.error?.message || unkErrorText}</p>
        <Link to="/">Go back to the main page</Link>
      </div>
    </>
  );
};
