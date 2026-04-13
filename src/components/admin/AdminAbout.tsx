import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useSiteSettings, useUpdateSiteSetting } from '@/hooks/useSiteSettings';
import { toast } from 'sonner';
import { Save, Loader2 } from 'lucide-react';
import { useState } from 'react';

const AdminAbout = () => {
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-lg">About Page Content</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'about_story', label: 'Our Story', type: 'textarea' },
            { key: 'about_mission', label: 'Our Mission', type: 'textarea' },
          ].map(({ key, label, type }) => (
            <div key={key} className="space-y-1">
              <Label>{label}</Label>
              <div className="flex gap-2">
                <Textarea value={getValue(key)} onChange={(e) => handleChange(key, e.target.value)} rows={4} className="flex-1" />
                <Button size="sm" onClick={() => handleSave(key)} disabled={updateSetting.isPending}>
                  {updateSetting.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Highlight Stats (JSON)</CardTitle></CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-2">Format: {`{"years": "8+", "guests": "2000+", "rating": "4.8", "rooms": "12"}`}</p>
          <div className="flex gap-2">
            <Textarea value={getValue('about_highlights')} onChange={(e) => handleChange('about_highlights', e.target.value)} rows={2} className="flex-1 font-mono text-sm" />
            <Button size="sm" onClick={() => handleSave('about_highlights')} disabled={updateSetting.isPending}>
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAbout;
