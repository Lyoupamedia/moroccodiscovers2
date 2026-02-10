import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { CMSSite } from '@/types/cms';
import {
  Upload,
  FileText,
  Layers,
  Image,
  Loader2,
  CheckCircle,
  AlertTriangle,
  FileUp,
} from 'lucide-react';

interface ImportedData {
  exportedAt?: string;
  siteName?: string;
  siteSlug?: string;
  pages?: Array<Record<string, unknown>>;
  posts?: Array<Record<string, unknown>>;
  media?: Array<Record<string, unknown>>;
}

interface ImportOptions {
  pages: boolean;
  posts: boolean;
  media: boolean;
}

interface ImportDataCardProps {
  currentSite: CMSSite;
}

export const ImportDataCard = ({ currentSite }: ImportDataCardProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importedData, setImportedData] = useState<ImportedData | null>(null);
  const [fileName, setFileName] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [completedImports, setCompletedImports] = useState<string[]>([]);
  const [options, setOptions] = useState<ImportOptions>({
    pages: true,
    posts: true,
    media: true,
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      toast({
        title: 'Invalid file',
        description: 'Please select a JSON file',
        variant: 'destructive',
      });
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string) as ImportedData;
        setImportedData(data);
        setCompletedImports([]);
        setProgress(0);
        toast({
          title: 'File loaded',
          description: `Found: ${data.pages?.length ?? 0} pages, ${data.posts?.length ?? 0} posts, ${data.media?.length ?? 0} media items`,
        });
      } catch {
        toast({
          title: 'Invalid JSON',
          description: 'The file could not be parsed as valid JSON',
          variant: 'destructive',
        });
        setImportedData(null);
      }
    };
    reader.readAsText(file);
  };

  const handleOptionChange = (option: keyof ImportOptions) => {
    setOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };

  const importPages = async (pages: Array<Record<string, unknown>>) => {
    setCurrentTask(`Importing ${pages.length} pages...`);
    let imported = 0;
    for (const page of pages) {
      const { error } = await supabase.from('cms_pages').insert({
        site_id: currentSite.id,
        title: (page.title as string) || 'Untitled',
        slug: (page.slug as string) || `imported-${Date.now()}-${imported}`,
        content: (page.content as string) ?? null,
        excerpt: (page.excerpt as string) ?? null,
        featured_image_url: (page.featured_image_url as string) ?? null,
        status: (page.status as string) || 'draft',
        template: (page.template as string) ?? 'default',
        meta_title: (page.meta_title as string) ?? null,
        meta_description: (page.meta_description as string) ?? null,
        menu_order: (page.menu_order as number) ?? 0,
      });
      if (error) console.error('Failed to import page:', page.title, error);
      else imported++;
    }
    return imported;
  };

  const importPosts = async (posts: Array<Record<string, unknown>>) => {
    if (!user) return 0;
    setCurrentTask(`Importing ${posts.length} posts...`);
    let imported = 0;
    for (const post of posts) {
      const { error } = await supabase.from('cms_posts').insert({
        site_id: currentSite.id,
        author_id: user.id,
        title: (post.title as string) || 'Untitled',
        slug: (post.slug as string) || `imported-${Date.now()}-${imported}`,
        content: (post.content as string) ?? null,
        excerpt: (post.excerpt as string) ?? null,
        featured_image_url: (post.featured_image_url as string) ?? null,
        status: (post.status as string) || 'draft',
        categories: (post.categories as string[]) ?? [],
        tags: (post.tags as string[]) ?? [],
        meta_title: (post.meta_title as string) ?? null,
        meta_description: (post.meta_description as string) ?? null,
        allow_comments: (post.allow_comments as boolean) ?? true,
      });
      if (error) console.error('Failed to import post:', post.title, error);
      else imported++;
    }
    return imported;
  };

  const importMedia = async (media: Array<Record<string, unknown>>) => {
    if (!user) return 0;
    setCurrentTask(`Importing ${media.length} media items...`);
    let imported = 0;
    for (const item of media) {
      const { error } = await supabase.from('cms_media').insert({
        site_id: currentSite.id,
        uploaded_by: user.id,
        filename: (item.filename as string) || 'unknown',
        file_url: (item.file_url as string) || '',
        file_type: (item.file_type as string) || 'image/jpeg',
        file_size: (item.file_size as number) ?? null,
        alt_text: (item.alt_text as string) ?? null,
        caption: (item.caption as string) ?? null,
        width: (item.width as number) ?? null,
        height: (item.height as number) ?? null,
      });
      if (error) console.error('Failed to import media:', item.filename, error);
      else imported++;
    }
    return imported;
  };

  const handleImport = async () => {
    if (!importedData || !currentSite) return;

    const selected = Object.entries(options).filter(([, v]) => v);
    if (selected.length === 0) {
      toast({ title: 'No options selected', description: 'Please select at least one data type to import', variant: 'destructive' });
      return;
    }

    setIsImporting(true);
    setProgress(0);
    setCompletedImports([]);

    try {
      const totalSteps = selected.length;
      let step = 0;
      const results: string[] = [];

      if (options.pages && importedData.pages?.length) {
        const count = await importPages(importedData.pages);
        results.push(`${count} pages`);
        step++;
        setProgress((step / totalSteps) * 100);
        setCompletedImports(prev => [...prev, 'pages']);
      } else if (options.pages) { step++; setProgress((step / totalSteps) * 100); }

      if (options.posts && importedData.posts?.length) {
        const count = await importPosts(importedData.posts);
        results.push(`${count} posts`);
        step++;
        setProgress((step / totalSteps) * 100);
        setCompletedImports(prev => [...prev, 'posts']);
      } else if (options.posts) { step++; setProgress((step / totalSteps) * 100); }

      if (options.media && importedData.media?.length) {
        const count = await importMedia(importedData.media);
        results.push(`${count} media items`);
        step++;
        setProgress((step / totalSteps) * 100);
        setCompletedImports(prev => [...prev, 'media']);
      } else if (options.media) { step++; setProgress((step / totalSteps) * 100); }

      setCurrentTask('Import complete!');
      toast({
        title: 'Import Successful',
        description: `Imported: ${results.join(', ') || 'No data to import'}`,
      });
    } catch (error) {
      console.error('Import failed:', error);
      toast({ title: 'Import Failed', description: 'An error occurred during import', variant: 'destructive' });
    } finally {
      setIsImporting(false);
      setTimeout(() => { setProgress(0); setCurrentTask(''); }, 3000);
    }
  };

  const importItems = [
    { id: 'pages' as const, label: 'Pages', icon: FileText, count: importedData?.pages?.length ?? 0 },
    { id: 'posts' as const, label: 'Blog Posts', icon: Layers, count: importedData?.posts?.length ?? 0 },
    { id: 'media' as const, label: 'Media Metadata', icon: Image, count: importedData?.media?.length ?? 0 },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Upload className="w-6 h-6 text-primary" />
          <div>
            <CardTitle>Import Data</CardTitle>
            <CardDescription>Import content from a JSON export file</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload */}
        <div
          className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
          <FileUp className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
          {fileName ? (
            <p className="text-sm font-medium">{fileName}</p>
          ) : (
            <p className="text-sm text-muted-foreground">Click to select a JSON export file</p>
          )}
        </div>

        {/* Source info */}
        {importedData && (
          <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
            {importedData.siteName && <p><strong>Source:</strong> {importedData.siteName}</p>}
            {importedData.exportedAt && (
              <p><strong>Exported:</strong> {new Date(importedData.exportedAt).toLocaleString()}</p>
            )}
          </div>
        )}

        {/* Import options */}
        {importedData && (
          <>
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <AlertTriangle className="w-4 h-4" />
              <span>Imported items will be set to <strong>draft</strong> status. All posts will be assigned to you.</span>
            </div>

            {importItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                  item.count === 0
                    ? 'opacity-50 cursor-not-allowed bg-muted/50'
                    : options[item.id]
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                }`}
              >
                <Checkbox
                  id={`import-${item.id}`}
                  checked={options[item.id]}
                  onCheckedChange={() => item.count > 0 && handleOptionChange(item.id)}
                  disabled={item.count === 0 || isImporting}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label
                    htmlFor={`import-${item.id}`}
                    className={`flex items-center gap-2 font-medium ${item.count === 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                    <span className="text-muted-foreground font-normal">({item.count} items)</span>
                    {completedImports.includes(item.id) && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </Label>
                </div>
              </div>
            ))}

            {/* Progress */}
            {isImporting && (
              <div className="space-y-2 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{currentTask}</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Import Button */}
            <div className="pt-4">
              <Button
                onClick={handleImport}
                disabled={isImporting || !Object.values(options).some(Boolean) || importItems.every(i => i.count === 0)}
                className="w-full gap-2"
                size="lg"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Import Selected Data
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
