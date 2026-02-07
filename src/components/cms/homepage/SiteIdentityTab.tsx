import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface SiteIdentityTabProps {
  settings: {
    site_name: string;
    site_tagline: string;
    site_description: string;
    site_logo_url: string;
  };
  siteId: string;
  onChange: (field: string, value: string) => void;
}

export const SiteIdentityTab = ({ settings, siteId, onChange }: SiteIdentityTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Site Identity</CardTitle>
          <CardDescription>Basic information about your website</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site_name">Website Name</Label>
            <Input
              id="site_name"
              value={settings.site_name}
              onChange={(e) => onChange('site_name', e.target.value)}
              placeholder="Morocco Discovers"
            />
            <p className="text-xs text-muted-foreground">
              Your website name displayed in the header and footer
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="site_tagline">Tagline</Label>
            <Input
              id="site_tagline"
              value={settings.site_tagline}
              onChange={(e) => onChange('site_tagline', e.target.value)}
              placeholder="Your gateway to authentic Moroccan experiences"
            />
            <p className="text-xs text-muted-foreground">
              A short phrase describing your website
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="site_description">Site Description</Label>
            <Textarea
              id="site_description"
              value={settings.site_description}
              onChange={(e) => onChange('site_description', e.target.value)}
              placeholder="From ancient medinas to golden dunes, we craft unforgettable journeys..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              A longer description used in the footer and meta tags
            </p>
          </div>

          <div className="space-y-2">
            <Label>Site Logo</Label>
            <ImageUpload
              value={settings.site_logo_url}
              onChange={(url) => onChange('site_logo_url', url)}
              folder={siteId}
            />
            <p className="text-xs text-muted-foreground">
              Your logo displayed in the header. Recommended: PNG or SVG
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
