import { User } from '@firebase/auth';
import { FirebaseAuth } from '../src/core/firebase/firebase';

export class FirebaseMock implements FirebaseAuth {
  public reg = jest.fn();
  public signIn = jest.fn();
  public logOut = jest.fn();
  public user = jest.fn();

  registerWithEmailAndPassword(
    name: string,
    email: string,
    password: string,
    file: File | null
  ): Promise<string | null> {
    return this.reg(name, email, password, file);
  }
  signInWithEmailAndPassword(email: string, password: string): Promise<string | null> {
    return this.signIn(email, password);
  }
  logout(): Promise<string | null> {
    return this.logOut();
  }
  getUser(): User | undefined {
    return this.user();
  }
}
