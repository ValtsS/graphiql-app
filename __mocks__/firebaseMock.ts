import { User } from '@firebase/auth';
import { FirebaseAuth, OnAuthChange } from '../src/core/firebase/firebase';

export class FirebaseMock implements FirebaseAuth {
  lastUser: User | null = null;
  public currentUser: User | undefined;
  public reg = jest.fn();
  public signIn = jest.fn();
  public logOut = jest.fn();

  observers: OnAuthChange[] = [];

  registerWithEmailAndPassword(
    name: string,
    email: string,
    password: string,
    file: File | null
  ): Promise<string | null> {
    const error = this.reg(name, email, password, file);
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
