import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CMSRole, ROLE_PERMISSIONS } from '@/hooks/useCMSPermissions';
import { 
  Crown, 
  Shield, 
  Pencil, 
  User, 
  Eye,
  Check,
  X 
} from 'lucide-react';

const getRoleIcon = (role: CMSRole) => {
  switch (role) {
    case 'owner':
      return <Crown className="w-5 h-5 text-primary" />;
    case 'admin':
      return <Shield className="w-5 h-5 text-primary/80" />;
    case 'editor':
      return <Pencil className="w-5 h-5 text-primary/60" />;
    case 'author':
      return <User className="w-5 h-5 text-muted-foreground" />;
    case 'viewer':
      return <Eye className="w-5 h-5 text-muted-foreground" />;
  }
};

const permissionLabels: Record<string, string> = {
  canManageTeam: 'Manage Team',
  canManageSettings: 'Site Settings',
  canManageMenus: 'Menus',
  canManageDatabase: 'Database',
  canExportData: 'Export Data',
  canManagePages: 'Pages',
  canManagePosts: 'Posts',
  canManageMedia: 'Media Library',
  canDeleteSite: 'Delete Site',
  canEditOthersContent: 'Edit Others\' Content',
};

export const RolePermissionsCard = () => {
  const roles: CMSRole[] = ['owner', 'admin', 'editor', 'author', 'viewer'];
  const permissionKeys = Object.keys(permissionLabels) as (keyof typeof ROLE_PERMISSIONS.owner)[];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Role Permissions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3 font-medium">Permission</th>
                {roles.map((role) => (
                  <th key={role} className="text-center py-2 px-2">
                    <div className="flex flex-col items-center gap-1">
                      {getRoleIcon(role)}
                      <span className="text-xs font-medium">{ROLE_PERMISSIONS[role].label}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissionKeys.map((permission) => (
                <tr key={permission} className="border-b last:border-0">
                  <td className="py-2 px-3 text-muted-foreground">
                    {permissionLabels[permission]}
                  </td>
                  {roles.map((role) => (
                    <td key={role} className="text-center py-2 px-2">
                      {ROLE_PERMISSIONS[role][permission] ? (
                        <Check className="w-4 h-4 text-primary mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
