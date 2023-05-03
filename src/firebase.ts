import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
// import { getAnalytics } from 'firebase/analytics';
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
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// const signInWithGoogle = async () => {
//   try {
//     const res = await signInWithPopup(auth, googleProvider);
//     const user = res.user;
//     const q = query(collection(db, 'users'), where('uid', '==', user.uid));
//     const docs = await getDocs(q);
//     if (docs.docs.length === 0) {
//       await addDoc(collection(db, 'users'), {
//         uid: user.uid,
//         name: user.displayName,
//         authProvider: 'google',
//         email: user.email,
//       });
//     }
//   } catch (err) {
//     console.error(err);
//     // alert(err.message);
//   }
// };

const logInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err: Error | unknown) {
    console.error(err);
    // alert(err.message);
  }
};
// const navigate = useNavigate();

const registerWithEmailAndPassword = async (
  name: string,
  email: string,
  password: string,
  file: File | null
) => {
  console.log(name, email, password);

  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    // await addDoc(collection(db, 'users'), {
    //   uid: user.uid,
    //   name,
    //   authProvider: 'local',
    //   email,
    // });
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
    // console.error(err);
    // alert(err.message);
  }
};

// function that will send a password reset link to an email address
const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert('Password reset link sent!');
  } catch (err) {
    console.error(err);
    // alert(err.message);
  }
};

// const logout = () => {
//   signOut(auth);
// };

const logout = () => {
  signOut(auth)
    .then(() => {
      toast.success('Logged out');
      // navigate('/');
    })
    .catch((err) => {
      toast.error(err.message);
    });
};

export {
  app,
  auth,
  db,
  storage,
  // signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};
