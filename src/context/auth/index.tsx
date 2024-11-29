import { useContext, createContext, useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "../../firebase";

interface GoogleAuthContextProps {
  user: User | null;
  googleSignIn: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<GoogleAuthContextProps>({
  googleSignIn: async () => {},
  logOut: async () => {},
  user: null,
});

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logOut = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ googleSignIn, logOut, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const UserAuth = () => {
  return useContext(AuthContext);
};
