import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useSiteSettings, useUpdateSiteSetting, useUploadSiteAsset } from '@/hooks/useSiteSettings';
import { toast } from 'sonner';
import { Upload, Save, Loader2 } from 'lucide-react';

const AdminSiteSettings = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSetting = useUpdateSiteSetting();
  const uploadAsset = useUploadSiteAsset();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroImageRef = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState<Record<string, string>>({});

  const getValue = (key: string) => values[key] ?? settings?.[key] ?? '';

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key: string) => {
    try {
      await updateSetting.mutateAsync({ key, value: getValue(key) });
      toast.success(`${key.replace(/_/g, ' ')} updated`);
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleFileUpload = async (file: File, settingKey: string) => {
    try {
      const path = `${settingKey}/${Date.now()}-${file.name}`;
      const publicUrl = await uploadAsset.mutateAsync({ file, path });
      await updateSetting.mutateAsync({ key: settingKey, value: publicUrl });
      setValues((prev) => ({ ...prev, [settingKey]: publicUrl }));
      toast.success('Image uploaded');
    } catch {
      toast.error('Upload failed');
    }
  };

  if (isLoading) return <p className="text-muted-foreground p-4">Loading settings...</p>;

  const fields = [
    { key: 'site_name', label: 'Site Name', type: 'input' },
    { key: 'hero_title', label: 'Hero Title', type: 'input' },
    { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'textarea' },
    { key: 'hero_cta', label: 'Hero CTA Button Text', type: 'input' },
    { key: 'footer_tagline', label: 'Footer Tagline', type: 'input' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Logo & Hero Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Logo</Label>
              {getValue('logo_url') && (
                <img src={getValue('logo_url')} alt="Logo" className="h-16 w-16 object-contain rounded border mb-2" />
              )}
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'logo_url');
                }}
              />
              <Button variant="outline" size="sm" onClick={() => logoInputRef.current?.click()} disabled={uploadAsset.isPending}>
                {uploadAsset.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                Upload Logo
              </Button>
            </div>
            <div>
              <Label>Hero Background Image</Label>
              {getValue('hero_image') && (
                <img src={getValue('hero_image')} alt="Hero" className="h-24 w-full object-cover rounded border mb-2" />
              )}
              <input
                ref={heroImageRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'hero_image');
                }}
              />
              <Button variant="outline" size="sm" onClick={() => heroImageRef.current?.click()} disabled={uploadAsset.isPending}>
                {uploadAsset.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                Upload Hero Image
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Site Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map(({ key, label, type }) => (
            <div key={key} className="space-y-1">
              <Label>{label}</Label>
              <div className="flex gap-2">
                {type === 'textarea' ? (
                  <Textarea value={getValue(key)} onChange={(e) => handleChange(key, e.target.value)} rows={3} className="flex-1" />
                ) : (
                  <Input value={getValue(key)} onChange={(e) => handleChange(key, e.target.value)} className="flex-1" />
                )}
                <Button size="sm" onClick={() => handleSave(key)} disabled={updateSetting.isPending}>
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSiteSettings;
