import { useAppContext } from '@/provider';
import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';

const useAuth = () => {
  const { auth } = useAppContext();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (auth) {
      auth.onAuthStateChange((user) => {
        setCurrentUser(user);
      });
    }
  }, [auth]);
  return { currentUser };
};

export default useAuth;
