import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface SEOTabProps {
  settings: {
    seo_meta_title: string;
    seo_meta_description: string;
    seo_keywords: string;
    seo_og_title: string;
    seo_og_description: string;
    seo_og_image_url: string;
    seo_twitter_title: string;
    seo_twitter_description: string;
    seo_twitter_image_url: string;
  };
  siteId: string;
  onChange: (field: string, value: string) => void;
}

export const SEOTab = ({ settings, siteId, onChange }: SEOTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic SEO</CardTitle>
          <CardDescription>Search engine optimization settings for your homepage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seo_meta_title">Meta Title</Label>
            <Input
              id="seo_meta_title"
              value={settings.seo_meta_title}
              onChange={(e) => onChange('seo_meta_title', e.target.value)}
              placeholder="Morocco Discovers - Authentic Moroccan Travel Experiences"
            />
            <p className="text-xs text-muted-foreground">
              Recommended: 50-60 characters. Current: {settings.seo_meta_title.length} characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo_meta_description">Meta Description</Label>
            <Textarea
              id="seo_meta_description"
              value={settings.seo_meta_description}
              onChange={(e) => onChange('seo_meta_description', e.target.value)}
              placeholder="Discover Morocco with our expertly crafted travel experiences. From Sahara desert adventures to ancient medina tours..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Recommended: 150-160 characters. Current: {settings.seo_meta_description.length} characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo_keywords">Keywords</Label>
            <Input
              id="seo_keywords"
              value={settings.seo_keywords}
              onChange={(e) => onChange('seo_keywords', e.target.value)}
              placeholder="morocco travel, sahara tours, marrakech, fes, moroccan adventure"
            />
            <p className="text-xs text-muted-foreground">
              Comma-separated keywords relevant to your site
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Open Graph (Facebook, LinkedIn)</CardTitle>
          <CardDescription>How your site appears when shared on social media</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seo_og_title">OG Title</Label>
            <Input
              id="seo_og_title"
              value={settings.seo_og_title}
              onChange={(e) => onChange('seo_og_title', e.target.value)}
              placeholder="Morocco Discovers - Your Gateway to Morocco"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo_og_description">OG Description</Label>
            <Textarea
              id="seo_og_description"
              value={settings.seo_og_description}
              onChange={(e) => onChange('seo_og_description', e.target.value)}
              placeholder="Embark on an unforgettable journey through Morocco's ancient medinas, majestic mountains, and golden Sahara dunes."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>OG Image</Label>
            <ImageUpload
              value={settings.seo_og_image_url}
              onChange={(url) => onChange('seo_og_image_url', url)}
              folder={siteId}
            />
            <p className="text-xs text-muted-foreground">
              Recommended: 1200 x 630 pixels for best display on social media
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Twitter Card</CardTitle>
          <CardDescription>How your site appears when shared on Twitter/X</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seo_twitter_title">Twitter Title</Label>
            <Input
              id="seo_twitter_title"
              value={settings.seo_twitter_title}
              onChange={(e) => onChange('seo_twitter_title', e.target.value)}
              placeholder="Morocco Discovers"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo_twitter_description">Twitter Description</Label>
            <Textarea
              id="seo_twitter_description"
              value={settings.seo_twitter_description}
              onChange={(e) => onChange('seo_twitter_description', e.target.value)}
              placeholder="Discover the magic of Morocco with our authentic travel experiences."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Twitter Image</Label>
            <ImageUpload
              value={settings.seo_twitter_image_url}
              onChange={(url) => onChange('seo_twitter_image_url', url)}
              folder={siteId}
            />
            <p className="text-xs text-muted-foreground">
              Recommended: 1200 x 628 pixels (or use OG image)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
