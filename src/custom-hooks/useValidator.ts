import { useState, useMemo } from 'react';

export type ValidatorCallback = (value: string) => boolean;

export const useValidator = ({ validator }: { validator: ValidatorCallback }) => {
  const [isValid, setValidity] = useState<boolean>();
  const [val, setVal] = useState<string>('');

  const valChange = (name: string) => {
    setVal(name);
    setValidity(validator(name));
  };

  const rval = useMemo(() => {
    return [isValid, val, valChange];
  }, [isValid, valChange, val]);

  return rval;
};
