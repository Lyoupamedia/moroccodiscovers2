import { useEffect, useState, useCallback } from 'react';
import { CMSLayout } from '@/components/cms/CMSLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCMSSite } from '@/hooks/useCMSSite';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, Search, Image, Trash2, Copy, X, Grid, List } from 'lucide-react';
import type { CMSMedia } from '@/types/cms';
import { cn } from '@/lib/utils';

const CMSMediaPage = () => {
  const { currentSite } = useCMSSite();
  const { user } = useAuth();
  const { toast } = useToast();
  const [media, setMedia] = useState<CMSMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<CMSMedia | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fetchMedia = useCallback(async () => {
    if (!currentSite) return;

    setIsLoading(true);
    const { data, error } = await supabase
      .from('cms_media')
      .select('*')
      .eq('site_id', currentSite.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching media:', error);
      toast({
        title: 'Error',
        description: 'Failed to load media',
        variant: 'destructive',
      });
    } else {
      setMedia((data || []) as unknown as CMSMedia[]);
    }
    setIsLoading(false);
  }, [currentSite, toast]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || !currentSite || !user) return;

    setIsUploading(true);
    const uploadedFiles: CMSMedia[] = [];

    for (const file of Array.from(files)) {
      // Validate file
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: `${file.name} exceeds 10MB limit`,
          variant: 'destructive',
        });
        continue;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${currentSite.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast({
          title: 'Upload failed',
          description: `Failed to upload ${file.name}`,
          variant: 'destructive',
        });
        continue;
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(fileName);

      // Create media record
      const { data: mediaData, error: mediaError } = await supabase
        .from('cms_media')
        .insert({
          site_id: currentSite.id,
          uploaded_by: user.id,
          filename: file.name,
          file_url: urlData.publicUrl,
          file_type: file.type,
          file_size: file.size,
        })
        .select()
        .single();

      if (mediaError) {
        console.error('Media record error:', mediaError);
      } else {
        uploadedFiles.push(mediaData as unknown as CMSMedia);
      }
    }

    if (uploadedFiles.length > 0) {
      setMedia(prev => [...uploadedFiles, ...prev]);
      toast({
        title: 'Upload complete',
        description: `${uploadedFiles.length} file(s) uploaded successfully`,
      });
    }

    setIsUploading(false);
  };

  const handleDelete = async (item: CMSMedia) => {
    // Delete from storage
    const path = item.file_url.split('/uploads/')[1];
    if (path) {
      await supabase.storage.from('uploads').remove([path]);
    }

    // Delete record
    const { error } = await supabase.from('cms_media').delete().eq('id', item.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete media',
        variant: 'destructive',
      });
    } else {
      setMedia(media.filter(m => m.id !== item.id));
      setSelectedMedia(null);
      toast({
        title: 'Success',
        description: 'Media deleted successfully',
      });
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: 'Copied!',
      description: 'URL copied to clipboard',
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleUpload(e.dataTransfer.files);
  };

  const filteredMedia = media.filter(item =>
    item.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isImage = (type: string) => type.startsWith('image/');

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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Media Library</h1>
            <p className="text-muted-foreground mt-1">Manage your images and files</p>
          </div>
          <div className="flex gap-2">
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            <Button className="gap-2" asChild>
              <label>
                <Upload className="w-4 h-4" />
                Upload
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files)}
                  accept="image/*,video/*,application/pdf"
                />
              </label>
            </Button>
          </div>
        </div>

        {/* Upload Zone */}
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-border",
            isUploading && "opacity-50 pointer-events-none"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            {isUploading ? 'Uploading...' : 'Drag and drop files here, or click Upload button'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Max file size: 10MB</p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search media..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Media Grid/List */}
        <Card>
          <CardHeader>
            <CardTitle>All Media ({filteredMedia.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">Loading media...</p>
              </div>
            ) : filteredMedia.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Image className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-2">No media files</h3>
                <p className="text-muted-foreground mb-4">
                  Upload images and files to get started
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredMedia.map((item) => (
                  <div
                    key={item.id}
                    className="relative group aspect-square rounded-lg overflow-hidden border cursor-pointer hover:ring-2 ring-primary transition-all"
                    onClick={() => setSelectedMedia(item)}
                  >
                    {isImage(item.file_type) ? (
                      <img
                        src={item.file_url}
                        alt={item.alt_text || item.filename}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <Image className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white text-xs px-2 truncate">{item.filename}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredMedia.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted cursor-pointer"
                    onClick={() => setSelectedMedia(item)}
                  >
                    <div className="w-12 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
                      {isImage(item.file_type) ? (
                        <img
                          src={item.file_url}
                          alt={item.alt_text || item.filename}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.filename}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.file_type} • {item.file_size ? `${(item.file_size / 1024).toFixed(1)} KB` : 'Unknown size'}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(item.file_url);
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Media Detail Dialog */}
        <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedMedia?.filename}</DialogTitle>
              <DialogDescription>Media details and options</DialogDescription>
            </DialogHeader>
            {selectedMedia && (
              <div className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                  {isImage(selectedMedia.file_type) ? (
                    <img
                      src={selectedMedia.file_url}
                      alt={selectedMedia.alt_text || selectedMedia.filename}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p>{selectedMedia.file_type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Size</p>
                    <p>{selectedMedia.file_size ? `${(selectedMedia.file_size / 1024).toFixed(1)} KB` : 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Uploaded</p>
                    <p>{new Date(selectedMedia.created_at).toLocaleDateString()}</p>
                  </div>
                  {selectedMedia.width && selectedMedia.height && (
                    <div>
                      <p className="text-muted-foreground">Dimensions</p>
                      <p>{selectedMedia.width} × {selectedMedia.height}</p>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground text-sm mb-2">URL</p>
                  <div className="flex gap-2">
                    <Input value={selectedMedia.file_url} readOnly className="text-xs" />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(selectedMedia.file_url)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(selectedMedia)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </CMSLayout>
  );
};

export default CMSMediaPage;
