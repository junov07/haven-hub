import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';
import { useUploadSiteAsset } from '@/hooks/useSiteSettings';

const AdminRooms = () => {
  const queryClient = useQueryClient();
  const uploadAsset = useUploadSiteAsset();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', type: '', description: '', price_per_night: 0, capacity: 2, amenities: '', image_url: '', is_available: true });

  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ['admin-rooms'],
    queryFn: async () => {
      const { data, error } = await supabase.from('rooms').select('*').order('created_at');
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        type: form.type,
        description: form.description,
        price_per_night: form.price_per_night,
        capacity: form.capacity,
        amenities: form.amenities.split(',').map((a) => a.trim()).filter(Boolean),
        image_url: form.image_url || null,
        is_available: form.is_available,
      };
      if (editingId) {
        const { error } = await supabase.from('rooms').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('rooms').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rooms'] });
      toast.success(editingId ? 'Room updated' : 'Room added');
      resetForm();
    },
    onError: () => toast.error('Failed to save room'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('rooms').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rooms'] });
      toast.success('Room deleted');
    },
  });

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: '', type: '', description: '', price_per_night: 0, capacity: 2, amenities: '', image_url: '', is_available: true });
  };

  const startEdit = (room: any) => {
    setEditingId(room.id);
    setForm({
      name: room.name,
      type: room.type,
      description: room.description || '',
      price_per_night: room.price_per_night,
      capacity: room.capacity,
      amenities: (room.amenities || []).join(', '),
      image_url: room.image_url || '',
      is_available: room.is_available,
    });
  };

  const handleImageUpload = async (file: File) => {
    try {
      const path = `rooms/${Date.now()}-${file.name}`;
      const url = await uploadAsset.mutateAsync({ file, path });
      setForm((prev) => ({ ...prev, image_url: url }));
      toast.success('Image uploaded');
    } catch {
      toast.error('Upload failed');
    }
  };

  if (isLoading) return <p className="text-muted-foreground p-4">Loading rooms...</p>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{editingId ? 'Edit Room' : 'Add New Room'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Annapurna Deluxe" />
            </div>
            <div>
              <Label>Type</Label>
              <Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="e.g. deluxe, standard" />
            </div>
            <div>
              <Label>Price per Night (NPR)</Label>
              <Input type="number" value={form.price_per_night} onChange={(e) => setForm({ ...form, price_per_night: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Capacity</Label>
              <Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
          </div>
          <div>
            <Label>Amenities (comma-separated)</Label>
            <Input value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} placeholder="WiFi, Hot Water, Mountain View" />
          </div>
          <div className="flex items-center gap-4">
            <div>
              <Label>Room Image</Label>
              <div className="flex items-center gap-2 mt-1">
                {form.image_url && <img src={form.image_url} alt="Room" className="h-12 w-16 object-cover rounded border" />}
                <input type="file" accept="image/*" className="text-sm" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_available} onCheckedChange={(c) => setForm({ ...form, is_available: c })} />
              <Label>Available</Label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.name}>
              {saveMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {editingId ? 'Update Room' : 'Add Room'}
            </Button>
            {editingId && <Button variant="outline" onClick={resetForm}>Cancel</Button>}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rooms.map((room) => (
          <Card key={room.id} className="relative">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{room.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{room.type} · {room.capacity} guests</p>
                  <p className="text-sm font-semibold text-primary mt-1">NPR {room.price_per_night.toLocaleString()}/night</p>
                  {room.amenities && room.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {room.amenities.map((a) => (
                        <Badge key={a} variant="secondary" className="text-xs">{a}</Badge>
                      ))}
                    </div>
                  )}
                </div>
                {room.image_url && (
                  <img src={room.image_url} alt={room.name} className="h-16 w-20 object-cover rounded" />
                )}
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" onClick={() => startEdit(room)}>Edit</Button>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteMutation.mutate(room.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Badge variant={room.is_available ? 'default' : 'secondary'} className="ml-auto">
                  {room.is_available ? 'Available' : 'Unavailable'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminRooms;
