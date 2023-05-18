import { toASCII } from 'punycode';

export function splitEmail(email: string) {
  const atIndex = email.indexOf('@');
  if (atIndex === -1) {
    throw new Error('Invalid email address');
  }

  if (atIndex !== email.lastIndexOf('@')) {
    throw new Error('Invalid email address');
  }

  const localPart = email.slice(0, atIndex);
  const domainPart = email.slice(atIndex + 1);
  return { localPart, domainPart };
}

export function convertIDNAEmailToASCII(email: string): string {
  const { localPart, domainPart } = splitEmail(email);

  const asciiLocalPart = toASCII(localPart);
  const asciiDomainPart = toASCII(domainPart);

  return `${asciiLocalPart}@${asciiDomainPart}`;
}
