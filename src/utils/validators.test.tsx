import { validateEmail, validatePassword } from './validators';

describe('Valdidators', () => {
  it.each([
    ['@', false],
    ['john.doe@example.com', true],
    ['jane_smith@example.com', true],
    ['info123@example.com', true],
    ['user1234@example.com', true],
    ['test.email@example.com', true],
    ['john+doe@example.com', true],
    ['李雷@例子.广告', true],
    ['катя@пример.рф', true],
    ['山田@例子.コム', true],
    ['email@domain.com', true],
    ['firstname.lastname@domain.com', true],
    ['email@subdomain.domain.com', true],
    ['firstname+lastname@domain.com', true],
    ['email@123.123.123.123', true],
    ['email@[123.123.123.123]', true],
    ['“email”@domain.com', true],
    ['1234567890@domain.com', true],
    ['email@Domain-one.com', true],
    ['_______@domain.com', true],
    ["!#$%&'*+-/=?^_`{|}~@domain.com", true],
    ['email@domain.name', true],
    ['email@domain.co.jp', true],
    ['firstname-lastname@domain.com', true],
    ['email.-one@domain.one.com', true],
    ['plain address', false],
    ['#@%^%#$@#$@#.com', false],
    ['@domain.com', false],
    ['Joe Smith <email@domain.com>', false],
    ['email.domain.com', false],
    ['email@domain@domain.com', false],
    ['.email@domain.com', false],
    ['email.@domain.com', false],
    ['email..email@domain.com', false],
    ['email@-domain.com', false],
    ['-email@domain.com', false],
    ['.email@domain.com', false],
    ['email@111.222.333.44444', false],
    ['email@111.222.111.222.11', false],
    ['email@domain..com', false],
    ['abc#def@mail.com', true],
    ['abc.def@mail#archive.com', false],
    ['abc.def@2001:db8:c000:221::', true],
    ['Abc.def@[2001:db8:c000:221::]', true],
    ['abc.def@X2001:db8:c000:221::', false],
  ])('Expect e-mail %s to be %s', (email: string, valid: boolean) => {
    expect(validateEmail(email)).toBe(valid);
  });

  it.each([
    ['', false],
    ['Aa09!@#', false],
    ['012345%a', true],
    ['01234!ņБ', true],
    ['01234+ņБ', true],
    ['ņБņБ7,ņБ', true],
    ['abcd7$ef', true],
    ['ņБņБББ,ņБ', false],
    ['ņБņБББ6ņБ', false],
  ])('Expect password %s to be %s', (password: string, valid: boolean) => {
    expect(validatePassword(password)).toBe(valid);
  });
});
