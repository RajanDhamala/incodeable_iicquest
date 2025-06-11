import { create } from 'zustand'

const useUserStore = create((set) => ({
  CurrentUser: null,
  SetCurrentUser: (user) => set({ CurrentUser: user }),
  ClearCurrentUser: () => set({ CurrentUser: null }),
}))

export default useUserStore
