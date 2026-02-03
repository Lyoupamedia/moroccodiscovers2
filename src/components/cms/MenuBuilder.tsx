import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus, Save, Menu as MenuIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CMSMenu, CMSMenuItem, CMSPage, CMSPost } from '@/types/cms';
import { SortableMenuItem } from './SortableMenuItem';
import { MenuItemEditor } from './MenuItemEditor';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useCMSSite } from '@/hooks/useCMSSite';

const MENU_LOCATIONS = [
  { value: 'primary', label: 'Primary Navigation' },
  { value: 'footer', label: 'Footer Menu' },
  { value: 'mobile', label: 'Mobile Menu' },
  { value: 'sidebar', label: 'Sidebar Menu' },
];

export const MenuBuilder = () => {
  const { currentSite } = useCMSSite();
  const [menus, setMenus] = useState<CMSMenu[]>([]);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [menuName, setMenuName] = useState('');
  const [menuLocation, setMenuLocation] = useState('primary');
  const [menuItems, setMenuItems] = useState<CMSMenuItem[]>([]);
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [posts, setPosts] = useState<CMSPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CMSMenuItem | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (currentSite) {
      fetchData();
    }
  }, [currentSite]);

  const fetchData = async () => {
    if (!currentSite) return;
    setIsLoading(true);

    try {
      const [menusRes, pagesRes, postsRes] = await Promise.all([
        supabase
          .from('cms_menus')
          .select('*')
          .eq('site_id', currentSite.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('cms_pages')
          .select('*')
          .eq('site_id', currentSite.id)
          .eq('status', 'published'),
        supabase
          .from('cms_posts')
          .select('*')
          .eq('site_id', currentSite.id)
          .eq('status', 'published'),
      ]);

      if (menusRes.error) throw menusRes.error;
      if (pagesRes.error) throw pagesRes.error;
      if (postsRes.error) throw postsRes.error;

      const formattedMenus: CMSMenu[] = (menusRes.data || []).map(menu => ({
        id: menu.id,
        site_id: menu.site_id,
        name: menu.name,
        location: menu.location || 'primary',
        items: (menu.items as unknown as CMSMenuItem[]) || [],
        created_at: menu.created_at,
        updated_at: menu.updated_at,
      }));

      setMenus(formattedMenus);
      setPages(pagesRes.data as unknown as CMSPage[] || []);
      setPosts(postsRes.data as unknown as CMSPost[] || []);

      // Auto-select first menu if available
      if (formattedMenus.length > 0 && !selectedMenuId) {
        selectMenu(formattedMenus[0]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load menus');
    } finally {
      setIsLoading(false);
    }
  };

  const selectMenu = (menu: CMSMenu) => {
    setSelectedMenuId(menu.id);
    setMenuName(menu.name);
    setMenuLocation(menu.location);
    setMenuItems(menu.items || []);
  };

  const handleNewMenu = () => {
    setSelectedMenuId(null);
    setMenuName('');
    setMenuLocation('primary');
    setMenuItems([]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setMenuItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setIsEditorOpen(true);
  };

  const handleEditItem = (item: CMSMenuItem) => {
    setEditingItem(item);
    setIsEditorOpen(true);
  };

  const handleDeleteItem = (itemId: string) => {
    setMenuItems((items) => items.filter((i) => i.id !== itemId));
    toast.success('Menu item removed');
  };

  const handleSaveItem = (item: CMSMenuItem) => {
    if (editingItem) {
      setMenuItems((items) =>
        items.map((i) => (i.id === item.id ? item : i))
      );
      toast.success('Menu item updated');
    } else {
      setMenuItems((items) => [...items, item]);
      toast.success('Menu item added');
    }
  };

  const handleSaveMenu = async () => {
    if (!currentSite || !menuName.trim()) {
      toast.error('Please enter a menu name');
      return;
    }

    setIsSaving(true);

    try {
      const menuData = {
        site_id: currentSite.id,
        name: menuName,
        location: menuLocation,
        items: menuItems as unknown as any,
      };

      if (selectedMenuId) {
        const { error } = await supabase
          .from('cms_menus')
          .update(menuData)
          .eq('id', selectedMenuId);

        if (error) throw error;
        toast.success('Menu updated successfully');
      } else {
        const { data, error } = await supabase
          .from('cms_menus')
          .insert(menuData)
          .select()
          .single();

        if (error) throw error;
        setSelectedMenuId(data.id);
        toast.success('Menu created successfully');
      }

      fetchData();
    } catch (error) {
      console.error('Error saving menu:', error);
      toast.error('Failed to save menu');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMenu = async () => {
    if (!selectedMenuId) return;

    try {
      const { error } = await supabase
        .from('cms_menus')
        .delete()
        .eq('id', selectedMenuId);

      if (error) throw error;
      toast.success('Menu deleted successfully');
      handleNewMenu();
      fetchData();
    } catch (error) {
      console.error('Error deleting menu:', error);
      toast.error('Failed to delete menu');
    }
  };

  if (!currentSite) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Please select a site first</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar - Menu List */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Your Menus</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button onClick={handleNewMenu} variant="outline" className="w-full justify-start">
              <Plus className="w-4 h-4 mr-2" />
              Create New Menu
            </Button>
            <div className="space-y-1 mt-4">
              {menus.map((menu) => (
                <button
                  key={menu.id}
                  onClick={() => selectMenu(menu)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    selectedMenuId === menu.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MenuIcon className="w-4 h-4" />
                    <span className="font-medium">{menu.name}</span>
                  </div>
                  <span className="text-xs opacity-70">{menu.location}</span>
                </button>
              ))}
              {menus.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No menus yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main - Menu Editor */}
      <div className="lg:col-span-3 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedMenuId ? 'Edit Menu' : 'Create New Menu'}
            </CardTitle>
            <CardDescription>
              Configure your menu settings and add items
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="menuName">Menu Name</Label>
                <Input
                  id="menuName"
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  placeholder="e.g., Main Navigation"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="menuLocation">Location</Label>
                <Select value={menuLocation} onValueChange={setMenuLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {MENU_LOCATIONS.map((loc) => (
                      <SelectItem key={loc.value} value={loc.value}>
                        {loc.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Menu Items</CardTitle>
              <CardDescription>
                Drag and drop to reorder items
              </CardDescription>
            </div>
            <Button onClick={handleAddItem}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent>
            {menuItems.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <MenuIcon className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No menu items yet</p>
                <Button variant="outline" className="mt-4" onClick={handleAddItem}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Item
                </Button>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={menuItems.map((i) => i.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {menuItems.map((item) => (
                    <SortableMenuItem
                      key={item.id}
                      item={item}
                      onEdit={handleEditItem}
                      onDelete={handleDeleteItem}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          {selectedMenuId && (
            <Button variant="destructive" onClick={handleDeleteMenu}>
              Delete Menu
            </Button>
          )}
          <div className="ml-auto">
            <Button onClick={handleSaveMenu} disabled={isSaving || !menuName.trim()}>
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {selectedMenuId ? 'Update Menu' : 'Save Menu'}
            </Button>
          </div>
        </div>
      </div>

      <MenuItemEditor
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        item={editingItem}
        pages={pages}
        posts={posts}
        onSave={handleSaveItem}
      />
    </div>
  );
};
