import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Role } from '@shared/rbac';

interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  updateUserRole: (newRole: Role) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      refreshToken: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });

          const response = await fetch('http://localhost:5002/api/auth/sign-in', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
          });

          const data = await response.json();

          if (data.ok && data.result) {
            const { accessToken, refreshToken } = data.result;

            // Decode JWT
            const decoded: any = JSON.parse(atob(accessToken.split('.')[1]));

            const user: User = {
              id: decoded.sub,
              email: decoded.email,
              name: decoded.name || '',
              role: decoded.role,
              avatar: decoded.avatar || undefined
            };

            set({
              user,
              accessToken,
              refreshToken,
              isAuthenticated: true,
              isLoading: false
            });

            // Initialize RBAC store
            const { useRBACStore } = await import('./rbacStore');
            useRBACStore.getState().initializeFromAuth(user);

            return true;
          } else {
            set({ isLoading: false });
            return false;
          }
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          return false;
        }
      },

      register: async (name: string, email: string, password: string) => {
        try {
          set({ isLoading: true });

          const response = await fetch('http://localhost:5002/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              firstName: name,
              email,
              password
            }),
          });

          const data = await response.json();

          if (data.ok && data.result) {
            const userFromApi = data.result;

            const user: User = {
              id: userFromApi.id,
              email: userFromApi.email,
              name: userFromApi.firstName,
              role: userFromApi.role,
              avatar: undefined,
            };

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            });

            // Initialize RBAC store
            const { useRBACStore } = await import('./rbacStore');
            useRBACStore.getState().initializeFromAuth(user);

            return true;
          } else {
            set({ isLoading: false });
            return false;
          }
        } catch (error) {
          console.error('Register error:', error);
          set({ isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null
        });

        // Reset RBAC store
        import('./rbacStore').then(({ useRBACStore }) => {
          useRBACStore.getState().reset();
        });
      },

      updateUserRole: (newRole: Role) => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, role: newRole };
          set({ user: updatedUser });

          // Update RBAC store
          import('./rbacStore').then(({ useRBACStore }) => {
            useRBACStore.getState().initializeFromAuth(updatedUser);
          });
        }
      },

      forgotPassword: async (email: string) => {
        set({ isLoading: true });

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock implementation - in real app, this would make an API call
        set({ isLoading: false });

        // For demo purposes, always return true
        return true;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);
