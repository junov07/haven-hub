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
    { key: 'contact_map_url', label: 'Google Maps Embed URL' },
  ];

  return (
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
  );
};

export default AdminContact;
