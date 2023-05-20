import { useAppContext } from '@/provider';
import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';

const useAuth = () => {
  const { auth } = useAppContext();
  const [currentUser, setCurrentUser] = useState<User | null>(auth?.lastUser ?? null);
  const [ready, setReady] = useState<boolean>(auth?.lastUser !== undefined);

  useEffect(() => {
    if (auth) {
      auth.onAuthStateChange((user) => {
        setCurrentUser(user);
        setReady(true);
      });
    }
  }, [auth]);
  return { currentUser, ready };
};

export default useAuth;
