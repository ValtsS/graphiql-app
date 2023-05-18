import { convertIDNAEmailToASCII, splitEmail } from './idna';
import { isIP } from 'net';

export function validateName(name: string): boolean {
  return name.length > 2;
}

function isHostValid(hostname: string): boolean {
  if (isIP(hostname) > 0) return true;

  if (/^\[.+\]$/.test(hostname) && isIP(hostname.substring(1, hostname.length - 1)) > 0)
    return true;

  if (!/^[a-zA-Z0-9-.]{1,253}$/.test(hostname)) return false;

  const mightBeIpV4 = hostname.split('.').some((label: string) => /^\d+$/.test(label));
  if (mightBeIpV4) return isIP(hostname) > 0;

  if (hostname.includes(':')) return isIP(hostname) >= 6;

  return hostname.split('.').every((label: string) => {
    if (!/^([a-zA-Z0-9-]{1,63})$/.test(label)) return false;
    if (label.startsWith('-') || label.endsWith('-')) return false;
    return true;
  });
}

export function validateEmail(email: string): boolean {
  const RE_local =
    /^(?!-)([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+9=?A-Z^-~-]+)*|"(!#-[^-~ \t]|(\[\t -~]))+")$/;

  if (email.length >= 3) {
    try {
      const normalized = convertIDNAEmailToASCII(email);
      const { localPart, domainPart } = splitEmail(normalized);

      return RE_local.test(localPart) && isHostValid(domainPart);
    } catch {}
  }

  return false;
}

export function validatePassword(password: string): boolean {
  const matchLetter = /\p{L}/u;
  const matchDigit = /\d/;
  const specialChar = /\p{P}/u;

  return (
    password.length >= 8 &&
    matchLetter.test(password) &&
    matchDigit.test(password) &&
    specialChar.test(password)
  );
}
