import { create } from 'zustand'

export interface User {
  id: string
  name: string
  email?: string
  role: 'guest' | 'student' | 'admin'
  avatar?: string
}

interface UserState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  // 登入方法：直接比對硬編碼的帳密
  login: (email: string, pass: string) => Promise<boolean>
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false, // 本地驗證不需要 Loading
  
  login: async (email, pass) => {
    // 權宜之計：硬編碼帳密
    if (email === 'admin@example.com' && pass === '123456') {
      const adminUser: User = {
        id: 'admin-001',
        name: '管理員',
        email: 'admin@example.com',
        role: 'admin'
      };
      set({ user: adminUser, isAuthenticated: true });
      return true;
    }
    return false;
  },

  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    isLoading: false 
  }),
  setLoading: (loading) => set({ isLoading: loading }),
  logout: () => set({ user: null, isAuthenticated: false }),
}))
