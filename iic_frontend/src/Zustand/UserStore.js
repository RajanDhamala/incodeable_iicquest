import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      currentUser: null,
      isRegistered: false,
      setCurrentUser: (user) => set({ currentUser: user }),
      ClearCurrentUser: () => set({ currentUser: null }),
      setIsRegistered: () => set({ isRegistered: true }),
      ClearIsRegistered: () => set({ isRegistered: false }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ 
        isRegistered: state.isRegistered,
        currentUser: state.currentUser 
      }),
    }
  )
);

export default useUserStore;
