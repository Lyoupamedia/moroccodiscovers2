import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CMSLayout } from '@/components/cms/CMSLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCMSSite } from '@/hooks/useCMSSite';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Globe } from 'lucide-react';

const CMSNewSite = () => {
  const navigate = useNavigate();
  const { createSite } = useCMSSite();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const handleNameChange = (value: string) => {
    setName(value);
    // Auto-generate slug from name
    setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !slug.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    const site = await createSite(name, slug);

    if (site) {
      toast({
        title: 'Site Created',
        description: 'Your new site has been created successfully',
      });
      navigate('/cms');
    } else {
      toast({
        title: 'Error',
        description: 'Failed to create site. The slug might already be taken.',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  return (
    <CMSLayout>
      <div className="max-w-lg mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Create New Site</CardTitle>
            <CardDescription>
              Set up a new website to manage with the CMS
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Site Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="My Awesome Website"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  The display name for your site
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Site Slug</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                  placeholder="my-awesome-website"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  URL identifier (letters, numbers, and hyphens only)
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/cms')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Site'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </CMSLayout>
  );
};

export default CMSNewSite;
