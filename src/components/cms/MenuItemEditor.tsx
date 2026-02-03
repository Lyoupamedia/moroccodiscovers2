import { useState } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CMSMenuItem, CMSPage, CMSPost } from '@/types/cms';

interface MenuItemEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: CMSMenuItem | null;
  pages: CMSPage[];
  posts: CMSPost[];
  onSave: (item: CMSMenuItem) => void;
}

export const MenuItemEditor = ({
  open,
  onOpenChange,
  item,
  pages,
  posts,
  onSave,
}: MenuItemEditorProps) => {
  const [label, setLabel] = useState(item?.label || '');
  const [url, setUrl] = useState(item?.url || '');
  const [type, setType] = useState<CMSMenuItem['type']>(item?.type || 'custom');
  const [target, setTarget] = useState<CMSMenuItem['target']>(item?.target || '_self');
  const [selectedPageId, setSelectedPageId] = useState('');
  const [selectedPostId, setSelectedPostId] = useState('');

  const handleTypeChange = (newType: CMSMenuItem['type']) => {
    setType(newType);
    if (newType === 'page' && pages.length > 0) {
      const page = pages[0];
      setSelectedPageId(page.id);
      setLabel(page.title);
      setUrl(`/${page.slug}`);
    } else if (newType === 'post' && posts.length > 0) {
      const post = posts[0];
      setSelectedPostId(post.id);
      setLabel(post.title);
      setUrl(`/blog/${post.slug}`);
    } else if (newType === 'custom') {
      setUrl('');
      setLabel('');
    }
  };

  const handlePageSelect = (pageId: string) => {
    setSelectedPageId(pageId);
    const page = pages.find(p => p.id === pageId);
    if (page) {
      setLabel(page.title);
      setUrl(`/${page.slug}`);
    }
  };

  const handlePostSelect = (postId: string) => {
    setSelectedPostId(postId);
    const post = posts.find(p => p.id === postId);
    if (post) {
      setLabel(post.title);
      setUrl(`/blog/${post.slug}`);
    }
  };

  const handleSave = () => {
    const menuItem: CMSMenuItem = {
      id: item?.id || crypto.randomUUID(),
      label,
      url,
      type,
      target,
      children: item?.children || [],
    };
    onSave(menuItem);
    onOpenChange(false);
  };

  const resetForm = () => {
    setLabel(item?.label || '');
    setUrl(item?.url || '');
    setType(item?.type || 'custom');
    setTarget(item?.target || '_self');
    setSelectedPageId('');
    setSelectedPostId('');
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
          <DialogDescription>
            Configure the menu item properties
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="type">Link Type</Label>
            <Select value={type} onValueChange={(v) => handleTypeChange(v as CMSMenuItem['type'])}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom URL</SelectItem>
                <SelectItem value="page">Page</SelectItem>
                <SelectItem value="post">Post</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === 'page' && (
            <div className="grid gap-2">
              <Label htmlFor="page">Select Page</Label>
              <Select value={selectedPageId} onValueChange={handlePageSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a page" />
                </SelectTrigger>
                <SelectContent>
                  {pages.map((page) => (
                    <SelectItem key={page.id} value={page.id}>
                      {page.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {type === 'post' && (
            <div className="grid gap-2">
              <Label htmlFor="post">Select Post</Label>
              <Select value={selectedPostId} onValueChange={handlePostSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a post" />
                </SelectTrigger>
                <SelectContent>
                  {posts.map((post) => (
                    <SelectItem key={post.id} value={post.id}>
                      {post.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Menu item text"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com or /page-slug"
              disabled={type === 'page' || type === 'post'}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="target">Open In</Label>
            <Select value={target} onValueChange={(v) => setTarget(v as CMSMenuItem['target'])}>
              <SelectTrigger>
                <SelectValue placeholder="Select target" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_self">Same Window</SelectItem>
                <SelectItem value="_blank">New Tab</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!label || !url}>
            {item ? 'Update' : 'Add'} Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
