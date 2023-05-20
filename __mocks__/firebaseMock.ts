import { User } from '@firebase/auth';
import { FirebaseAuth, OnAuthChange } from '../src/core/firebase/firebase';

export const MOCK_PASS_VALID = 'Password1+@';
export const MOCK_USER_BAD = 'ThisisBadUser';

export class FirebaseMock implements FirebaseAuth {
  lastUser: User | null | undefined = null;
  public currentUser: User | undefined;
  public reg = jest.fn();
  public signIn = jest.fn();
  public logOut = jest.fn();
  public upload = jest.fn();

  observers: OnAuthChange[] = [];

  registerWithEmailAndPassword(
    name: string,
    email: string,
    password: string,
    file: File | null,
    uploadResult: (error: string | null) => void
  ): Promise<string | null> {
    const error = this.reg(name, email, password, file);
    if (file) uploadResult(this.upload());
    if (!error) return this.signInWithEmailAndPassword(email, password);
    return error;
  }
  signInWithEmailAndPassword(email: string, password: string): Promise<string | null> {
    const error = this.signIn(email, password);
    if (error) {
      this.currentUser = undefined;
    } else {
      const dummy = {
        email,
        displayName: 'User',
      };
      this.currentUser = dummy as User;
    }
    this.lastUser = this.currentUser ?? null;
    this.observers.forEach((o) => o(this.currentUser ?? null));
    return error;
  }
  logout(): Promise<string | null> {
    this.currentUser = undefined;
    this.lastUser = this.currentUser ?? null;
    this.observers.forEach((o) => o(null));
    return this.logOut();
  }

  onAuthStateChange(change: OnAuthChange): void {
    this.observers.push(change);
  }
}

export function SetupFirebaseMock(loggedin: boolean): FirebaseMock {
  const auth = new FirebaseMock();

  auth.reg.mockImplementation((name: string) => {
    if (name === 'bad') return 'Bad name';
    return null;
  });

  auth.signIn.mockImplementation((email: string, password: string) => {
    if (password !== MOCK_PASS_VALID) return 'Invalid password';
    return null;
  });

  auth.logOut.mockReturnValue(null);
  auth.reg.mockImplementation((name: string) => {
    if (name === MOCK_USER_BAD) return 'Bad name';
    return null;
  });

  if (loggedin) {
    auth.lastUser = {
      displayName: 'Test User',
      uid: '01345',
    } as User;
    auth.currentUser = auth.lastUser ?? undefined;
  }

  return auth;
}
