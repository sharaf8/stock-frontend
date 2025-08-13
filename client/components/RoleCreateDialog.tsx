import { useState } from 'react';
import { Role, Resource, Action, Permission, ROLE_PERMISSIONS } from '@shared/rbac';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RoleBadge from '@/components/ui/role-badge';
import { useToast } from '@/hooks/use-toast';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  Plus, 
  Shield, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Settings,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  UserCheck
} from 'lucide-react';

interface RoleCreateDialogProps {
  trigger?: React.ReactNode;
  onRoleCreated?: () => void;
}

const RESOURCES: Resource[] = [
  'users', 'employees', 'clients', 'sales', 'finance', 
  'dashboard', 'settings', 'reports', 'audit_logs', 'system_config'
];

const ACTIONS: Action[] = [
  'create', 'read', 'update', 'delete', 'export', 'import', 'approve', 'reject', 'assign'
];

const resourceLabels: Record<Resource, string> = {
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

const actionLabels: Record<Action, string> = {
  create: 'Create',
  read: 'View/Read',
  update: 'Edit/Update',
  delete: 'Delete',
  export: 'Export Data',
  import: 'Import Data',
  approve: 'Approve',
  reject: 'Reject',
  assign: 'Assign'
};

const actionIcons: Record<Action, typeof Eye> = {
  read: Eye,
  create: Plus,
  update: Edit,
  delete: Trash2,
  export: Download,
  import: Upload,
  approve: CheckCircle,
  reject: XCircle,
  assign: Shield
};

export default function RoleCreateDialog({ trigger, onRoleCreated }: RoleCreateDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: {} as Partial<Record<Resource, Action[]>>
  });

  const { toast } = useToast();

  const togglePermission = (resource: Resource, action: Action) => {
    setFormData(prev => {
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

  const setAllActionsForResource = (resource: Resource, enabled: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [resource]: enabled ? [...ACTIONS] : []
      }
    }));
  };

  const copyFromExistingRole = (role: Role) => {
    const rolePermissions = ROLE_PERMISSIONS[role];
    const permissionMap: Record<Resource, Action[]> = {};
    
    rolePermissions.forEach(permission => {
      permissionMap[permission.resource] = permission.actions;
    });
    
    setFormData(prev => ({
      ...prev,
      permissions: permissionMap
    }));
    
    toast({
      title: 'Permissions Copied',
      description: `Copied permissions from ${role.replace('_', ' ')} role`,
    });
  };

  const getTotalPermissions = () => {
    return Object.values(formData.permissions).reduce((total, actions) => total + actions.length, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Role name is required',
        variant: 'destructive',
      });
      return;
    }

    const totalPerms = getTotalPermissions();
    if (totalPerms === 0) {
      toast({
        title: 'Error',
        description: 'At least one permission is required',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to create role
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: 'Role Created Successfully',
        description: `${formData.name} role has been created with ${totalPerms} permissions`,
      });

      // Reset form
      setFormData({
        name: '',
        description: '',
        permissions: {}
      });

      setIsOpen(false);
      onRoleCreated?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create role. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      permissions: {}
    });
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Role
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
          <DialogDescription>
            Define a new role with specific permissions and access levels
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Role Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Customer Support Manager"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this role does and who should have it..."
                    rows={3}
                  />
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Copy from Existing Role</CardTitle>
                    <CardDescription className="text-xs">
                      Start with permissions from an existing role and modify as needed
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 flex-wrap">
                      {Object.keys(ROLE_PERMISSIONS).map((role) => (
                        <Button
                          key={role}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => copyFromExistingRole(role as Role)}
                          className="text-xs"
                        >
                          Copy {role.replace('_', ' ')}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Permissions Tab */}
            <TabsContent value="permissions" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Configure Permissions</h3>
                  <div className="text-sm text-muted-foreground">
                    Total: {getTotalPermissions()} permissions
                  </div>
                </div>

                <div className="grid gap-4">
                  {RESOURCES.map((resource) => {
                    const resourceActions = formData.permissions[resource] || [];
                    const hasAllActions = ACTIONS.every(action => resourceActions.includes(action));
                    const hasAnyAction = resourceActions.length > 0;

                    return (
                      <Card key={resource}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm">{resourceLabels[resource]}</CardTitle>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {resourceActions.length}/{ACTIONS.length}
                              </span>
                              <Switch
                                checked={hasAllActions}
                                onCheckedChange={(checked) => setAllActionsForResource(resource, checked)}
                              />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                            {ACTIONS.map((action) => {
                              const hasAction = resourceActions.includes(action);
                              const Icon = actionIcons[action];
                              
                              return (
                                <Button
                                  key={action}
                                  type="button"
                                  variant={hasAction ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => togglePermission(resource, action)}
                                  className="flex items-center gap-1 text-xs h-8"
                                >
                                  <Icon className="h-3 w-3" />
                                  {actionLabels[action]}
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
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview" className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Role Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {formData.name || 'Untitled Role'}</div>
                    <div><strong>Description:</strong> {formData.description || 'No description'}</div>
                    <div><strong>Total Permissions:</strong> {getTotalPermissions()}</div>
                    <div><strong>Resources:</strong> {Object.keys(formData.permissions).length}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Permission Breakdown</h4>
                  {Object.entries(formData.permissions).map(([resource, actions]) => 
                    actions.length > 0 && (
                      <div key={resource} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{resourceLabels[resource as Resource]}</span>
                        <div className="flex gap-1 flex-wrap">
                          {actions.map(action => {
                            const Icon = actionIcons[action];
                            return (
                              <span
                                key={action}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                              >
                                <Icon className="h-3 w-3" />
                                {actionLabels[action]}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )
                  )}
                  
                  {Object.keys(formData.permissions).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No permissions configured yet
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <strong>Note:</strong> Users with this role will have access to the configured 
                    permissions. Make sure to review carefully before creating the role.
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || !formData.name.trim() || getTotalPermissions() === 0}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Create Role
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
