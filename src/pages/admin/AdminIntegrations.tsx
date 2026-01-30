import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save, Code, BarChart3, Search, Facebook } from 'lucide-react';

interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string | null;
  description: string | null;
}

const AdminIntegrations = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({
    google_adsense_code: '',
    google_analytics_id: '',
    google_tag_manager_id: '',
    google_search_console: '',
    facebook_pixel_id: '',
    ads_enabled: 'false',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) throw error;

      const settingsMap: Record<string, string> = {};
      data?.forEach((setting: SiteSetting) => {
        settingsMap[setting.setting_key] = setting.setting_value || '';
      });

      setSettings(prev => ({ ...prev, ...settingsMap }));
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        setting_key: key,
        setting_value: value,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('site_settings')
          .update({ setting_value: update.setting_value })
          .eq('setting_key', update.setting_key);

        if (error) throw error;
      }

      toast({
        title: "Settings Saved",
        description: "Your integrations have been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Make sure you have admin privileges.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Integrations</h1>
            <p className="text-muted-foreground mt-1">Manage analytics, ads, and third-party integrations</p>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save All
              </>
            )}
          </Button>
        </div>

        {/* Google AdSense */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Code className="w-6 h-6 text-primary" />
              <div>
                <CardTitle>Google AdSense</CardTitle>
                <CardDescription>Add your AdSense code to display ads on your website</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={settings.ads_enabled === 'true'}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, ads_enabled: checked ? 'true' : 'false' }))
                }
              />
              <Label>Enable Ads</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="adsense">AdSense Head Code</Label>
              <Textarea
                id="adsense"
                placeholder="Paste your AdSense script code here..."
                value={settings.google_adsense_code}
                onChange={(e) => setSettings(prev => ({ ...prev, google_adsense_code: e.target.value }))}
                rows={6}
                className="font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground">
                This code will be injected into the {'<head>'} of your website
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Google Analytics */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-blue-500" />
              <div>
                <CardTitle>Google Analytics</CardTitle>
                <CardDescription>Track your website visitors and behavior</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ga">Measurement ID</Label>
              <Input
                id="ga"
                placeholder="G-XXXXXXXXXX"
                value={settings.google_analytics_id}
                onChange={(e) => setSettings(prev => ({ ...prev, google_analytics_id: e.target.value }))}
              />
              <p className="text-sm text-muted-foreground">
                Find this in your Google Analytics 4 property settings
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Google Tag Manager */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Code className="w-6 h-6 text-yellow-500" />
              <div>
                <CardTitle>Google Tag Manager</CardTitle>
                <CardDescription>Manage all your tracking tags in one place</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gtm">Container ID</Label>
              <Input
                id="gtm"
                placeholder="GTM-XXXXXXX"
                value={settings.google_tag_manager_id}
                onChange={(e) => setSettings(prev => ({ ...prev, google_tag_manager_id: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Google Search Console */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Search className="w-6 h-6 text-green-500" />
              <div>
                <CardTitle>Google Search Console</CardTitle>
                <CardDescription>Verify your site ownership for SEO insights</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gsc">Verification Meta Tag</Label>
              <Input
                id="gsc"
                placeholder="<meta name='google-site-verification' content='...' />"
                value={settings.google_search_console}
                onChange={(e) => setSettings(prev => ({ ...prev, google_search_console: e.target.value }))}
              />
              <p className="text-sm text-muted-foreground">
                Paste the full meta tag or just the content value
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Facebook Pixel */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Facebook className="w-6 h-6 text-blue-600" />
              <div>
                <CardTitle>Facebook Pixel</CardTitle>
                <CardDescription>Track conversions and build audiences for Facebook Ads</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fbpixel">Pixel ID</Label>
              <Input
                id="fbpixel"
                placeholder="XXXXXXXXXXXXXXXX"
                value={settings.facebook_pixel_id}
                onChange={(e) => setSettings(prev => ({ ...prev, facebook_pixel_id: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminIntegrations;
