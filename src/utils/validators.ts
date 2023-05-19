import { convertIDNAEmailToASCII, splitEmail } from './idna';
import { Address4, Address6 } from 'ip-address';

export function validateName(name: string): boolean {
  return name.length > 2;
}

function isIP(ip: string): number {
  try {
    if (Address4.isValid(ip)) return 4;

    if (Address6.isValid(ip)) return 6;
  } catch {}

  return 0;
}

function isHostValid(hostname: string): boolean {
  if (isIP(hostname) > 0) return true;

  if (/^\[.+\]$/.test(hostname) && isIP(hostname.substring(1, hostname.length - 1)) > 0)
    return true;

  if (hostname.includes(':')) return isIP(hostname) >= 6;

  if (!/^[a-zA-Z0-9-.]{1,253}$/.test(hostname)) return false;

  const mightBeIpV4 = hostname.split('.').some((label: string) => /^\d+$/.test(label));
  if (mightBeIpV4) return isIP(hostname) > 0;

  return hostname.split('.').every((label: string) => {
    if (!/^([a-zA-Z0-9-]{1,63})$/.test(label)) return false;
    if (label.startsWith('-') || label.endsWith('-')) return false;
    return true;
  });
}

function isLocalValid(local: string): boolean {
  if (local.startsWith('-')) {
    return false;
  }

  return local.split('.').every((part: string) => /^[!#+'*A-Z\d=?^-~-/$%&]+$/.test(part));
}

export function validateEmail(email: string): boolean {
  if (email.length >= 3) {
    try {
      const normalized = convertIDNAEmailToASCII(email);
      const { localPart, domainPart } = splitEmail(normalized);
      return isLocalValid(localPart) && isHostValid(domainPart);
    } catch {}
  }

  return false;
}

export function validatePassword(password: string): boolean {
  const matchLetter = /\p{L}/u;
  const matchDigit = /\d/;
  const specialChar = /[^\p{L}\d]/u;

  return (
    password.length >= 8 &&
    matchLetter.test(password) &&
    matchDigit.test(password) &&
    specialChar.test(password)
  );
}
