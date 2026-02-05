import { useEffect, useState } from 'react';
import { CMSLayout } from '@/components/cms/CMSLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCMSSite } from '@/hooks/useCMSSite';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Image, Layers, Users, Database, ArrowRight, Globe, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const CMSDashboard = () => {
  const { currentSite, isLoading } = useCMSSite();
  const [stats, setStats] = useState({
    pages: 0,
    posts: 0,
    media: 0,
    users: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentSite) return;

      const [pagesRes, postsRes, mediaRes, usersRes] = await Promise.all([
        supabase.from('cms_pages').select('id', { count: 'exact', head: true }).eq('site_id', currentSite.id),
        supabase.from('cms_posts').select('id', { count: 'exact', head: true }).eq('site_id', currentSite.id),
        supabase.from('cms_media').select('id', { count: 'exact', head: true }).eq('site_id', currentSite.id),
        supabase.from('cms_site_members').select('id', { count: 'exact', head: true }).eq('site_id', currentSite.id),
      ]);

      setStats({
        pages: pagesRes.count || 0,
        posts: postsRes.count || 0,
        media: mediaRes.count || 0,
        users: usersRes.count || 0,
      });
    };

    fetchStats();
  }, [currentSite]);

  const statCards = [
    { title: 'Pages', value: stats.pages, icon: FileText, color: 'text-blue-500', href: '/cms/pages' },
    { title: 'Posts', value: stats.posts, icon: Layers, color: 'text-green-500', href: '/cms/posts' },
    { title: 'Media Files', value: stats.media, icon: Image, color: 'text-purple-500', href: '/cms/media' },
    { title: 'Team Members', value: stats.users, icon: Users, color: 'text-orange-500', href: '/cms/users' },
  ];

  if (isLoading) {
    return (
      <CMSLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </CMSLayout>
    );
  }

  if (!currentSite) {
    return (
      <CMSLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <Globe className="w-16 h-16 text-muted-foreground mb-6" />
          <h1 className="font-heading text-3xl font-bold mb-4">Setting up your CMS</h1>
          <p className="text-muted-foreground">
            Please wait while we initialize your website...
          </p>
        </div>
      </CMSLayout>
    );
  }

  return (
    <CMSLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's an overview of your website
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/cms/pages/new">
              <Button variant="outline" className="gap-2">
                <FileText className="w-4 h-4" />
                New Page
              </Button>
            </Link>
            <Link to="/cms/posts/new">
              <Button className="gap-2">
                <Layers className="w-4 h-4" />
                New Post
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <Link key={stat.title} to={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* MySQL Connection Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  MySQL Connection
                </CardTitle>
                <CardDescription>
                  Connect to an external MySQL database to sync your content
                </CardDescription>
              </div>
              {currentSite.is_mysql_connected ? (
                <span className="flex items-center gap-2 text-sm text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  Connected
                </span>
              ) : (
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-2 h-2 bg-muted rounded-full" />
                  Not Connected
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {currentSite.is_mysql_connected ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Connected to: <strong>{currentSite.mysql_host}</strong>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Database: <strong>{currentSite.mysql_database}</strong>
                  </p>
                </div>
                <Link to="/cms/database">
                  <Button variant="outline" className="gap-2">
                    Manage Connection
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <Link to="/cms/database">
                <Button className="gap-2">
                  <Database className="w-4 h-4" />
                  Connect MySQL Database
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/cms/pages"
              className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <FileText className="w-5 h-5 text-primary" />
              <span className="font-medium">Manage Pages</span>
            </Link>
            <Link
              to="/cms/posts"
              className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <Layers className="w-5 h-5 text-primary" />
              <span className="font-medium">Manage Posts</span>
            </Link>
            <Link
              to="/cms/media"
              className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <Image className="w-5 h-5 text-primary" />
              <span className="font-medium">Media Library</span>
            </Link>
            <Link
              to="/cms/settings"
              className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <Globe className="w-5 h-5 text-primary" />
              <span className="font-medium">Site Settings</span>
            </Link>
          </CardContent>
        </Card>
      </div>
    </CMSLayout>
  );
};

export default CMSDashboard;
