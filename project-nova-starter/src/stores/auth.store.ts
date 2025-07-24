import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// This shape must match what our backend sends
interface User {
  id: string;
  name: string;
  email: string;
  pictureUrl: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  // The 'persist' middleware automatically saves the store's state
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user, token) => set({ user, token }),
      logout: () => {
        set({ user: null, token: null });
        // Optional: clear other caches upon logout
      },
    }),
    {
      name: 'nova-auth-storage', // The key used in localStorage
    }
  )
);