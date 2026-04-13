import { useState } from 'react';
import { useTestimonials, useManageTestimonial } from '@/hooks/useTestimonials';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Save, Trash2, Star, Loader2 } from 'lucide-react';

const AdminTestimonials = () => {
  const { data: testimonials = [], isLoading } = useTestimonials(false);
  const { create, update, remove } = useManageTestimonial();
  const [form, setForm] = useState({ name: '', location: '', text: '', rating: 5 });

  const handleAdd = async () => {
    if (!form.name || !form.text) return;
    try {
      await create.mutateAsync(form);
      setForm({ name: '', location: '', text: '', rating: 5 });
      toast.success('Testimonial added');
    } catch {
      toast.error('Failed to add');
    }
  };

  const toggleVisibility = async (id: string, current: boolean) => {
    try {
      await update.mutateAsync({ id, is_visible: !current });
      toast.success('Visibility updated');
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await remove.mutateAsync(id);
      toast.success('Testimonial deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (isLoading) return <p className="text-muted-foreground p-4">Loading...</p>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-lg">Add Testimonial</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div><Label>Guest Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, Country" /></div>
            <div><Label>Rating (1-5)</Label><Input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} /></div>
          </div>
          <div><Label>Review Text</Label><Textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={3} /></div>
          <Button onClick={handleAdd} disabled={create.isPending || !form.name || !form.text}>
            {create.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Add Testimonial
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {testimonials.map((t) => (
          <Card key={t.id}>
            <CardContent className="p-4 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{t.name}</p>
                  <span className="text-xs text-muted-foreground">{t.location}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">"{t.text}"</p>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-secondary text-secondary" />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Switch checked={t.is_visible} onCheckedChange={() => toggleVisibility(t.id, t.is_visible)} />
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(t.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminTestimonials;
