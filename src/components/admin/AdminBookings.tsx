import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X } from 'lucide-react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AdminBookings = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'confirmed' | 'cancelled' }) => {
      const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast.success(`Booking ${status}`);
    },
    onError: () => toast.error('Failed to update'),
  });

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  const statusColor = (s: string) => {
    switch (s) {
      case 'confirmed': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  if (isLoading) return <p className="text-muted-foreground p-4">Loading...</p>;

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {['all', 'pending', 'confirmed', 'cancelled'].map((f) => (
          <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm" onClick={() => setFilter(f)} className="capitalize">
            {f}
          </Button>
        ))}
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((b) => (
              <TableRow key={b.id}>
                <TableCell>
                  <p className="font-medium">{b.guest_name}</p>
                  <p className="text-xs text-muted-foreground">{b.guest_phone}</p>
                </TableCell>
                <TableCell className="capitalize">{b.service_type}</TableCell>
                <TableCell className="text-sm">{b.check_in} → {b.check_out}</TableCell>
                <TableCell className="font-semibold">NPR {b.total_price.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={statusColor(b.status) as any}>{b.status}</Badge>
                </TableCell>
                <TableCell>
                  {b.status === 'pending' && (
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => updateStatus.mutate({ id: b.id, status: 'confirmed' })}>
                        <Check className="h-4 w-4 text-primary" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => updateStatus.mutate({ id: b.id, status: 'cancelled' })}>
                        <X className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No bookings found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminBookings;
