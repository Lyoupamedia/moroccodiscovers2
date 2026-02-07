import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface FooterTabProps {
  settings: {
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
  };
  onChange: (field: string, value: string) => void;
}

export const FooterTab = ({ settings, onChange }: FooterTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Footer Content</CardTitle>
          <CardDescription>Customize the content in your website footer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="footer_description">Footer Description</Label>
            <Textarea
              id="footer_description"
              value={settings.footer_description}
              onChange={(e) => onChange('footer_description', e.target.value)}
              placeholder="Your gateway to authentic Moroccan experiences. From ancient medinas to golden dunes, we craft unforgettable journeys."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="footer_copyright_text">Copyright Text</Label>
            <Input
              id="footer_copyright_text"
              value={settings.footer_copyright_text}
              onChange={(e) => onChange('footer_copyright_text', e.target.value)}
              placeholder="Morocco Discovers. All rights reserved."
            />
            <p className="text-xs text-muted-foreground">
              Year will be added automatically (e.g., © 2026 Your Text)
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
          <CardDescription>Navigation links displayed in the footer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="grid gap-4 sm:grid-cols-2 p-4 rounded-lg border">
              <div className="space-y-2">
                <Label htmlFor={`footer_quick_link_${num}_label`}>Link {num} Label</Label>
                <Input
                  id={`footer_quick_link_${num}_label`}
                  value={settings[`footer_quick_link_${num}_label` as keyof typeof settings]}
                  onChange={(e) => onChange(`footer_quick_link_${num}_label`, e.target.value)}
                  placeholder={num === 1 ? 'Destinations' : num === 2 ? 'Experiences' : num === 3 ? 'About Us' : 'Contact'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`footer_quick_link_${num}_url`}>Link {num} URL</Label>
                <Input
                  id={`footer_quick_link_${num}_url`}
                  value={settings[`footer_quick_link_${num}_url` as keyof typeof settings]}
                  onChange={(e) => onChange(`footer_quick_link_${num}_url`, e.target.value)}
                  placeholder={num === 1 ? '/#destinations' : num === 2 ? '/#experiences' : num === 3 ? '/about' : '/contact'}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
