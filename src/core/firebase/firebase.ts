import { FirebaseApp } from '@firebase/app';
import {
  User,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@firebase/auth';
import { doc, getFirestore, setDoc } from '@firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from '@firebase/storage';

export type OnAuthChange = (user: User | null) => void;

export interface FirebaseAuth {
  lastUser: User | null | undefined;

  registerWithEmailAndPassword(
    name: string,
    email: string,
    password: string,
    file: File | null,
    uploadResult: (error: string | null) => void
  ): Promise<string | null>;

  signInWithEmailAndPassword(email: string, password: string): Promise<string | null>;

  logout(): Promise<string | null>;

  onAuthStateChange(change: OnAuthChange): void;
}

export class FirebaseAuthReal implements FirebaseAuth {
  private app: FirebaseApp;
  lastUser: User | null | undefined;

  constructor(app: FirebaseApp) {
    this.app = app;
    this.lastUser = undefined;
  }

  onAuthStateChange(change: OnAuthChange): void {
    const auth = getAuth(this.app);
    onAuthStateChanged(auth, (user) => {
      this.lastUser = user;
      change(user);
    });
  }

  async registerWithEmailAndPassword(
    name: string,
    email: string,
    password: string,
    file: File | null,
    uploadResult: (error: string | null) => void
  ): Promise<string | null> {
    try {
      const auth = getAuth(this.app);
      const storage = getStorage(this.app);
      const db = getFirestore(this.app);
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      const storageRef = ref(storage, `images/${Date.now() + name}`);
      const uploadTask = uploadBytesResumable(storageRef, file as File);
      uploadTask.on(
        'state_changed',
        () => {},
        (error: Error) => {
          uploadResult(error.message);
          return error.message;
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(user, {
              displayName: name,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, 'users', user.uid), {
              uid: user.uid,
              displayName: name,
              email,
              photoURL: downloadURL,
            });
            uploadResult(null);
          });
        }
      );
      return null;
    } catch (err) {
      if ((err as Error).message) return (err as Error).message;
      return 'Unknown error during register';
    }
  }
  async signInWithEmailAndPassword(email: string, password: string): Promise<string | null> {
    try {
      const auth = getAuth(this.app);
      await signInWithEmailAndPassword(auth, email, password);
      return null;
    } catch (err) {
      if ((err as Error).message) return (err as Error).message;
      return 'Unknown error during sign-in';
    }
  }
  async logout(): Promise<string | null> {
    const auth = getAuth(this.app);

    try {
      await signOut(auth);
      return null;
    } catch (err) {
      if ((err as Error).message) return (err as Error).message;
      return 'Unknown error during logout';
    }
  }
}
