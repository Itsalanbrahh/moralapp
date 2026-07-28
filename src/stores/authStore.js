import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      isGuest: false,
      parentEmail: '',
      parentPin: '',
      childName: '',

      login: (email, pin) => set({
        isLoggedIn: true,
        isGuest: false,
        parentEmail: email,
        parentPin: pin,
      }),

      signup: (email, pin, childName) => set({
        isLoggedIn: true,
        isGuest: false,
        parentEmail: email,
        parentPin: pin,
        childName: childName,
      }),

      continueAsGuest: () => set({
        isLoggedIn: true,
        isGuest: true,
        parentEmail: '',
        parentPin: '',
        childName: 'Explorer',
      }),

      logout: () => set({
        isLoggedIn: false,
        isGuest: false,
        parentEmail: '',
        parentPin: '',
        childName: '',
      }),

      updateChildName: (name) => set({ childName: name }),
    }),
    {
      name: 'moral-auth-storage',
      version: 1,
    }
  )
)
