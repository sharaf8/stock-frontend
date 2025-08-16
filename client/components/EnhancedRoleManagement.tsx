import { useState } from 'react';
import { Role, Resource, Action, Permission, ROLE_PERMISSIONS, ROLE_HIERARCHY } from '@shared/rbac';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useRBACStore } from '@/stores/rbacStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Plus, 
  Shield, 
  Edit, 
  Trash2, 
  Eye,
  Check,
  X,
  AlertTriangle,
  Settings
} from 'lucide-react';

// Framework-validated actions and resources
const FRAMEWORK_ACTIONS: Action[] = [
  'create', 'read', 'update', 'delete', 'export', 'import', 'approve', 'reject', 'assign'
];

const FRAMEWORK_RESOURCES: Resource[] = [
  'users', 'employees', 'clients', 'sales', 'finance', 
  'dashboard', 'settings', 'reports', 'audit_logs', 'system_config'
];

const RESOURCE_LABELS: Record<Resource, string> = {
  users: 'User Management',
  employees: 'Employee Management', 
  clients: 'Client Management',
  sales: 'Sales Management',
  finance: 'Financial Management',
  dashboard: 'Dashboard Access',
  settings: 'System Settings',
  reports: 'Reports & Analytics',
  audit_logs: 'Audit Logs',
  system_config: 'System Configuration'
};

const ACTION_LABELS: Record<Action, string> = {
  create: 'Create',
  read: 'Read',
  update: 'Update', 
  delete: 'Delete',
  export: 'Export',
  import: 'Import',
  approve: 'Approve',
  reject: 'Reject',
  assign: 'Assign'
};

const ACTION_COLORS: Record<Action, string> = {
  read: 'bg-blue-100 text-blue-800',
  create: 'bg-green-100 text-green-800',
  update: 'bg-yellow-100 text-yellow-800',
  delete: 'bg-red-100 text-red-800',
  export: 'bg-purple-100 text-purple-800',
  import: 'bg-indigo-100 text-indigo-800',
  approve: 'bg-emerald-100 text-emerald-800',
  reject: 'bg-orange-100 text-orange-800',
  assign: 'bg-teal-100 text-teal-800'
};

interface EnhancedRoleManagementProps {
  onRoleChange?: () => void;
}

interface CustomRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystemRole: boolean;
  createdAt: Date;
  userCount: number;
}

export default function EnhancedRoleManagement({ onRoleChange }: EnhancedRoleManagementProps) {
  const [customRoles, setCustomRoles] = useState<CustomRole[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<CustomRole | null>(null);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: {} as Record<Resource, Action[]>
  });
  
  const { currentUser, hasPermission } = useRBACStore();
  const { toast } = useToast();

  // Validate that we only use framework-defined actions and resources
  const validatePermissions = (permissions: Record<Resource, Action[]>): boolean => {
    for (const [resource, actions] of Object.entries(permissions)) {
      if (!FRAMEWORK_RESOURCES.includes(resource as Resource)) {
        toast({
          title: 'Invalid Resource',
          description: `Resource "${resource}" is not defined in the framework`,
          variant: 'destructive'
        });
        return false;
      }
      
      for (const action of actions) {
        if (!FRAMEWORK_ACTIONS.includes(action)) {
          toast({
            title: 'Invalid Action',
            description: `Action "${action}" is not defined in the framework`,
            variant: 'destructive'
          });
          return false;
        }
      }
    }
    return true;
  };

  const togglePermission = (resource: Resource, action: Action) => {
    setNewRole(prev => {
      const currentActions = prev.permissions[resource] || [];
      const hasAction = currentActions.includes(action);
      
      const newActions = hasAction 
        ? currentActions.filter(a => a !== action)
        : [...currentActions, action];
      
      return {
        ...prev,
        permissions: {
          ...prev.permissions,
          [resource]: newActions
        }
      };
    });
  };

  const handleCreateRole = async () => {
    if (!newRole.name.trim()) {
      toast({
        title: 'Error',
        description: 'Role name is required',
        variant: 'destructive'
      });
      return;
    }

    if (!validatePermissions(newRole.permissions)) {
      return;
    }

    const totalPermissions = Object.values(newRole.permissions).reduce((sum, actions) => sum + actions.length, 0);
    if (totalPermissions === 0) {
      toast({
        title: 'Error', 
        description: 'At least one permission is required',
        variant: 'destructive'
      });
      return;
    }

    // Convert to framework permission structure
    const permissions: Permission[] = Object.entries(newRole.permissions)
      .filter(([_, actions]) => actions.length > 0)
      .map(([resource, actions]) => ({
        resource: resource as Resource,
        actions
      }));

    const customRole: CustomRole = {
      id: `custom_${Date.now()}`,
      name: newRole.name,
      description: newRole.description,
      permissions,
      isSystemRole: false,
      createdAt: new Date(),
      userCount: 0
    };

    setCustomRoles(prev => [...prev, customRole]);
    
    // Reset form
    setNewRole({
      name: '',
      description: '',
      permissions: {}
    });
    
    setIsCreateDialogOpen(false);
    
    toast({
      title: 'Role Created',
      description: `"${customRole.name}" role has been created with ${totalPermissions} permissions`,
    });

    onRoleChange?.();
  };

  const deleteCustomRole = (roleId: string) => {
    setCustomRoles(prev => prev.filter(role => role.id !== roleId));
    toast({
      title: 'Role Deleted',
      description: 'Custom role has been removed',
    });
    onRoleChange?.();
  };

  const getSystemRoles = (): CustomRole[] => {
    return Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => ({
      id: role,
      name: role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: `System-defined ${role.replace('_', ' ')} role`,
      permissions,
      isSystemRole: true,
      createdAt: new Date('2024-01-01'),
      userCount: 0 // Would come from actual user data
    }));
  };

  const allRoles = [...getSystemRoles(), ...customRoles];

  const canManageRoles = hasPermission('users', 'create') || hasPermission('system_config', 'update');

  if (!canManageRoles) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Access Restricted</h3>
            <p className="text-muted-foreground">
              You don't have permission to manage roles and permissions.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Role Management</h2>
          <p className="text-muted-foreground">
            Manage system and custom roles with framework-validated permissions
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Custom Role
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Custom Role</DialogTitle>
              <DialogDescription>
                Define a new role using only framework-validated permissions and resources
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="role-name">Role Name *</Label>
                  <Input
                    id="role-name"
                    value={newRole.name}
                    onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Customer Support Lead"
                  />
                </div>
                
                <div>
                  <Label htmlFor="role-desc">Description</Label>
                  <Input
                    id="role-desc"
                    value={newRole.description}
                    onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the role's responsibilities"
                  />
                </div>
              </div>

              {/* Framework Permissions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Framework Permissions</h3>
                  <div className="text-sm text-muted-foreground">
                    Total: {Object.values(newRole.permissions).reduce((sum, actions) => sum + actions.length, 0)} permissions
                  </div>
                </div>

                <div className="grid gap-4">
                  {FRAMEWORK_RESOURCES.map(resource => {
                    const resourceActions = newRole.permissions[resource] || [];
                    
                    return (
                      <Card key={resource} className="border-l-4 border-l-primary">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm">{RESOURCE_LABELS[resource]}</CardTitle>
                            <Badge variant="outline">
                              {resourceActions.length}/{FRAMEWORK_ACTIONS.length} actions
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                            {FRAMEWORK_ACTIONS.map(action => {
                              const hasAction = resourceActions.includes(action);
                              
                              return (
                                <Button
                                  key={action}
                                  type="button"
                                  variant={hasAction ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => togglePermission(resource, action)}
                                  className="text-xs"
                                >
                                  {ACTION_LABELS[action]}
                                </Button>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Permission Preview */}
              <div className="space-y-3">
                <h4 className="font-medium">Permission Summary</h4>
                <div className="space-y-2">
                  {Object.entries(newRole.permissions).map(([resource, actions]) => 
                    actions.length > 0 && (
                      <div key={resource} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{RESOURCE_LABELS[resource as Resource]}</span>
                        <div className="flex gap-1 flex-wrap">
                          {actions.map(action => (
                            <Badge 
                              key={action} 
                              variant="outline" 
                              className={ACTION_COLORS[action]}
                            >
                              {ACTION_LABELS[action]}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateRole}>
                Create Role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Roles</CardTitle>
          <CardDescription>
            System roles are built into the framework. Custom roles are user-created.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Users</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allRoles.map(role => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{role.name}</div>
                      <div className="text-sm text-muted-foreground">{role.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={role.isSystemRole ? "default" : "secondary"}>
                      {role.isSystemRole ? "System" : "Custom"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {role.permissions.length} permission{role.permissions.length !== 1 ? 's' : ''}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{role.userCount} users</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {/* View permissions */}}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {!role.isSystemRole && (
                        <>
                          <Button
                            variant="ghost" 
                            size="sm"
                            onClick={() => setEditingRole(role)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Role</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{role.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteCustomRole(role.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Framework Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Framework Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Available Resources ({FRAMEWORK_RESOURCES.length})</h4>
            <div className="flex gap-2 flex-wrap">
              {FRAMEWORK_RESOURCES.map(resource => (
                <Badge key={resource} variant="outline">
                  {RESOURCE_LABELS[resource]}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Available Actions ({FRAMEWORK_ACTIONS.length})</h4>
            <div className="flex gap-2 flex-wrap">
              {FRAMEWORK_ACTIONS.map(action => (
                <Badge 
                  key={action} 
                  variant="outline"
                  className={ACTION_COLORS[action]}
                >
                  {ACTION_LABELS[action]}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
