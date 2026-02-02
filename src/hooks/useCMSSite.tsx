import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { CMSSite } from '@/types/cms';

interface CMSSiteContextType {
  sites: CMSSite[];
  currentSite: CMSSite | null;
  isLoading: boolean;
  error: string | null;
  setCurrentSite: (site: CMSSite | null) => void;
  createSite: (name: string, slug: string) => Promise<CMSSite | null>;
  updateSite: (id: string, updates: Partial<CMSSite>) => Promise<boolean>;
  deleteSite: (id: string) => Promise<boolean>;
  refreshSites: () => Promise<void>;
}

const CMSSiteContext = createContext<CMSSiteContextType | undefined>(undefined);

export const CMSSiteProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [sites, setSites] = useState<CMSSite[]>([]);
  const [currentSite, setCurrentSite] = useState<CMSSite | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSites = async () => {
    if (!user) {
      setSites([]);
      setCurrentSite(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('cms_sites')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const sitesData = (data || []) as unknown as CMSSite[];
      setSites(sitesData);

      // Restore current site from localStorage or select first
      const savedSiteId = localStorage.getItem('cms_current_site');
      const savedSite = sitesData.find(s => s.id === savedSiteId);
      
      if (savedSite) {
        setCurrentSite(savedSite);
      } else if (sitesData.length > 0) {
        setCurrentSite(sitesData[0]);
      }
    } catch (err) {
      console.error('Error fetching sites:', err);
      setError('Failed to load sites');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, [user]);

  // Persist current site selection
  useEffect(() => {
    if (currentSite) {
      localStorage.setItem('cms_current_site', currentSite.id);
    }
  }, [currentSite]);

  const createSite = async (name: string, slug: string): Promise<CMSSite | null> => {
    if (!user) return null;

    try {
      const { data, error: createError } = await supabase
        .from('cms_sites')
        .insert({
          owner_id: user.id,
          name,
          slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        })
        .select()
        .single();

      if (createError) throw createError;

      const newSite = data as unknown as CMSSite;
      setSites(prev => [newSite, ...prev]);
      setCurrentSite(newSite);
      return newSite;
    } catch (err) {
      console.error('Error creating site:', err);
      setError('Failed to create site');
      return null;
    }
  };

  const updateSite = async (id: string, updates: Partial<CMSSite>): Promise<boolean> => {
    try {
      const { error: updateError } = await supabase
        .from('cms_sites')
        .update(updates as Record<string, unknown>)
        .eq('id', id);

      if (updateError) throw updateError;

      setSites(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
      if (currentSite?.id === id) {
        setCurrentSite(prev => prev ? { ...prev, ...updates } : null);
      }
      return true;
    } catch (err) {
      console.error('Error updating site:', err);
      setError('Failed to update site');
      return false;
    }
  };

  const deleteSite = async (id: string): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase
        .from('cms_sites')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setSites(prev => prev.filter(s => s.id !== id));
      if (currentSite?.id === id) {
        const remaining = sites.filter(s => s.id !== id);
        setCurrentSite(remaining.length > 0 ? remaining[0] : null);
      }
      return true;
    } catch (err) {
      console.error('Error deleting site:', err);
      setError('Failed to delete site');
      return false;
    }
  };

  return (
    <CMSSiteContext.Provider
      value={{
        sites,
        currentSite,
        isLoading,
        error,
        setCurrentSite,
        createSite,
        updateSite,
        deleteSite,
        refreshSites: fetchSites,
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
