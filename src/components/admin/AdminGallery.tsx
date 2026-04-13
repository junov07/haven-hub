import { useState, useRef } from 'react';
import { useGalleryImages, useManageGalleryImage } from '@/hooks/useGalleryImages';
import { useUploadSiteAsset } from '@/hooks/useSiteSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Upload, Trash2, Loader2 } from 'lucide-react';

const categories = ['Rooms', 'Food', 'Events', 'Tents'];

const AdminGallery = () => {
  const { data: images = [], isLoading } = useGalleryImages();
  const { create, remove } = useManageGalleryImage();
  const uploadAsset = useUploadSiteAsset();
  const fileRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState('Rooms');
  const [alt, setAlt] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const path = `gallery/${Date.now()}-${file.name}`;
      const url = await uploadAsset.mutateAsync({ file, path });
      await create.mutateAsync({ url, alt: alt || file.name, category, sort_order: images.length });
      setAlt('');
      toast.success('Image added to gallery');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await remove.mutateAsync(id);
      toast.success('Image removed');
    } catch {
      toast.error('Failed to remove');
    }
  };

  if (isLoading) return <p className="text-muted-foreground p-4">Loading...</p>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-lg">Add Gallery Image</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Alt Text</Label>
              <Input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Image description" />
            </div>
            <div className="flex items-end">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
              <Button onClick={() => fileRef.current?.click()} disabled={uploading} className="w-full">
                {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                Upload Image
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((img) => (
          <div key={img.id} className="relative group rounded-lg overflow-hidden border">
            <img src={img.url} alt={img.alt} className="w-full aspect-square object-cover" />
            <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <span className="text-primary-foreground text-xs font-medium px-2 py-1 bg-foreground/50 rounded">{img.category}</span>
              <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDelete(img.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGallery;
