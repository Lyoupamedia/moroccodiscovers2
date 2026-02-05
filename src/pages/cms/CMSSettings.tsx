import { useState, useEffect } from 'react';
import { CMSLayout } from '@/components/cms/CMSLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCMSSite } from '@/hooks/useCMSSite';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Loader2, Globe, Palette, Code } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeSelector } from '@/components/cms/ThemeSelector';
import { getThemeById } from '@/config/themes';

const CMSSettings = () => {
  const { currentSite, updateSite } = useCMSSite();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: currentSite?.name || '',
    slug: currentSite?.slug || '',
    site_title: currentSite?.site_title || '',
    site_tagline: currentSite?.site_tagline || '',
    site_logo_url: currentSite?.site_logo_url || '',
    site_favicon_url: currentSite?.site_favicon_url || '',
    theme: currentSite?.theme || 'default',
    custom_css: currentSite?.custom_css || '',
  });

  // Sync form data when currentSite changes
  useEffect(() => {
    if (currentSite) {
      setFormData({
        name: currentSite.name || '',
        slug: currentSite.slug || '',
        site_title: currentSite.site_title || '',
        site_tagline: currentSite.site_tagline || '',
        site_logo_url: currentSite.site_logo_url || '',
        site_favicon_url: currentSite.site_favicon_url || '',
        theme: currentSite.theme || 'default',
        custom_css: currentSite.custom_css || '',
      });
    }
  }, [currentSite]);

  const selectedTheme = getThemeById(formData.theme);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!currentSite) return;

    setIsLoading(true);

    const success = await updateSite(formData);

    if (success) {
      toast({
        title: 'Settings Saved',
        description: 'Your site settings have been updated',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
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

  return (
    <CMSLayout>
      <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Site Settings</h1>
            <p className="text-muted-foreground mt-1">Configure your website settings</p>
          </div>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general" className="gap-2">
              <Globe className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="branding" className="gap-2">
              <Palette className="w-4 h-4" />
              Branding
            </TabsTrigger>
            <TabsTrigger value="advanced" className="gap-2">
              <Code className="w-4 h-4" />
              Advanced
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic information about your website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Site Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="My Awesome Website"
                  />
                  <p className="text-xs text-muted-foreground">
                    Internal name for your site in the dashboard
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Site Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                    placeholder="my-site"
                  />
                  <p className="text-xs text-muted-foreground">
                    URL-friendly identifier for your site
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="site_title">Site Title</Label>
                  <Input
                    id="site_title"
                    value={formData.site_title}
                    onChange={(e) => handleChange('site_title', e.target.value)}
                    placeholder="My Website - Your Tagline Here"
                  />
                  <p className="text-xs text-muted-foreground">
                    Appears in browser tabs and search results
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="site_tagline">Tagline</Label>
                  <Input
                    id="site_tagline"
                    value={formData.site_tagline}
                    onChange={(e) => handleChange('site_tagline', e.target.value)}
                    placeholder="A short description of your site"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branding Settings */}
          <TabsContent value="branding">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Logo & Favicon</CardTitle>
                  <CardDescription>Upload your brand assets</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Site Logo</Label>
                      <ImageUpload
                        value={formData.site_logo_url}
                        onChange={(url) => handleChange('site_logo_url', url)}
                        folder={currentSite.id}
                      />
                      <p className="text-xs text-muted-foreground">
                        Recommended: PNG or SVG, at least 200px wide
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Favicon</Label>
                      <ImageUpload
                        value={formData.site_favicon_url}
                        onChange={(url) => handleChange('site_favicon_url', url)}
                        folder={currentSite.id}
                      />
                      <p className="text-xs text-muted-foreground">
                        Recommended: Square image, 32x32 or 64x64 pixels
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Theme</CardTitle>
                  <CardDescription>
                    Choose a color theme for your website
                    {selectedTheme && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        Current: {selectedTheme.name}
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ThemeSelector
                    selectedTheme={formData.theme}
                    onSelectTheme={(themeId) => handleChange('theme', themeId)}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Advanced Settings */}
          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>Custom CSS and advanced configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="custom_css">Custom CSS</Label>
                  <Textarea
                    id="custom_css"
                    value={formData.custom_css}
                    onChange={(e) => handleChange('custom_css', e.target.value)}
                    placeholder="/* Add your custom CSS here */"
                    className="font-mono text-sm min-h-[200px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Add custom CSS to style your site
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </CMSLayout>
  );
};

export default CMSSettings;
