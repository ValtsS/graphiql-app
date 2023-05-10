import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { ref, uploadBytesResumable, getDownloadURL, getStorage } from 'firebase/storage';

const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const registerWithEmailAndPassword = async (
  name: string,
  email: string,
  password: string,
  file: File | null
) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    const storageRef = ref(storage, `images/${Date.now() + name}`);
    const uploadTask = uploadBytesResumable(storageRef, file as File);
    uploadTask.on(
      'state_changed',
      () => {},
      (error: Error) => {
        toast.error(error.message);
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
        });
      }
    );
    toast.success('Account created');
  } catch (err) {
    toast.error('something went wrong');
  }
};

const logout = () => {
  signOut(auth)
    .then(() => {
      toast.success('Logged out');
    })
    .catch((err) => {
      toast.error(err.message);
      console.log(err);
    });
};

export { app, auth, db, storage, registerWithEmailAndPassword, logout };
