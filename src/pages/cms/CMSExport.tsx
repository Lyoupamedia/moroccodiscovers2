import { useState } from 'react';
import { CMSLayout } from '@/components/cms/CMSLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useCMSSite } from '@/hooks/useCMSSite';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Download, 
  Database, 
  FileText, 
  Image, 
  Layers, 
  Loader2,
  CheckCircle,
  Package
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { ImportDataCard } from '@/components/cms/export/ImportDataCard';

interface ExportOptions {
  pages: boolean;
  posts: boolean;
  media: boolean;
  mysql: boolean;
}

const CMSExport = () => {
  const { currentSite } = useCMSSite();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [completedExports, setCompletedExports] = useState<string[]>([]);

  const [options, setOptions] = useState<ExportOptions>({
    pages: true,
    posts: true,
    media: false,
    mysql: false,
  });

  const handleOptionChange = (option: keyof ExportOptions) => {
    setOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };

  const downloadJson = (data: unknown, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportPages = async () => {
    if (!currentSite) return null;

    setCurrentTask('Exporting pages...');
    const { data, error } = await supabase
      .from('cms_pages')
      .select('*')
      .eq('site_id', currentSite.id);

    if (error) throw error;
    return data;
  };

  const exportPosts = async () => {
    if (!currentSite) return null;

    setCurrentTask('Exporting posts...');
    const { data, error } = await supabase
      .from('cms_posts')
      .select('*')
      .eq('site_id', currentSite.id);

    if (error) throw error;
    return data;
  };

  const exportMedia = async () => {
    if (!currentSite) return null;

    setCurrentTask('Exporting media metadata...');
    const { data, error } = await supabase
      .from('cms_media')
      .select('*')
      .eq('site_id', currentSite.id);

    if (error) throw error;
    return data;
  };

  const exportMySQL = async () => {
    if (!currentSite || !currentSite.is_mysql_connected) return null;

    setCurrentTask('Exporting MySQL database...');
    
    const { data, error } = await supabase.functions.invoke('mysql-export', {
      body: { siteId: currentSite.id }
    });

    if (error) throw error;
    return data;
  };

  const handleExport = async () => {
    if (!currentSite) return;

    const selectedOptions = Object.entries(options).filter(([, value]) => value);
    if (selectedOptions.length === 0) {
      toast({
        title: 'No options selected',
        description: 'Please select at least one item to export',
        variant: 'destructive',
      });
      return;
    }

    setIsExporting(true);
    setProgress(0);
    setCompletedExports([]);

    try {
      const totalSteps = selectedOptions.length;
      let currentStep = 0;
      const exportData: Record<string, unknown> = {
        exportedAt: new Date().toISOString(),
        siteName: currentSite.name,
        siteSlug: currentSite.slug,
      };

      // Export pages
      if (options.pages) {
        const pages = await exportPages();
        exportData.pages = pages;
        currentStep++;
        setProgress((currentStep / totalSteps) * 100);
        setCompletedExports(prev => [...prev, 'pages']);
      }

      // Export posts
      if (options.posts) {
        const posts = await exportPosts();
        exportData.posts = posts;
        currentStep++;
        setProgress((currentStep / totalSteps) * 100);
        setCompletedExports(prev => [...prev, 'posts']);
      }

      // Export media
      if (options.media) {
        const media = await exportMedia();
        exportData.media = media;
        currentStep++;
        setProgress((currentStep / totalSteps) * 100);
        setCompletedExports(prev => [...prev, 'media']);
      }

      // Export MySQL
      if (options.mysql) {
        try {
          const mysqlData = await exportMySQL();
          exportData.mysql = mysqlData;
          setCompletedExports(prev => [...prev, 'mysql']);
        } catch (err) {
          console.error('MySQL export failed:', err);
          exportData.mysql = { error: 'MySQL export failed - ensure database is connected' };
        }
        currentStep++;
        setProgress((currentStep / totalSteps) * 100);
      }

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${currentSite.slug}-export-${timestamp}.json`;

      // Download the export
      downloadJson(exportData, filename);

      setCurrentTask('Export complete!');
      toast({
        title: 'Export Successful',
        description: `Your data has been exported to ${filename}`,
      });

    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: 'Export Failed',
        description: 'An error occurred while exporting your data',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
      setTimeout(() => {
        setProgress(0);
        setCurrentTask('');
      }, 3000);
    }
  };

  if (!currentSite) {
    return (
      <CMSLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Loading site...</p>
        </div>
      </CMSLayout>
    );
  }

  const exportItems = [
    {
      id: 'pages' as const,
      label: 'Pages',
      description: 'All pages with content, SEO settings, and metadata',
      icon: FileText,
    },
    {
      id: 'posts' as const,
      label: 'Blog Posts',
      description: 'All blog posts with categories, tags, and content',
      icon: Layers,
    },
    {
      id: 'media' as const,
      label: 'Media Library',
      description: 'Media file metadata and URLs (not the actual files)',
      icon: Image,
    },
    {
      id: 'mysql' as const,
      label: 'MySQL Database',
      description: 'Export data from connected MySQL database',
      icon: Database,
      disabled: !currentSite.is_mysql_connected,
      disabledReason: 'No MySQL database connected',
    },
  ];

  return (
    <CMSLayout>
      <div className="space-y-6 max-w-2xl">
        {/* Header */}
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Import / Export</h1>
          <p className="text-muted-foreground mt-1">
            Import content from another site or export your data as JSON
          </p>
        </div>

        {/* Import Section */}
        <ImportDataCard currentSite={currentSite} />

        {/* Export Options */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-primary" />
              <div>
                <CardTitle>Select Data to Export</CardTitle>
                <CardDescription>Choose what content you want to include in your export</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {exportItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                  item.disabled 
                    ? 'opacity-50 cursor-not-allowed bg-muted/50' 
                    : options[item.id] 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:bg-muted/50'
                }`}
              >
                <Checkbox
                  id={item.id}
                  checked={options[item.id]}
                  onCheckedChange={() => !item.disabled && handleOptionChange(item.id)}
                  disabled={item.disabled || isExporting}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label
                    htmlFor={item.id}
                    className={`flex items-center gap-2 font-medium ${item.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                    {completedExports.includes(item.id) && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.disabled ? item.disabledReason : item.description}
                  </p>
                </div>
              </div>
            ))}

            {/* Progress */}
            {isExporting && (
              <div className="space-y-2 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{currentTask}</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Export Button */}
            <div className="pt-4">
              <Button
                onClick={handleExport}
                disabled={isExporting || !Object.values(options).some(Boolean)}
                className="w-full gap-2"
                size="lg"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Export Selected Data
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">About Exports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong>Format:</strong> Data is exported as a JSON file that can be imported into other systems or used as a backup.
            </p>
            <p>
              <strong>Media Files:</strong> The media export includes metadata and URLs. Actual image files need to be downloaded separately from their URLs.
            </p>
            <p>
              <strong>MySQL Export:</strong> If you have a MySQL database connected, you can export its schema and data. This requires an active connection.
            </p>
          </CardContent>
        </Card>
      </div>
    </CMSLayout>
  );
};

export default CMSExport;