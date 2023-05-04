import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { toast } from 'react-toastify';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAqXNxgNCBXB6EOojJMMmH7AN_87bCyrjU',
  authDomain: 'clone-graphql.firebaseapp.com',
  projectId: 'clone-graphql',
  storageBucket: 'clone-graphql.appspot.com',
  messagingSenderId: '367178595862',
  appId: '1:367178595862:web:c93fdfa0e0e97793e3bf37',
  measurementId: 'G-WGP8LWNH1L',
};

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
          // update user profile
          await updateProfile(user, {
            displayName: name,
            photoURL: downloadURL,
          });

          // store user data im firistore
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
    });
};

export { app, auth, db, storage, registerWithEmailAndPassword, logout };
