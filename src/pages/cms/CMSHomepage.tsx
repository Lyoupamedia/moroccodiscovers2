import { useState, useEffect } from 'react';
import { CMSLayout } from '@/components/cms/CMSLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Loader2, Home, Sparkles, Phone, Share2, LayoutTemplate, MapPin, Star, Users, FileText, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useCMSSite } from '@/hooks/useCMSSite';
import { Switch } from '@/components/ui/switch';
import { FooterTab } from '@/components/cms/homepage/FooterTab';
import { SEOTab } from '@/components/cms/homepage/SEOTab';

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
  social_pinterest: string;
  
  // Section Visibility & Content
  section_destinations_visible: boolean;
  section_destinations_title: string;
  section_destinations_subtitle: string;
  section_experiences_visible: boolean;
  section_experiences_title: string;
  section_experiences_subtitle: string;
  section_why_morocco_visible: boolean;
  section_why_morocco_title: string;
  section_why_morocco_subtitle: string;
  section_testimonials_visible: boolean;
  section_testimonials_title: string;
  section_testimonials_subtitle: string;
  section_travel_essentials_visible: boolean;
  section_travel_essentials_title: string;
  section_travel_essentials_subtitle: string;
  section_blogs_visible: boolean;
  section_blogs_title: string;
  section_blogs_subtitle: string;
  section_cta_visible: boolean;
  
  // Footer
  footer_description: string;
  footer_copyright_text: string;
  footer_quick_link_1_label: string;
  footer_quick_link_1_url: string;
  footer_quick_link_2_label: string;
  footer_quick_link_2_url: string;
  footer_quick_link_3_label: string;
  footer_quick_link_3_url: string;
  footer_quick_link_4_label: string;
  footer_quick_link_4_url: string;
  
  // SEO
  seo_meta_title: string;
  seo_meta_description: string;
  seo_keywords: string;
  seo_og_title: string;
  seo_og_description: string;
  seo_og_image_url: string;
  seo_twitter_title: string;
  seo_twitter_description: string;
  seo_twitter_image_url: string;
}

const defaultSettings: HomepageSettings = {
  // Hero
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
  social_pinterest: '',
  
  section_destinations_visible: true,
  section_destinations_title: 'Top Destinations',
  section_destinations_subtitle: 'Discover the most captivating places Morocco has to offer, from ancient medinas to stunning natural wonders.',
  section_experiences_visible: true,
  section_experiences_title: 'Unforgettable Moments',
  section_experiences_subtitle: 'Immerse yourself in authentic Moroccan experiences crafted to create lasting memories and meaningful connections.',
  section_why_morocco_visible: true,
  section_why_morocco_title: 'Why Choose Morocco',
  section_why_morocco_subtitle: 'Morocco offers a unique blend of culture, adventure, and natural beauty.',
  section_testimonials_visible: true,
  section_testimonials_title: 'What Travelers Say',
  section_testimonials_subtitle: 'Hear from travelers who have experienced the magic of Morocco with us.',
  section_travel_essentials_visible: true,
  section_travel_essentials_title: 'Travel Essentials',
  section_travel_essentials_subtitle: 'Everything you need to know before your Moroccan adventure.',
  section_blogs_visible: true,
  section_blogs_title: 'Stories & Travel Tips',
  section_blogs_subtitle: 'Get inspired with our latest travel stories, tips, and guides to help you plan your perfect Moroccan adventure.',
  section_cta_visible: true,
  
  // Footer
  footer_description: 'Your gateway to authentic Moroccan experiences. From ancient medinas to golden dunes, we craft unforgettable journeys.',
  footer_copyright_text: 'Morocco Discovers. All rights reserved.',
  footer_quick_link_1_label: 'Destinations',
  footer_quick_link_1_url: '/#destinations',
  footer_quick_link_2_label: 'Experiences',
  footer_quick_link_2_url: '/#experiences',
  footer_quick_link_3_label: 'About Us',
  footer_quick_link_3_url: '/about',
  footer_quick_link_4_label: 'Contact',
  footer_quick_link_4_url: '/contact',
  
  // SEO
  seo_meta_title: 'Morocco Discovers - Authentic Moroccan Travel Experiences',
  seo_meta_description: 'Discover Morocco with our expertly crafted travel experiences. From Sahara desert adventures to ancient medina tours, we create unforgettable journeys.',
  seo_keywords: 'morocco travel, sahara tours, marrakech, fes, moroccan adventure, morocco trips',
  seo_og_title: 'Morocco Discovers - Your Gateway to Morocco',
  seo_og_description: 'Embark on an unforgettable journey through Morocco\'s ancient medinas, majestic mountains, and golden Sahara dunes.',
  seo_og_image_url: '',
  seo_twitter_title: 'Morocco Discovers',
  seo_twitter_description: 'Discover the magic of Morocco with our authentic travel experiences.',
  seo_twitter_image_url: '',
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
      const upsertData = Object.entries(settings).map(([key, value]) => ({
        site_id: currentSite.id,
        setting_key: `homepage_${key}`,
        setting_value: String(value),
      }));

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
          <TabsList className="flex flex-wrap h-auto gap-1">
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
            <TabsTrigger value="footer" className="gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Footer</span>
            </TabsTrigger>
            <TabsTrigger value="seo" className="gap-2">
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">SEO</span>
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

          {/* Section Visibility & Content */}
          <TabsContent value="sections" className="space-y-6">
            {[
              { key: 'destinations', label: 'Destinations Section', description: 'Featured travel destinations carousel' },
              { key: 'experiences', label: 'Experiences Section', description: 'Travel experiences and activities' },
              { key: 'why_morocco', label: 'Why Morocco Section', description: 'Reasons to visit Morocco' },
              { key: 'testimonials', label: 'Testimonials Section', description: 'Customer reviews and testimonials' },
              { key: 'travel_essentials', label: 'Travel Essentials Section', description: 'Essential travel information' },
              { key: 'blogs', label: 'Blog Section', description: 'Latest blog posts' },
              { key: 'cta', label: 'Call to Action Section', description: 'Bottom CTA with contact buttons' },
            ].map((section) => {
              const visibleKey = `section_${section.key}_visible` as keyof HomepageSettings;
              const titleKey = `section_${section.key}_title` as keyof HomepageSettings;
              const subtitleKey = `section_${section.key}_subtitle` as keyof HomepageSettings;
              const hasContent = titleKey in settings;

              return (
                <Card key={section.key}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{section.label}</CardTitle>
                        <CardDescription>{section.description}</CardDescription>
                      </div>
                      <Switch
                        checked={settings[visibleKey] as boolean}
                        onCheckedChange={(checked) => handleChange(visibleKey, checked)}
                      />
                    </div>
                  </CardHeader>
                  {hasContent && (
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Section Title</Label>
                        <Input
                          value={settings[titleKey] as string}
                          onChange={(e) => handleChange(titleKey, e.target.value)}
                          placeholder="Section title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Section Description</Label>
                        <Textarea
                          value={settings[subtitleKey] as string}
                          onChange={(e) => handleChange(subtitleKey, e.target.value)}
                          placeholder="Section description"
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
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
                    <Label htmlFor="social_pinterest">Pinterest</Label>
                    <Input
                      id="social_pinterest"
                      value={settings.social_pinterest}
                      onChange={(e) => handleChange('social_pinterest', e.target.value)}
                      placeholder="https://pinterest.com/yourpage"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Footer */}
          <TabsContent value="footer">
            <FooterTab
              settings={{
                footer_description: settings.footer_description,
                footer_copyright_text: settings.footer_copyright_text,
                footer_quick_link_1_label: settings.footer_quick_link_1_label,
                footer_quick_link_1_url: settings.footer_quick_link_1_url,
                footer_quick_link_2_label: settings.footer_quick_link_2_label,
                footer_quick_link_2_url: settings.footer_quick_link_2_url,
                footer_quick_link_3_label: settings.footer_quick_link_3_label,
                footer_quick_link_3_url: settings.footer_quick_link_3_url,
                footer_quick_link_4_label: settings.footer_quick_link_4_label,
                footer_quick_link_4_url: settings.footer_quick_link_4_url,
              }}
              onChange={(field, value) => handleChange(field as keyof HomepageSettings, value)}
            />
          </TabsContent>

          {/* SEO */}
          <TabsContent value="seo">
            <SEOTab
              settings={{
                seo_meta_title: settings.seo_meta_title,
                seo_meta_description: settings.seo_meta_description,
                seo_keywords: settings.seo_keywords,
                seo_og_title: settings.seo_og_title,
                seo_og_description: settings.seo_og_description,
                seo_og_image_url: settings.seo_og_image_url,
                seo_twitter_title: settings.seo_twitter_title,
                seo_twitter_description: settings.seo_twitter_description,
                seo_twitter_image_url: settings.seo_twitter_image_url,
              }}
              siteId={currentSite.id}
              onChange={(field, value) => handleChange(field as keyof HomepageSettings, value)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </CMSLayout>
  );
};

export default CMSHomepage;
