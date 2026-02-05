import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { CMSRole, CMSMember, ROLE_PERMISSIONS } from '@/hooks/useCMSPermissions';
import { User, Crown, Shield, Pencil, Eye, Trash2, Loader2 } from 'lucide-react';

interface TeamMemberCardProps {
  member: CMSMember;
  isOwner: boolean;
  canManage: boolean;
  currentUserId?: string;
  onUpdateRole: (memberId: string, newRole: CMSRole) => Promise<boolean>;
  onRemove: (memberId: string) => Promise<boolean>;
}

const getRoleIcon = (role: CMSRole) => {
  switch (role) {
    case 'owner':
      return <Crown className="w-4 h-4" />;
    case 'admin':
      return <Shield className="w-4 h-4" />;
    case 'editor':
      return <Pencil className="w-4 h-4" />;
    case 'author':
      return <User className="w-4 h-4" />;
    case 'viewer':
      return <Eye className="w-4 h-4" />;
    default:
      return <User className="w-4 h-4" />;
  }
};

const getRoleBadgeVariant = (role: CMSRole): 'default' | 'secondary' | 'outline' => {
  switch (role) {
    case 'owner':
      return 'default';
    case 'admin':
      return 'secondary';
    default:
      return 'outline';
  }
};

export const TeamMemberCard = ({
  member,
  isOwner,
  canManage,
  currentUserId,
  onUpdateRole,
  onRemove,
}: TeamMemberCardProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const isCurrentUser = member.user_id === currentUserId;
  const canModify = canManage && !isOwner && !isCurrentUser && member.role !== 'owner';

  const handleRoleChange = async (newRole: CMSRole) => {
    setIsUpdating(true);
    await onUpdateRole(member.id, newRole);
    setIsUpdating(false);
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    await onRemove(member.id);
    setIsRemoving(false);
  };

  const availableRoles: CMSRole[] = ['admin', 'editor', 'author', 'viewer'];

  return (
    <Card className={isCurrentUser ? 'border-primary/50 bg-primary/5' : ''}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              {getRoleIcon(member.role)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium truncate">
                  {member.email || `User ${member.user_id.slice(0, 8)}`}
                </p>
                {isCurrentUser && (
                  <Badge variant="outline" className="text-xs">You</Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={getRoleBadgeVariant(member.role)} className="gap-1">
                  {getRoleIcon(member.role)}
                  {ROLE_PERMISSIONS[member.role].label}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {canModify && (
              <>
                <Select
                  value={member.role}
                  onValueChange={handleRoleChange}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="w-[130px]">
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <SelectValue />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((r) => (
                      <SelectItem key={r} value={r}>
                        {ROLE_PERMISSIONS[r].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      disabled={isRemoving}
                    >
                      {isRemoving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove this member from your team? 
                        They will no longer have access to this site.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleRemove}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>

        {/* Permissions Preview */}
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-muted-foreground mb-2">Permissions:</p>
          <div className="flex flex-wrap gap-1">
            {ROLE_PERMISSIONS[member.role].canManagePages && (
              <Badge variant="outline" className="text-xs">Pages</Badge>
            )}
            {ROLE_PERMISSIONS[member.role].canManagePosts && (
              <Badge variant="outline" className="text-xs">Posts</Badge>
            )}
            {ROLE_PERMISSIONS[member.role].canManageMedia && (
              <Badge variant="outline" className="text-xs">Media</Badge>
            )}
            {ROLE_PERMISSIONS[member.role].canManageMenus && (
              <Badge variant="outline" className="text-xs">Menus</Badge>
            )}
            {ROLE_PERMISSIONS[member.role].canManageSettings && (
              <Badge variant="outline" className="text-xs">Settings</Badge>
            )}
            {ROLE_PERMISSIONS[member.role].canManageTeam && (
              <Badge variant="outline" className="text-xs">Team</Badge>
            )}
            {ROLE_PERMISSIONS[member.role].canManageDatabase && (
              <Badge variant="outline" className="text-xs">Database</Badge>
            )}
            {ROLE_PERMISSIONS[member.role].canExportData && (
              <Badge variant="outline" className="text-xs">Export</Badge>
            )}
            {!ROLE_PERMISSIONS[member.role].canManagePages && 
             !ROLE_PERMISSIONS[member.role].canManagePosts && (
              <Badge variant="outline" className="text-xs">View Only</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
