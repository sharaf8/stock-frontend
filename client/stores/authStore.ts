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

          // Mock authentication - simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Mock users for demonstration
          const mockUsers = [
            {
              id: '1',
              email: 'admin@example.com',
              name: 'System Admin',
              role: 'super_admin' as Role,
              password: 'admin123'
            },
            {
              id: '2',
              email: 'manager@example.com',
              name: 'Department Manager',
              role: 'manager' as Role,
              password: 'manager123'
            },
            {
              id: '3',
              email: 'employee@example.com',
              name: 'Team Member',
              role: 'employee' as Role,
              password: 'employee123'
            },
            {
              id: '4',
              email: 'viewer@example.com',
              name: 'System Viewer',
              role: 'viewer' as Role,
              password: 'viewer123'
            }
          ];

          // Find user by email and validate password
          const foundUser = mockUsers.find(u => u.email === email);

          if (!foundUser || foundUser.password !== password) {
            set({ isLoading: false });
            return false;
          }

          // Create mock tokens (in real app, these would come from server)
          const mockAccessToken = btoa(JSON.stringify({
            sub: foundUser.id,
            email: foundUser.email,
            name: foundUser.name,
            role: foundUser.role,
            exp: Date.now() + 3600000 // 1 hour
          }));

          const user: User = {
            id: foundUser.id,
            email: foundUser.email,
            name: foundUser.name,
            role: foundUser.role,
            avatar: undefined
          };

          set({
            user,
            accessToken: mockAccessToken,
            refreshToken: 'mock_refresh_token',
            isAuthenticated: true,
            isLoading: false
          });

          // Initialize RBAC store
          const { useRBACStore } = await import('./rbacStore');
          useRBACStore.getState().initializeFromAuth(user);

          return true;
        } catch (error) {
          console.error('Login error:', error);
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
