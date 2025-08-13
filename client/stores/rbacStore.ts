import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Role, 
  Resource, 
  Action, 
  RBACUser, 
  Permission,
  hasPermission, 
  canAccessResource, 
  getAllowedActions,
  isHigherRole,
  ROLE_PERMISSIONS,
  NAVIGATION_PERMISSIONS
} from '@shared/rbac';

interface RBACState {
  // Current user's RBAC context
  currentUser: RBACUser | null;
  
  // Permission checking methods
  hasPermission: (resource: Resource, action: Action, context?: any) => boolean;
  canAccessResource: (resource: Resource) => boolean;
  getAllowedActions: (resource: Resource) => Action[];
  canAccessRoute: (path: string) => boolean;
  
  // Role management methods
  isHigherRole: (targetRole: Role) => boolean;
  canManageUser: (targetUserId: string, targetRole: Role) => boolean;
  
  // User management (for admin interfaces)
  users: RBACUser[];
  isLoadingUsers: boolean;
  loadUsers: () => Promise<void>;
  updateUserRole: (userId: string, newRole: Role) => Promise<boolean>;
  updateUserStatus: (userId: string, status: 'active' | 'inactive' | 'suspended') => Promise<boolean>;
  
  // Audit and security
  auditLogs: AuditLog[];
  logAction: (action: string, resource: string, details?: any) => void;
  
  // UI state
  selectedUser: RBACUser | null;
  setSelectedUser: (user: RBACUser | null) => void;
  
  // Initialize from auth store
  initializeFromAuth: (user: any) => void;
  reset: () => void;
}

interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: Date;
  details?: any;
  ipAddress?: string;
}

export const useRBACStore = create<RBACState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      isLoadingUsers: false,
      auditLogs: [],
      selectedUser: null,

      // Permission checking methods
      hasPermission: (resource: Resource, action: Action, context?: any) => {
        const { currentUser } = get();
        if (!currentUser) return false;
        
        const permissionContext = {
          userId: currentUser.id,
          department: currentUser.department,
          region: currentUser.region,
          ...context
        };
        
        return hasPermission(currentUser.role, resource, action, permissionContext);
      },

      canAccessResource: (resource: Resource) => {
        const { currentUser } = get();
        if (!currentUser) return false;
        return canAccessResource(currentUser.role, resource);
      },

      getAllowedActions: (resource: Resource) => {
        const { currentUser } = get();
        if (!currentUser) return [];
        return getAllowedActions(currentUser.role, resource);
      },

      canAccessRoute: (path: string) => {
        const { currentUser } = get();
        if (!currentUser) return false;
        
        const navPermission = NAVIGATION_PERMISSIONS.find(nav => 
          path.startsWith(nav.path) || nav.path === path
        );
        
        if (!navPermission) return true; // Allow access to routes not defined in permissions
        
        // Check role requirement
        if (!navPermission.requiredRole.includes(currentUser.role)) {
          return false;
        }
        
        // Check specific permission if defined
        if (navPermission.requiredPermission) {
          return get().hasPermission(
            navPermission.requiredPermission.resource,
            navPermission.requiredPermission.action
          );
        }
        
        return true;
      },

      // Role management methods
      isHigherRole: (targetRole: Role) => {
        const { currentUser } = get();
        if (!currentUser) return false;
        return isHigherRole(currentUser.role, targetRole);
      },

      canManageUser: (targetUserId: string, targetRole: Role) => {
        const { currentUser } = get();
        if (!currentUser) return false;
        
        // Can't manage yourself for role changes
        if (currentUser.id === targetUserId) return false;
        
        // Must have user management permission
        if (!get().hasPermission('users', 'update')) return false;
        
        // Must have higher role than target
        return get().isHigherRole(targetRole);
      },

      // User management
      loadUsers: async () => {
        const { currentUser } = get();
        if (!currentUser || !get().hasPermission('users', 'read')) {
          return;
        }

        set({ isLoadingUsers: true });

        // For demo purposes, use mock data directly
        // In a real application, this would make an API call
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading delay

        const mockUsers: RBACUser[] = [
          {
            id: '1',
            email: 'admin@example.com',
            name: 'System Admin',
            role: 'super_admin',
            permissions: ROLE_PERMISSIONS.super_admin,
            status: 'active',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-15'),
          },
          {
            id: '2',
            email: 'manager@example.com',
            name: 'Department Manager',
            role: 'manager',
            permissions: ROLE_PERMISSIONS.manager,
            department: 'Sales',
            status: 'active',
            createdAt: new Date('2024-01-05'),
            updatedAt: new Date('2024-01-20'),
          },
          {
            id: '3',
            email: 'employee@example.com',
            name: 'Team Member',
            role: 'employee',
            permissions: ROLE_PERMISSIONS.employee,
            department: 'Sales',
            status: 'active',
            createdAt: new Date('2024-01-10'),
            updatedAt: new Date('2024-01-25'),
          },
          {
            id: '4',
            email: 'viewer@example.com',
            name: 'System Viewer',
            role: 'viewer',
            permissions: ROLE_PERMISSIONS.viewer,
            department: 'Operations',
            status: 'active',
            createdAt: new Date('2024-01-12'),
            updatedAt: new Date('2024-01-28'),
          }
        ];

        set({ users: mockUsers, isLoadingUsers: false });
        get().logAction('load_users', 'users');
      },

      updateUserRole: async (userId: string, newRole: Role) => {
        const { currentUser, users } = get();
        if (!currentUser || !get().canManageUser(userId, newRole)) {
          return false;
        }

        try {
          const response = await fetch(`/api/admin/users/${userId}/role`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({ role: newRole })
          });

          if (response.ok) {
            // Update local state
            const updatedUsers = users.map(user => 
              user.id === userId 
                ? { 
                    ...user, 
                    role: newRole, 
                    permissions: ROLE_PERMISSIONS[newRole],
                    updatedAt: new Date()
                  }
                : user
            );
            
            set({ users: updatedUsers });
            get().logAction('update_user_role', 'users', { userId, newRole });
            return true;
          }
          
          return false;
        } catch (error) {
          console.error('Error updating user role:', error);
          return false;
        }
      },

      updateUserStatus: async (userId: string, status: 'active' | 'inactive' | 'suspended') => {
        const { currentUser, users } = get();
        if (!currentUser || !get().hasPermission('users', 'update')) {
          return false;
        }

        try {
          const response = await fetch(`/api/admin/users/${userId}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({ status })
          });

          if (response.ok) {
            const updatedUsers = users.map(user => 
              user.id === userId 
                ? { ...user, status, updatedAt: new Date() }
                : user
            );
            
            set({ users: updatedUsers });
            get().logAction('update_user_status', 'users', { userId, status });
            return true;
          }
          
          return false;
        } catch (error) {
          console.error('Error updating user status:', error);
          return false;
        }
      },

      // Audit logging
      logAction: (action: string, resource: string, details?: any) => {
        const { currentUser, auditLogs } = get();
        if (!currentUser) return;

        const newLog: AuditLog = {
          id: Date.now().toString(),
          userId: currentUser.id,
          action,
          resource,
          timestamp: new Date(),
          details,
          ipAddress: 'unknown' // Would get actual IP in real implementation
        };

        set({ 
          auditLogs: [newLog, ...auditLogs.slice(0, 99)] // Keep last 100 logs
        });
      },

      // UI state management
      setSelectedUser: (user: RBACUser | null) => {
        set({ selectedUser: user });
      },

      // Initialize from auth store
      initializeFromAuth: (user: any) => {
        if (!user) {
          set({ currentUser: null });
          return;
        }

        const userRole = user.role as Role;
        const validRole = ROLE_PERMISSIONS[userRole] ? userRole : 'viewer';

        const rbacUser: RBACUser = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: validRole,
          permissions: ROLE_PERMISSIONS[validRole] || [],
          avatar: user.avatar,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        set({ currentUser: rbacUser });
        get().logAction('login', 'auth');
      },

      reset: () => {
        set({
          currentUser: null,
          users: [],
          isLoadingUsers: false,
          auditLogs: [],
          selectedUser: null
        });
      }
    }),
    {
      name: 'rbac-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        auditLogs: state.auditLogs.slice(0, 10) // Persist only recent logs
      }),
    }
  )
);
