import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      currentUser: null,
      isRegistered: false,
      userType: null,

      setCurrentUser: (user) => set({ currentUser: user }),
      ClearCurrentUser: () => set({ currentUser: null }),

      setIsRegistered: () => set({ isRegistered: true }),
      ClearIsRegistered: () => set({ isRegistered: false }),

      setUserType: (type) => set({ userType: type }),
      clearUserType: () => set({ userType: null }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        isRegistered: state.isRegistered,
        currentUser: state.currentUser,
        userType: state.userType,
      }),
    }
  )
);

export default useUserStore;
