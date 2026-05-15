import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { User, AuthState } from '../types';

const ADMIN_EMAILS = ['vansh6dec@gmail.com'];

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function syncUserToFirestore(firebaseUser: FirebaseUser, name?: string): Promise<User> {
  const userRef = doc(db, 'users', firebaseUser.uid);
  const userSnap = await getDoc(userRef);
  const isAdmin = ADMIN_EMAILS.includes(firebaseUser.email || '');
  const role: 'user' | 'admin' = isAdmin ? 'admin' : (userSnap.exists() ? userSnap.data().role || 'user' : 'user');

  if (!userSnap.exists()) {
    const data = {
      email: firebaseUser.email || '',
      name: name || firebaseUser.displayName || (firebaseUser.email?.split('@')[0] ?? 'User'),
      role,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      photoURL: firebaseUser.photoURL || null,
    };
    await setDoc(userRef, data);
  } else {
    await updateDoc(userRef, { lastLogin: serverTimestamp() });
  }

  const snap = await getDoc(userRef);
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: snap.data()?.name || firebaseUser.displayName || 'User',
    role: snap.data()?.role || role,
    createdAt: snap.data()?.createdAt?.toDate?.() || new Date(),
    lastLogin: new Date(),
    picture: firebaseUser.photoURL || undefined,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const appUser = await syncUserToFirestore(firebaseUser);
          const idToken = await firebaseUser.getIdToken();
          setUser(appUser);
          setToken(idToken);
        } catch (e) {
          console.error('Auth state sync error:', e);
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const appUser = await syncUserToFirestore(cred.user);
    setUser(appUser);
  };

  const register = async (email: string, password: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    const appUser = await syncUserToFirestore(cred.user, name);
    setUser(appUser);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const appUser = await syncUserToFirestore(cred.user);
    setUser(appUser);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      isAuthenticated: !!user,
      login, register, loginWithGoogle, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};