import { create } from 'zustand'

interface UserState {
  user: {
    id: string
    name: string
    role: 'guest' | 'student' | 'admin'
    avatar?: string
  } | null
  isAuthenticated: boolean
  login: (userInfo: { id: string, name: string, role: 'guest' | 'student' | 'admin' }) => void
  logout: () => void
  updateRole: (role: 'guest' | 'student' | 'admin') => void
}

export const useUserStore = create<UserState>((set) => ({
  user: { id: '001', name: '訪客學員', role: 'guest' },
  isAuthenticated: true,
  login: (userInfo) => set({ user: userInfo, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  updateRole: (role) => set((state) => ({
    user: state.user ? { ...state.user, role } : null
  })),
}))
