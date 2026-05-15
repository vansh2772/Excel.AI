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

/** Safely map a Firebase user → our User type. Never throws — Firestore errors are swallowed. */
async function buildAppUser(firebaseUser: FirebaseUser, displayName?: string): Promise<User> {
  const isAdmin = ADMIN_EMAILS.includes(firebaseUser.email ?? '');
  let role: 'user' | 'admin' = isAdmin ? 'admin' : 'user';
  let createdAt = new Date();

  // Try to sync Firestore — but don't block login if it fails
  try {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      role = snap.data().role ?? role;
      createdAt = snap.data().createdAt?.toDate?.() ?? createdAt;
      // Update last login silently
      updateDoc(userRef, { lastLogin: serverTimestamp() }).catch(() => {});
    } else {
      // Create profile document
      const name = displayName || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';
      await setDoc(userRef, {
        email: firebaseUser.email ?? '',
        name,
        role,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        photoURL: firebaseUser.photoURL ?? null,
      });
    }
  } catch (err) {
    // Firestore permissions not configured yet — still allow login
    console.warn('Firestore sync skipped (check Firestore rules):', (err as Error).message);
  }

  return {
    id: firebaseUser.uid,
    email: firebaseUser.email ?? '',
    name: displayName || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
    role,
    createdAt,
    lastLogin: new Date(),
    picture: firebaseUser.photoURL ?? undefined,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const appUser = await buildAppUser(firebaseUser);
        const idToken = await firebaseUser.getIdToken().catch(() => null);
        setUser(appUser);
        setToken(idToken);
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
    const appUser = await buildAppUser(cred.user);
    setUser(appUser);
  };

  const register = async (email: string, password: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    const appUser = await buildAppUser(cred.user, name);
    setUser(appUser);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const cred = await signInWithPopup(auth, provider);
    const appUser = await buildAppUser(cred.user);
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