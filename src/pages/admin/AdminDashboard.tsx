import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, FileText, Send, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    destinations: 0,
    blogs: 0,
    tripRequests: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [destinationsRes, blogsRes, tripsRes] = await Promise.all([
        supabase.from('destinations').select('id', { count: 'exact', head: true }),
        supabase.from('blogs').select('id', { count: 'exact', head: true }),
        supabase.from('trip_requests').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        destinations: destinationsRes.count || 0,
        blogs: blogsRes.count || 0,
        tripRequests: tripsRes.count || 0,
      });
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Destinations', value: stats.destinations, icon: MapPin, color: 'text-blue-500' },
    { title: 'Blog Posts', value: stats.blogs, icon: FileText, color: 'text-green-500' },
    { title: 'Trip Requests', value: stats.tripRequests, icon: Send, color: 'text-orange-500' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to your admin dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((stat) => (
            <Card key={stat.title}>
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
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/admin/destinations"
              className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <MapPin className="w-5 h-5 text-primary" />
              <span className="font-medium">Manage Destinations</span>
            </a>
            <a
              href="/admin/blogs"
              className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <FileText className="w-5 h-5 text-primary" />
              <span className="font-medium">Manage Blogs</span>
            </a>
            <a
              href="/admin/integrations"
              className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <Eye className="w-5 h-5 text-primary" />
              <span className="font-medium">Analytics & Ads</span>
            </a>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <Eye className="w-5 h-5 text-primary" />
              <span className="font-medium">View Website</span>
            </a>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
