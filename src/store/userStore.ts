import { create } from 'zustand'
import { auth, db } from '../lib/firebase'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

export interface User {
  id: string
  name: string
  email?: string
  role: 'guest' | 'editor' | 'admin'
  avatar?: string
}

interface UserState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, pass: string) => Promise<boolean>
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
  initialize: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  initialize: () => {
    if (!auth || !db) {
      set({ isLoading: false });
      return;
    }
    
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.email.replace(/\./g, '_')));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            set({ 
              user: {
                id: firebaseUser.uid,
                name: userData.name || firebaseUser.displayName || '管理員',
                email: firebaseUser.email,
                role: userData.role as any
              },
              isAuthenticated: true,
              isLoading: false
            });
            return;
          }
        } catch (e) {
          console.error("Auth initialization error:", e);
        }
      }
      set({ user: null, isAuthenticated: false, isLoading: false });
    });
  },

  login: async (email, pass) => {
    // 預留開發者後門 (admin@example.com / 123456)
    if (email === 'admin@example.com' && pass === '123456') {
      const devAdmin: User = {
        id: 'dev-001',
        name: '開發管理員',
        email: 'admin@example.com',
        role: 'admin'
      };
      set({ user: devAdmin, isAuthenticated: true });
      return true;
    }

    if (!auth || !db) return false;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const firebaseUser = userCredential.user;
      
      // 登入後必須檢查是否在 Firestore 的授權名單中
      const userDoc = await getDoc(doc(db, 'users', email.replace(/\./g, '_')));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        set({ 
          user: {
            id: firebaseUser.uid,
            name: userData.name || '管理員',
            email: email,
            role: userData.role as any
          },
          isAuthenticated: true 
        });
        return true;
      } else {
        // 不在名單中，強制登出
        await signOut(auth);
        return false;
      }
    } catch (error) {
      console.error("Firebase Login Error:", error);
      return false;
    }
  },

  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    isLoading: false 
  }),
  setLoading: (loading) => set({ isLoading: loading }),
  logout: async () => {
    if (auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.error("Logout error:", e);
      }
    }
    set({ user: null, isAuthenticated: false });
  },
}))
