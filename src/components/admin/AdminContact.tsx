import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useSiteSettings, useUpdateSiteSetting } from '@/hooks/useSiteSettings';
import { toast } from 'sonner';
import { Save, Loader2 } from 'lucide-react';
import { useState } from 'react';

const AdminContact = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSetting = useUpdateSiteSetting();
  const [values, setValues] = useState<Record<string, string>>({});

  const getValue = (key: string) => values[key] ?? settings?.[key] ?? '';
  const handleChange = (key: string, value: string) => setValues((prev) => ({ ...prev, [key]: value }));

  const handleSave = async (key: string) => {
    try {
      await updateSetting.mutateAsync({ key, value: getValue(key) });
      toast.success('Updated');
    } catch {
      toast.error('Failed');
    }
  };

  if (isLoading) return <p className="text-muted-foreground p-4">Loading...</p>;

  const fields = [
    { key: 'contact_address', label: 'Address' },
    { key: 'contact_phone', label: 'Phone' },
    { key: 'contact_email', label: 'Email' },
  ];

  const mapUrl = getValue('contact_map_url');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-lg">Contact Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {fields.map(({ key, label }) => (
            <div key={key} className="space-y-1">
              <Label>{label}</Label>
              <div className="flex gap-2">
                <Input value={getValue(key)} onChange={(e) => handleChange(key, e.target.value)} className="flex-1" />
                <Button size="sm" onClick={() => handleSave(key)} disabled={updateSetting.isPending}>
                  {updateSetting.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Map Location</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Google Maps Embed URL</Label>
            <p className="text-xs text-muted-foreground">
              Go to Google Maps → Find location → Share → Embed a map → Copy the <code>src</code> URL from the iframe code.
            </p>
            <div className="flex gap-2">
              <Input
                value={getValue('contact_map_url')}
                onChange={(e) => handleChange('contact_map_url', e.target.value)}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="flex-1"
              />
              <Button size="sm" onClick={() => handleSave('contact_map_url')} disabled={updateSetting.isPending}>
                {updateSetting.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          {mapUrl && (
            <div className="rounded-lg overflow-hidden border h-64">
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Map Preview"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminContact;
