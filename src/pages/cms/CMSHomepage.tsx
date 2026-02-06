import { useState, useEffect } from 'react';
import { CMSLayout } from '@/components/cms/CMSLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Loader2, Home, Sparkles, Phone, Share2, LayoutTemplate, MapPin, Star, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useCMSSite } from '@/hooks/useCMSSite';
import { Switch } from '@/components/ui/switch';

interface HomepageSettings {
  // Hero Section
  hero_badge_text: string;
  hero_title_line1: string;
  hero_title_highlight: string;
  hero_title_line2: string;
  hero_subtitle: string;
  hero_image_url: string;
  hero_cta_primary_text: string;
  hero_cta_secondary_text: string;
  
  // Stats
  stats_destinations_value: string;
  stats_destinations_label: string;
  stats_rating_value: string;
  stats_rating_label: string;
  stats_travelers_value: string;
  stats_travelers_label: string;
  
  // CTA Section
  cta_title: string;
  cta_subtitle: string;
  cta_primary_button_text: string;
  cta_secondary_button_text: string;
  
  // Contact Info
  contact_email: string;
  contact_phone: string;
  contact_whatsapp: string;
  contact_address: string;
  contact_business_hours: string;
  
  // Social Links
  social_facebook: string;
  social_instagram: string;
  social_twitter: string;
  social_youtube: string;
  social_tiktok: string;
  social_linkedin: string;
  
  // Section Visibility
  section_destinations_visible: boolean;
  section_experiences_visible: boolean;
  section_why_morocco_visible: boolean;
  section_testimonials_visible: boolean;
  section_travel_essentials_visible: boolean;
  section_blogs_visible: boolean;
  section_cta_visible: boolean;
}

const defaultSettings: HomepageSettings = {
  hero_badge_text: 'Discover the Magic of North Africa',
  hero_title_line1: 'Experience the',
  hero_title_highlight: 'Enchanting',
  hero_title_line2: 'Kingdom of Morocco',
  hero_subtitle: 'From the golden dunes of the Sahara to the blue streets of Chefchaouen, embark on an unforgettable journey through ancient medinas, majestic mountains, and vibrant souks.',
  hero_image_url: '',
  hero_cta_primary_text: 'Explore Destinations',
  hero_cta_secondary_text: 'View Experiences',
  
  stats_destinations_value: '12+',
  stats_destinations_label: 'Destinations',
  stats_rating_value: '4.9',
  stats_rating_label: 'Rating',
  stats_travelers_value: '10K+',
  stats_travelers_label: 'Happy Travelers',
  
  cta_title: 'Ready to Discover Morocco?',
  cta_subtitle: 'Let us craft your perfect Moroccan adventure. Our travel experts are here to help you create memories that last a lifetime.',
  cta_primary_button_text: 'Get a Free Quote',
  cta_secondary_button_text: 'Call Us Now',
  
  contact_email: 'info@moroccodiscovers.com',
  contact_phone: '+34 666 003 838',
  contact_whatsapp: '34666003838',
  contact_address: 'Palma de Mallorca, Spain',
  contact_business_hours: 'Mon - Fri: 9:00 - 18:00 CET',
  
  social_facebook: '',
  social_instagram: '',
  social_twitter: '',
  social_youtube: '',
  social_tiktok: '',
  social_linkedin: '',
  
  section_destinations_visible: true,
  section_experiences_visible: true,
  section_why_morocco_visible: true,
  section_testimonials_visible: true,
  section_travel_essentials_visible: true,
  section_blogs_visible: true,
  section_cta_visible: true,
};

const CMSHomepage = () => {
  const { currentSite } = useCMSSite();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [settings, setSettings] = useState<HomepageSettings>(defaultSettings);

  useEffect(() => {
    if (currentSite) {
      fetchSettings();
    }
  }, [currentSite]);

  const fetchSettings = async () => {
    if (!currentSite) return;
    
    setIsFetching(true);
    try {
      const { data, error } = await supabase
        .from('cms_site_settings')
        .select('setting_key, setting_value')
        .eq('site_id', currentSite.id)
        .like('setting_key', 'homepage_%');

      if (error) throw error;

      if (data && data.length > 0) {
        const fetchedSettings = { ...defaultSettings };
        data.forEach((item) => {
          const key = item.setting_key.replace('homepage_', '') as keyof HomepageSettings;
          if (key in fetchedSettings) {
            if (typeof fetchedSettings[key] === 'boolean') {
              (fetchedSettings[key] as boolean) = item.setting_value === 'true';
            } else {
              (fetchedSettings[key] as string) = item.setting_value || '';
            }
          }
        });
        setSettings(fetchedSettings);
      }
    } catch (error) {
      console.error('Error fetching homepage settings:', error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (field: keyof HomepageSettings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!currentSite) return;

    setIsLoading(true);
    try {
      // Prepare upsert data
      const upsertData = Object.entries(settings).map(([key, value]) => ({
        site_id: currentSite.id,
        setting_key: `homepage_${key}`,
        setting_value: String(value),
      }));

      // Delete existing homepage settings and insert new ones
      const { error: deleteError } = await supabase
        .from('cms_site_settings')
        .delete()
        .eq('site_id', currentSite.id)
        .like('setting_key', 'homepage_%');

      if (deleteError) throw deleteError;

      const { error: insertError } = await supabase
        .from('cms_site_settings')
        .insert(upsertData);

      if (insertError) throw insertError;

      toast({
        title: 'Settings Saved',
        description: 'Homepage settings have been updated successfully.',
      });
    } catch (error) {
      console.error('Error saving homepage settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save homepage settings.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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

  if (isFetching) {
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
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Homepage Settings</h1>
            <p className="text-muted-foreground mt-1">Manage all content displayed on your homepage</p>
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

        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="hero" className="gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Hero</span>
            </TabsTrigger>
            <TabsTrigger value="sections" className="gap-2">
              <LayoutTemplate className="w-4 h-4" />
              <span className="hidden sm:inline">Sections</span>
            </TabsTrigger>
            <TabsTrigger value="cta" className="gap-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">CTA</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="gap-2">
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">Contact</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="gap-2">
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Social</span>
            </TabsTrigger>
          </TabsList>

          {/* Hero Section */}
          <TabsContent value="hero" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>The main banner at the top of your homepage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="hero_badge_text">Badge Text</Label>
                  <Input
                    id="hero_badge_text"
                    value={settings.hero_badge_text}
                    onChange={(e) => handleChange('hero_badge_text', e.target.value)}
                    placeholder="Discover the Magic of North Africa"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="hero_title_line1">Title Line 1</Label>
                    <Input
                      id="hero_title_line1"
                      value={settings.hero_title_line1}
                      onChange={(e) => handleChange('hero_title_line1', e.target.value)}
                      placeholder="Experience the"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero_title_highlight">Highlighted Word</Label>
                    <Input
                      id="hero_title_highlight"
                      value={settings.hero_title_highlight}
                      onChange={(e) => handleChange('hero_title_highlight', e.target.value)}
                      placeholder="Enchanting"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero_title_line2">Title Line 2</Label>
                  <Input
                    id="hero_title_line2"
                    value={settings.hero_title_line2}
                    onChange={(e) => handleChange('hero_title_line2', e.target.value)}
                    placeholder="Kingdom of Morocco"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero_subtitle">Subtitle</Label>
                  <Textarea
                    id="hero_subtitle"
                    value={settings.hero_subtitle}
                    onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                    placeholder="From the golden dunes of the Sahara..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Hero Background Image</Label>
                  <ImageUpload
                    value={settings.hero_image_url}
                    onChange={(url) => handleChange('hero_image_url', url)}
                    folder={currentSite.id}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: High-quality landscape image, at least 1920x1080 pixels
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="hero_cta_primary_text">Primary Button Text</Label>
                    <Input
                      id="hero_cta_primary_text"
                      value={settings.hero_cta_primary_text}
                      onChange={(e) => handleChange('hero_cta_primary_text', e.target.value)}
                      placeholder="Explore Destinations"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero_cta_secondary_text">Secondary Button Text</Label>
                    <Input
                      id="hero_cta_secondary_text"
                      value={settings.hero_cta_secondary_text}
                      onChange={(e) => handleChange('hero_cta_secondary_text', e.target.value)}
                      placeholder="View Experiences"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Hero Stats
                </CardTitle>
                <CardDescription>Statistics displayed in the hero section</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="space-y-4 p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="font-medium">Destinations</span>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stats_destinations_value">Value</Label>
                      <Input
                        id="stats_destinations_value"
                        value={settings.stats_destinations_value}
                        onChange={(e) => handleChange('stats_destinations_value', e.target.value)}
                        placeholder="12+"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stats_destinations_label">Label</Label>
                      <Input
                        id="stats_destinations_label"
                        value={settings.stats_destinations_label}
                        onChange={(e) => handleChange('stats_destinations_label', e.target.value)}
                        placeholder="Destinations"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-primary" />
                      <span className="font-medium">Rating</span>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stats_rating_value">Value</Label>
                      <Input
                        id="stats_rating_value"
                        value={settings.stats_rating_value}
                        onChange={(e) => handleChange('stats_rating_value', e.target.value)}
                        placeholder="4.9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stats_rating_label">Label</Label>
                      <Input
                        id="stats_rating_label"
                        value={settings.stats_rating_label}
                        onChange={(e) => handleChange('stats_rating_label', e.target.value)}
                        placeholder="Rating"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="font-medium">Travelers</span>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stats_travelers_value">Value</Label>
                      <Input
                        id="stats_travelers_value"
                        value={settings.stats_travelers_value}
                        onChange={(e) => handleChange('stats_travelers_value', e.target.value)}
                        placeholder="10K+"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stats_travelers_label">Label</Label>
                      <Input
                        id="stats_travelers_label"
                        value={settings.stats_travelers_label}
                        onChange={(e) => handleChange('stats_travelers_label', e.target.value)}
                        placeholder="Happy Travelers"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Section Visibility */}
          <TabsContent value="sections">
            <Card>
              <CardHeader>
                <CardTitle>Section Visibility</CardTitle>
                <CardDescription>Choose which sections to display on your homepage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'section_destinations_visible', label: 'Destinations Section', description: 'Featured travel destinations carousel' },
                  { key: 'section_experiences_visible', label: 'Experiences Section', description: 'Travel experiences and activities' },
                  { key: 'section_why_morocco_visible', label: 'Why Morocco Section', description: 'Reasons to visit Morocco' },
                  { key: 'section_testimonials_visible', label: 'Testimonials Section', description: 'Customer reviews and testimonials' },
                  { key: 'section_travel_essentials_visible', label: 'Travel Essentials Section', description: 'Essential travel information' },
                  { key: 'section_blogs_visible', label: 'Blog Section', description: 'Latest blog posts' },
                  { key: 'section_cta_visible', label: 'Call to Action Section', description: 'Bottom CTA with contact buttons' },
                ].map((section) => (
                  <div key={section.key} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">{section.label}</p>
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                    </div>
                    <Switch
                      checked={settings[section.key as keyof HomepageSettings] as boolean}
                      onCheckedChange={(checked) => handleChange(section.key as keyof HomepageSettings, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* CTA Section */}
          <TabsContent value="cta">
            <Card>
              <CardHeader>
                <CardTitle>Call to Action Section</CardTitle>
                <CardDescription>The bottom section encouraging visitors to take action</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cta_title">Title</Label>
                  <Input
                    id="cta_title"
                    value={settings.cta_title}
                    onChange={(e) => handleChange('cta_title', e.target.value)}
                    placeholder="Ready to Discover Morocco?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cta_subtitle">Subtitle</Label>
                  <Textarea
                    id="cta_subtitle"
                    value={settings.cta_subtitle}
                    onChange={(e) => handleChange('cta_subtitle', e.target.value)}
                    placeholder="Let us craft your perfect Moroccan adventure..."
                    rows={3}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="cta_primary_button_text">Primary Button Text</Label>
                    <Input
                      id="cta_primary_button_text"
                      value={settings.cta_primary_button_text}
                      onChange={(e) => handleChange('cta_primary_button_text', e.target.value)}
                      placeholder="Get a Free Quote"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cta_secondary_button_text">Secondary Button Text</Label>
                    <Input
                      id="cta_secondary_button_text"
                      value={settings.cta_secondary_button_text}
                      onChange={(e) => handleChange('cta_secondary_button_text', e.target.value)}
                      placeholder="Call Us Now"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Info */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Your business contact details displayed across the site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contact_email">Email Address</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={settings.contact_email}
                      onChange={(e) => handleChange('contact_email', e.target.value)}
                      placeholder="info@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_phone">Phone Number</Label>
                    <Input
                      id="contact_phone"
                      value={settings.contact_phone}
                      onChange={(e) => handleChange('contact_phone', e.target.value)}
                      placeholder="+34 666 003 838"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_whatsapp">WhatsApp Number</Label>
                  <Input
                    id="contact_whatsapp"
                    value={settings.contact_whatsapp}
                    onChange={(e) => handleChange('contact_whatsapp', e.target.value)}
                    placeholder="34666003838"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter without + sign, e.g., 34666003838
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_address">Business Address</Label>
                  <Input
                    id="contact_address"
                    value={settings.contact_address}
                    onChange={(e) => handleChange('contact_address', e.target.value)}
                    placeholder="Palma de Mallorca, Spain"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_business_hours">Business Hours</Label>
                  <Input
                    id="contact_business_hours"
                    value={settings.contact_business_hours}
                    onChange={(e) => handleChange('contact_business_hours', e.target.value)}
                    placeholder="Mon - Fri: 9:00 - 18:00 CET"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Links */}
          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>Your social media profiles displayed in the footer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="social_facebook">Facebook</Label>
                    <Input
                      id="social_facebook"
                      value={settings.social_facebook}
                      onChange={(e) => handleChange('social_facebook', e.target.value)}
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social_instagram">Instagram</Label>
                    <Input
                      id="social_instagram"
                      value={settings.social_instagram}
                      onChange={(e) => handleChange('social_instagram', e.target.value)}
                      placeholder="https://instagram.com/yourpage"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="social_twitter">Twitter / X</Label>
                    <Input
                      id="social_twitter"
                      value={settings.social_twitter}
                      onChange={(e) => handleChange('social_twitter', e.target.value)}
                      placeholder="https://twitter.com/yourpage"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social_youtube">YouTube</Label>
                    <Input
                      id="social_youtube"
                      value={settings.social_youtube}
                      onChange={(e) => handleChange('social_youtube', e.target.value)}
                      placeholder="https://youtube.com/c/yourchannel"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="social_tiktok">TikTok</Label>
                    <Input
                      id="social_tiktok"
                      value={settings.social_tiktok}
                      onChange={(e) => handleChange('social_tiktok', e.target.value)}
                      placeholder="https://tiktok.com/@yourpage"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social_linkedin">LinkedIn</Label>
                    <Input
                      id="social_linkedin"
                      value={settings.social_linkedin}
                      onChange={(e) => handleChange('social_linkedin', e.target.value)}
                      placeholder="https://linkedin.com/company/yourpage"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </CMSLayout>
  );
};

export default CMSHomepage;
