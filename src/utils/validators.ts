import { convertIDNAEmailToASCII } from './idna';

export function validateName(name: string): boolean {
  return name.length > 2;
}
export function validateEmail(email: string): boolean {
  const mailRegEx = new RegExp(
    "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
  );
  if (email.length >= 3) {
    try {
      const normalized = convertIDNAEmailToASCII(email);
      return mailRegEx.test(normalized);
    } catch {}
  }

  return false;
}

export function validatePassword(password: string): boolean {
  const matchLetter = /\p{L}/u;
  const matchDigit = /\d/;
  const specialChar = /[\p{P}]/u;

  return (
    password.length >= 8 &&
    matchLetter.test(password) &&
    matchDigit.test(password) &&
    specialChar.test(password)
  );
}
