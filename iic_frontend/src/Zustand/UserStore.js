import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useUserStore = create(
  persist(
    (set) => ({
      CurrentUser: null,
      SetCurrentUser: (user) => set({ CurrentUser: user }),
      ClearCurrentUser: () => set({ CurrentUser: null }),
    }),
    {
      name: 'tourist-user-storage', 
      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name)
          return value ? JSON.parse(value) : null
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => {
          localStorage.removeItem(name)
        },
      },
    }
  )
)

export default useUserStore
