import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CMSLayout } from '@/components/cms/CMSLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCMSSite } from '@/hooks/useCMSSite';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Loader2, ArrowLeft, Save, Eye } from 'lucide-react';
import type { CMSPage } from '@/types/cms';

const CMSPageEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentSite } = useCMSSite();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image_url: '',
    status: 'draft' as 'draft' | 'published' | 'scheduled' | 'trash',
    template: 'default',
    meta_title: '',
    meta_description: '',
  });

  useEffect(() => {
    if (isEditing && currentSite) {
      fetchPage();
    }
  }, [id, currentSite]);

  const fetchPage = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('cms_pages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching page:', error);
      toast({
        title: 'Error',
        description: 'Failed to load page',
        variant: 'destructive',
      });
      navigate('/cms/pages');
    } else {
      const page = data as unknown as CMSPage;
      setFormData({
        title: page.title,
        slug: page.slug,
        content: page.content || '',
        excerpt: page.excerpt || '',
        featured_image_url: page.featured_image_url || '',
        status: page.status,
        template: page.template,
        meta_title: page.meta_title || '',
        meta_description: page.meta_description || '',
      });
    }
    setIsLoading(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: prev.slug || value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    }));
  };

  const handleSave = async (publish = false) => {
    if (!currentSite || !user) return;

    if (!formData.title.trim() || !formData.slug.trim()) {
      toast({
        title: 'Error',
        description: 'Title and slug are required',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    const pageData = {
      ...formData,
      site_id: currentSite.id,
      status: publish ? 'published' : formData.status,
      published_at: publish ? new Date().toISOString() : null,
    };

    let error;
    if (isEditing) {
      const result = await supabase
        .from('cms_pages')
        .update(pageData)
        .eq('id', id);
      error = result.error;
    } else {
      const result = await supabase
        .from('cms_pages')
        .insert(pageData);
      error = result.error;
    }

    if (error) {
      console.error('Save error:', error);
      toast({
        title: 'Error',
        description: 'Failed to save page',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: isEditing ? 'Page updated successfully' : 'Page created successfully',
      });
      navigate('/cms/pages');
    }

    setIsSaving(false);
  };

  if (!currentSite) {
    return (
      <CMSLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Please select a site first</p>
        </div>
      </CMSLayout>
    );
  }

  if (isLoading) {
    return (
      <CMSLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </CMSLayout>
    );
  }

  return (
    <CMSLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/cms/pages')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">
                {isEditing ? 'Edit Page' : 'New Page'}
              </h1>
              <p className="text-muted-foreground text-sm">
                {isEditing ? 'Update your page content' : 'Create a new page for your site'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleSave(false)} disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Draft
            </Button>
            <Button onClick={() => handleSave(true)} disabled={isSaving}>
              <Eye className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Page title"
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">/</span>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => handleChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                      placeholder="page-slug"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleChange('content', e.target.value)}
                    placeholder="Write your page content here..."
                    className="min-h-[300px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Supports HTML and basic formatting
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleChange('excerpt', e.target.value)}
                    placeholder="A brief summary of the page..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => handleChange('meta_title', e.target.value)}
                    placeholder="SEO title (defaults to page title)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => handleChange('meta_description', e.target.value)}
                    placeholder="SEO description for search engines..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Template</Label>
                  <Select
                    value={formData.template}
                    onValueChange={(value) => handleChange('template', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="full-width">Full Width</SelectItem>
                      <SelectItem value="sidebar">With Sidebar</SelectItem>
                      <SelectItem value="landing">Landing Page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={formData.featured_image_url}
                  onChange={(url) => handleChange('featured_image_url', url)}
                  folder={currentSite.id}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CMSLayout>
  );
};

export default CMSPageEditor;
