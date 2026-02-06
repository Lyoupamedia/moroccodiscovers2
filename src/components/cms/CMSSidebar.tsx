import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Image,
  Settings,
  Database,
  Menu,
  Users,
  Globe,
  ChevronLeft,
  Menu as MenuIcon,
  Layers,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { title: 'Dashboard', href: '/cms', icon: LayoutDashboard },
  { title: 'Homepage', href: '/cms/homepage', icon: Globe },
  { title: 'Pages', href: '/cms/pages', icon: FileText },
  { title: 'Posts', href: '/cms/posts', icon: Layers },
  { title: 'Media', href: '/cms/media', icon: Image },
  { title: 'Menus', href: '/cms/menus', icon: Menu },
  { title: 'Users', href: '/cms/users', icon: Users },
  { title: 'MySQL', href: '/cms/database', icon: Database },
  { title: 'Export', href: '/cms/export', icon: Download },
  { title: 'Settings', href: '/cms/settings', icon: Settings },
];

export const CMSSidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => {
    if (path === '/cms') {
      return location.pathname === '/cms';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={cn(
        "bg-card border-r border-border min-h-screen flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <Link to="/cms" className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-primary" />
              <span className="font-heading text-xl font-bold">CMS</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="shrink-0"
          >
            {collapsed ? <MenuIcon className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
              isActive(item.href)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="font-medium">{item.title}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        {!collapsed && (
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← View Website
          </Link>
        )}
      </div>
    </aside>
  );
};
