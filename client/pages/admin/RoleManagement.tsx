import { useState } from 'react';
import { Role, ROLE_PERMISSIONS, ROLE_HIERARCHY } from '@shared/rbac';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RoleBadge from '@/components/ui/role-badge';
import PermissionDisplay, { RoleComparison } from '@/components/ui/permission-display';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  Shield, 
  Users, 
  Eye, 
  Settings,
  BarChart3,
  GitBranch
} from 'lucide-react';

export default function RoleManagement() {
  const [selectedRole, setSelectedRole] = useState<Role>('admin');
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const roles = Object.keys(ROLE_PERMISSIONS) as Role[];
  
  const getRoleStats = (role: Role) => {
    const permissions = ROLE_PERMISSIONS[role];
    const totalPermissions = permissions.reduce((acc, perm) => acc + perm.actions.length, 0);
    const resourceCount = permissions.length;
    const subordinates = ROLE_HIERARCHY[role]?.length || 0;
    
    return {
      totalPermissions,
      resourceCount,
      subordinates
    };
  };

  const getRoleDescription = (role: Role): string => {
    const descriptions: Record<Role, string> = {
      super_admin: 'Complete system access with all administrative privileges',
      admin: 'High-level administrative access to most system functions',
      manager: 'Departmental management with approval and oversight capabilities',
      team_lead: 'Team leadership with limited administrative functions',
      employee: 'Standard user access for daily operational tasks',
      intern: 'Limited access for learning and basic task completion',
      viewer: 'Read-only access to basic system information'
    };
    return descriptions[role];
  };

  const getRoleColor = (role: Role): string => {
    const colors: Record<Role, string> = {
      super_admin: 'from-purple-500 to-purple-600',
      admin: 'from-red-500 to-red-600',
      manager: 'from-blue-500 to-blue-600',
      team_lead: 'from-green-500 to-green-600',
      employee: 'from-gray-500 to-gray-600',
      intern: 'from-yellow-500 to-yellow-600',
      viewer: 'from-slate-500 to-slate-600'
    };
    return colors[role];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Role Management</h1>
          <p className="text-muted-foreground">
            Manage system roles, permissions, and access hierarchies
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsComparisonOpen(true)}
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Compare Roles
          </Button>
          <Button className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Create Role
          </Button>
        </div>
      </div>

      {/* Role Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roles.map((role) => {
          const stats = getRoleStats(role);
          return (
            <Card 
              key={role} 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedRole === role ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedRole(role)}
            >
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getRoleColor(role)} flex items-center justify-center mb-2`}>
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="flex items-center justify-between">
                  <span className="capitalize text-lg">
                    {role.replace('_', ' ')}
                  </span>
                </CardTitle>
                <CardDescription className="text-xs">
                  {getRoleDescription(role)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Permissions:</span>
                    <Badge variant="secondary">{stats.totalPermissions}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Resources:</span>
                    <Badge variant="secondary">{stats.resourceCount}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subordinates:</span>
                    <Badge variant="secondary">{stats.subordinates}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Role View */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getRoleColor(selectedRole)} flex items-center justify-center`}>
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span className="capitalize">{selectedRole.replace('_', ' ')}</span>
                  <RoleBadge role={selectedRole} size="sm" />
                </CardTitle>
                <CardDescription>
                  {getRoleDescription(selectedRole)}
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total Permissions</div>
              <div className="text-2xl font-bold">{getRoleStats(selectedRole).totalPermissions}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="permissions" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="hierarchy">Hierarchy</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="permissions" className="space-y-4">
              <PermissionDisplay permissions={ROLE_PERMISSIONS[selectedRole]} />
            </TabsContent>

            <TabsContent value="hierarchy" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Can Manage */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <GitBranch className="h-5 w-5" />
                      Can Manage
                    </CardTitle>
                    <CardDescription>
                      Roles that {selectedRole.replace('_', ' ')} can manage or oversee
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {ROLE_HIERARCHY[selectedRole]?.length > 0 ? (
                      <div className="space-y-2">
                        {ROLE_HIERARCHY[selectedRole].map((subordinateRole) => (
                          <div key={subordinateRole} className="flex items-center justify-between p-3 border rounded-lg">
                            <RoleBadge role={subordinateRole} />
                            <div className="text-sm text-muted-foreground">
                              {getRoleStats(subordinateRole).totalPermissions} permissions
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        This role cannot manage other roles
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Managed By */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Users className="h-5 w-5" />
                      Managed By
                    </CardTitle>
                    <CardDescription>
                      Roles that can manage or oversee {selectedRole.replace('_', ' ')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const managingRoles = roles.filter(role => 
                        ROLE_HIERARCHY[role]?.includes(selectedRole)
                      );
                      
                      return managingRoles.length > 0 ? (
                        <div className="space-y-2">
                          {managingRoles.map((managingRole) => (
                            <div key={managingRole} className="flex items-center justify-between p-3 border rounded-lg">
                              <RoleBadge role={managingRole} />
                              <div className="text-sm text-muted-foreground">
                                {getRoleStats(managingRole).totalPermissions} permissions
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          This role is not managed by any other role
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Resources Accessible</CardTitle>
                    <Settings className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{getRoleStats(selectedRole).resourceCount}</div>
                    <p className="text-xs text-muted-foreground">
                      out of {Object.keys(ROLE_PERMISSIONS).length} total resources
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{getRoleStats(selectedRole).totalPermissions}</div>
                    <p className="text-xs text-muted-foreground">
                      across all accessible resources
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Hierarchy Level</CardTitle>
                    <GitBranch className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {roles.indexOf(selectedRole) + 1}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      of {roles.length} total roles
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Permission Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Permission Breakdown</CardTitle>
                  <CardDescription>
                    Detailed analysis of permissions by action type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const actionCounts = ROLE_PERMISSIONS[selectedRole].reduce((acc, permission) => {
                      permission.actions.forEach(action => {
                        acc[action] = (acc[action] || 0) + 1;
                      });
                      return acc;
                    }, {} as Record<string, number>);

                    return (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(actionCounts).map(([action, count]) => (
                          <div key={action} className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold text-primary">{count}</div>
                            <div className="text-sm text-muted-foreground capitalize">{action}</div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Role Comparison Dialog */}
      <Dialog open={isComparisonOpen} onOpenChange={setIsComparisonOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Role Comparison</DialogTitle>
            <DialogDescription>
              Compare permissions and capabilities across different roles
            </DialogDescription>
          </DialogHeader>
          
          <RoleComparison roles={roles} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
