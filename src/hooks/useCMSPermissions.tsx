import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCMSSite } from '@/hooks/useCMSSite';

export type CMSRole = 'owner' | 'admin' | 'editor' | 'author' | 'viewer';

// Define what each role can do
export const ROLE_PERMISSIONS = {
  owner: {
    label: 'Owner',
    description: 'Full access including site deletion',
    canManageTeam: true,
    canManageSettings: true,
    canManageMenus: true,
    canManageDatabase: true,
    canExportData: true,
    canManagePages: true,
    canManagePosts: true,
    canManageMedia: true,
    canDeleteSite: true,
    canEditOthersContent: true,
  },
  admin: {
    label: 'Admin',
    description: 'Full access except site deletion',
    canManageTeam: true,
    canManageSettings: true,
    canManageMenus: true,
    canManageDatabase: true,
    canExportData: true,
    canManagePages: true,
    canManagePosts: true,
    canManageMedia: true,
    canDeleteSite: false,
    canEditOthersContent: true,
  },
  editor: {
    label: 'Editor',
    description: 'Can edit all pages, posts, and media',
    canManageTeam: false,
    canManageSettings: false,
    canManageMenus: true,
    canManageDatabase: false,
    canExportData: false,
    canManagePages: true,
    canManagePosts: true,
    canManageMedia: true,
    canDeleteSite: false,
    canEditOthersContent: true,
  },
  author: {
    label: 'Author',
    description: 'Can create and edit own posts only',
    canManageTeam: false,
    canManageSettings: false,
    canManageMenus: false,
    canManageDatabase: false,
    canExportData: false,
    canManagePages: false,
    canManagePosts: true,
    canManageMedia: true,
    canDeleteSite: false,
    canEditOthersContent: false,
  },
  viewer: {
    label: 'Viewer',
    description: 'Can view content only, no editing',
    canManageTeam: false,
    canManageSettings: false,
    canManageMenus: false,
    canManageDatabase: false,
    canExportData: false,
    canManagePages: false,
    canManagePosts: false,
    canManageMedia: false,
    canDeleteSite: false,
    canEditOthersContent: false,
  },
} as const;

export interface CMSMember {
  id: string;
  user_id: string;
  role: CMSRole;
  created_at: string;
  email?: string;
}

export const useCMSPermissions = () => {
  const { user } = useAuth();
  const { currentSite } = useCMSSite();
  const [userRole, setUserRole] = useState<CMSRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user || !currentSite) {
        setUserRole(null);
        setIsLoading(false);
        return;
      }

      // Check if user is the owner
      if (currentSite.owner_id === user.id) {
        setUserRole('owner');
        setIsLoading(false);
        return;
      }

      // Check site membership
      try {
        const { data, error } = await supabase
          .from('cms_site_members')
          .select('role')
          .eq('site_id', currentSite.id)
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user role:', error);
        }

        setUserRole(data?.role as CMSRole || null);
      } catch (err) {
        console.error('Error fetching role:', err);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [user, currentSite]);

  const permissions = userRole ? ROLE_PERMISSIONS[userRole] : null;

  const hasPermission = (permission: keyof typeof ROLE_PERMISSIONS.owner): boolean => {
    if (!permissions) return false;
    return permissions[permission] === true;
  };

  return {
    userRole,
    permissions,
    isLoading,
    hasPermission,
    isOwner: userRole === 'owner',
    isAdmin: userRole === 'owner' || userRole === 'admin',
  };
};

export const useCMSTeamMembers = () => {
  const { currentSite } = useCMSSite();
  const [members, setMembers] = useState<CMSMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async () => {
    if (!currentSite) {
      setMembers([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('cms_site_members')
        .select('*')
        .eq('site_id', currentSite.id)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      setMembers(data as CMSMember[]);
    } catch (err) {
      console.error('Error fetching team members:', err);
      setError('Failed to load team members');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [currentSite]);

  const addMember = async (email: string, role: CMSRole): Promise<{ success: boolean; error?: string }> => {
    if (!currentSite) return { success: false, error: 'No site selected' };

    try {
      // For now, we'll create a placeholder member with the email
      // In production, you'd send an invite email and create the member when they accept
      const { data, error: insertError } = await supabase
        .from('cms_site_members')
        .insert({
          site_id: currentSite.id,
          user_id: crypto.randomUUID(), // Placeholder - in real app, lookup user by email
          role,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      await fetchMembers();
      return { success: true };
    } catch (err: any) {
      console.error('Error adding member:', err);
      return { success: false, error: err.message || 'Failed to add member' };
    }
  };

  const updateMemberRole = async (memberId: string, newRole: CMSRole): Promise<boolean> => {
    if (!currentSite) return false;

    try {
      const { error: updateError } = await supabase
        .from('cms_site_members')
        .update({ role: newRole })
        .eq('id', memberId)
        .eq('site_id', currentSite.id);

      if (updateError) throw updateError;

      await fetchMembers();
      return true;
    } catch (err) {
      console.error('Error updating member role:', err);
      return false;
    }
  };

  const removeMember = async (memberId: string): Promise<boolean> => {
    if (!currentSite) return false;

    try {
      const { error: deleteError } = await supabase
        .from('cms_site_members')
        .delete()
        .eq('id', memberId)
        .eq('site_id', currentSite.id);

      if (deleteError) throw deleteError;

      await fetchMembers();
      return true;
    } catch (err) {
      console.error('Error removing member:', err);
      return false;
    }
  };

  return {
    members,
    isLoading,
    error,
    addMember,
    updateMemberRole,
    removeMember,
    refreshMembers: fetchMembers,
  };
};
