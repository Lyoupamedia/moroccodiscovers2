import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { CMSSite } from '@/types/cms';

interface CMSSiteContextType {
  currentSite: CMSSite | null;
  isLoading: boolean;
  error: string | null;
  updateSite: (updates: Partial<CMSSite>) => Promise<boolean>;
  refreshSite: () => Promise<void>;
}

const CMSSiteContext = createContext<CMSSiteContextType | undefined>(undefined);

export const CMSSiteProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [currentSite, setCurrentSite] = useState<CMSSite | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrCreateSite = async () => {
    if (!user) {
      setCurrentSite(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Try to fetch existing site
      const { data, error: fetchError } = await supabase
        .from('cms_sites')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (data) {
        setCurrentSite(data as unknown as CMSSite);
      } else {
        // Create a default site for the user
        const { data: newSite, error: createError } = await supabase
          .from('cms_sites')
          .insert({
            owner_id: user.id,
            name: 'My Website',
            slug: 'my-website',
          })
          .select()
          .single();

        if (createError) throw createError;
        setCurrentSite(newSite as unknown as CMSSite);
      }
    } catch (err) {
      console.error('Error fetching/creating site:', err);
      setError('Failed to load site');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrCreateSite();
  }, [user]);

  const updateSite = async (updates: Partial<CMSSite>): Promise<boolean> => {
    if (!currentSite) return false;

    try {
      const { error: updateError } = await supabase
        .from('cms_sites')
        .update(updates as Record<string, unknown>)
        .eq('id', currentSite.id);

      if (updateError) throw updateError;

      setCurrentSite(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (err) {
      console.error('Error updating site:', err);
      setError('Failed to update site');
      return false;
    }
  };

  return (
    <CMSSiteContext.Provider
      value={{
        currentSite,
        isLoading,
        error,
        updateSite,
        refreshSite: fetchOrCreateSite,
      }}
    >
      {children}
    </CMSSiteContext.Provider>
  );
};

export const useCMSSite = () => {
  const context = useContext(CMSSiteContext);
  if (context === undefined) {
    throw new Error('useCMSSite must be used within a CMSSiteProvider');
  }
  return context;
};
