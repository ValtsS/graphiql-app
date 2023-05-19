import { convertIDNAEmailToASCII } from './idna';

function convertCatch(email: string): string | null {
  try {
    return convertIDNAEmailToASCII(email);
  } catch {
    return null;
  }
}

describe('Idna', () => {
  it.each([
    ['john.doe@example.com', 'john.doe@example.com'],
    ['jane_smith@example.com', 'jane_smith@example.com'],
    ['李雷@例子.广告', 'xn--7qvw47h@xn--fsqu00a.xn--4rr70v'],
    ['катя@пример.рф', 'xn--80atz6c@xn--e1afmkfd.xn--p1ai'],
    ['山田@例子.コム', 'xn--rhtu98c@xn--fsqu00a.xn--tckwe'],
    ['abc.def@2001:db8:c000:221::', 'abc.def@2001:db8:c000:221::'],
    ['Abc.def@[2001:db8:c000:221::]', 'Abc.def@[2001:db8:c000:221::]'],
    ['abc.def@X2001:db8:c000:221::', 'abc.def@X2001:db8:c000:221::'],
    ['john.doe@@example.com', null],
    ['john.doeexample.com', null],
    ['@', '@'],
  ])('Expect e-mail %s to be %s', (email: string, ascii: string | null) => {
    expect(convertCatch(email)).toBe(ascii);
  });
});
