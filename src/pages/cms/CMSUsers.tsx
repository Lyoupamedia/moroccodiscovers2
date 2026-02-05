import { useState } from 'react';
import { CMSLayout } from '@/components/cms/CMSLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCMSSite } from '@/hooks/useCMSSite';
import { useAuth } from '@/hooks/useAuth';
import { 
  useCMSPermissions, 
  useCMSTeamMembers, 
  ROLE_PERMISSIONS 
} from '@/hooks/useCMSPermissions';
import { InviteMemberDialog } from '@/components/cms/InviteMemberDialog';
import { TeamMemberCard } from '@/components/cms/TeamMemberCard';
import { RolePermissionsCard } from '@/components/cms/RolePermissionsCard';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  UserPlus, 
  Crown, 
  AlertCircle,
  Info
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const CMSUsers = () => {
  const { user } = useAuth();
  const { currentSite, isLoading: siteLoading } = useCMSSite();
  const { userRole, hasPermission, isLoading: permissionsLoading } = useCMSPermissions();
  const { 
    members, 
    isLoading: membersLoading, 
    updateMemberRole, 
    removeMember,
    addMember 
  } = useCMSTeamMembers();
  const { toast } = useToast();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const canManageTeam = hasPermission('canManageTeam');
  const isLoading = siteLoading || permissionsLoading || membersLoading;

  const handleInvite = async (email: string, role: Parameters<typeof addMember>[1]) => {
    const result = await addMember(email, role);
    if (result.success) {
      toast({
        title: 'Invitation Sent',
        description: `${email} has been invited as ${ROLE_PERMISSIONS[role].label}.`,
      });
    } else {
      toast({
        title: 'Failed to Invite',
        description: result.error,
        variant: 'destructive',
      });
    }
    return result;
  };

  const handleUpdateRole = async (memberId: string, newRole: Parameters<typeof updateMemberRole>[1]) => {
    const success = await updateMemberRole(memberId, newRole);
    if (success) {
      toast({
        title: 'Role Updated',
        description: 'Team member role has been updated.',
      });
    } else {
      toast({
        title: 'Update Failed',
        description: 'Failed to update team member role.',
        variant: 'destructive',
      });
    }
    return success;
  };

  const handleRemove = async (memberId: string) => {
    const success = await removeMember(memberId);
    if (success) {
      toast({
        title: 'Member Removed',
        description: 'Team member has been removed from this site.',
      });
    } else {
      toast({
        title: 'Remove Failed',
        description: 'Failed to remove team member.',
        variant: 'destructive',
      });
    }
    return success;
  };

  if (!currentSite) {
    return (
      <CMSLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Loading site...</p>
        </div>
      </CMSLayout>
    );
  }

  return (
    <CMSLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Team Members</h1>
            <p className="text-muted-foreground mt-1">
              Manage users who can access and edit this site
            </p>
          </div>
          {canManageTeam && (
            <Button onClick={() => setInviteDialogOpen(true)} className="gap-2">
              <UserPlus className="w-4 h-4" />
              Invite Member
            </Button>
          )}
        </div>

        {/* Current Role Info */}
        {userRole && (
          <Alert>
            <Info className="w-4 h-4" />
            <AlertTitle>Your Role: {ROLE_PERMISSIONS[userRole].label}</AlertTitle>
            <AlertDescription>
              {ROLE_PERMISSIONS[userRole].description}
            </AlertDescription>
          </Alert>
        )}

        {/* Owner Card */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Crown className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">Site Owner</p>
                  {currentSite.owner_id === user?.id && (
                    <Badge variant="outline" className="text-xs">You</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Full access to all site features
                </p>
              </div>
              <Badge className="gap-1">
                <Crown className="w-3 h-3" />
                Owner
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Team Members List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-semibold flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team Members
            </h2>
            <Badge variant="secondary">{members.length} members</Badge>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : members.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-lg mb-2">No Team Members Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Invite team members to collaborate on your site.
                </p>
                {canManageTeam && (
                  <Button onClick={() => setInviteDialogOpen(true)} className="gap-2">
                    <UserPlus className="w-4 h-4" />
                    Invite First Member
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {members.map((member) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
                  isOwner={member.role === 'owner'}
                  canManage={canManageTeam}
                  currentUserId={user?.id}
                  onUpdateRole={handleUpdateRole}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}
        </div>

        {/* Permissions Reference */}
        <RolePermissionsCard />

        {/* Access Control Notice */}
        {!canManageTeam && (
          <Alert variant="default">
            <AlertCircle className="w-4 h-4" />
            <AlertTitle>Limited Access</AlertTitle>
            <AlertDescription>
              You don't have permission to manage team members. 
              Contact the site owner or an admin to make changes.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Invite Dialog */}
      <InviteMemberDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        onInvite={handleInvite}
      />
    </CMSLayout>
  );
};

export default CMSUsers;
