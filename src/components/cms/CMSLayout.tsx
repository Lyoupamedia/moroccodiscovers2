import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCMSSite } from '@/hooks/useCMSSite';
import { CMSSidebar } from './CMSSidebar';
import { CMSHeader } from './CMSHeader';
import { Loader2 } from 'lucide-react';

interface CMSLayoutProps {
  children: ReactNode;
}

export const CMSLayout = ({ children }: CMSLayoutProps) => {
  const { user, isLoading: authLoading } = useAuth();
  const { isLoading: sitesLoading } = useCMSSite();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || sitesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-muted/30">
      <CMSSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <CMSHeader />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
