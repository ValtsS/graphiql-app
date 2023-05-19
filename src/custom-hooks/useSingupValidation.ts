import { validateEmail, validateName, validatePassword } from '@/utils/validators';
import { useEffect, useMemo, useState } from 'react';
import { useValidator } from './useValidator';

export const enum FieldName {
  Name,
  Email,
  Password,
}

export const useSingupValidation = () => {
  const [isValid, setValidity] = useState<Set<FieldName>>();

  const {
    isValid: isNameValid,
    val: name,
    valChange: nameChange,
  } = useValidator({ validator: validateName });
  const {
    isValid: isEmailValid,
    val: email,
    valChange: emailChange,
  } = useValidator({ validator: validateEmail });
  const {
    isValid: isPasswordValid,
    val: password,
    valChange: passwordChange,
  } = useValidator({ validator: validatePassword });

  useEffect(() => {
    const newstate = new Set<FieldName>();
    if (isNameValid) newstate.add(FieldName.Name);
    if (isEmailValid) newstate.add(FieldName.Email);
    if (isPasswordValid) newstate.add(FieldName.Password);
    setValidity(newstate);
  }, [isNameValid, isEmailValid, isPasswordValid]);

  const validator = useMemo(() => {
    return { isValid, name, nameChange, email, emailChange, password, passwordChange };
  }, [isValid, name, nameChange, email, emailChange, password, passwordChange]);

  return validator;
};
