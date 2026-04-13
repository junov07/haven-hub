import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useTestimonials = (visibleOnly = true) => {
  return useQuery({
    queryKey: ['testimonials', visibleOnly],
    queryFn: async () => {
      let query = supabase.from('testimonials').select('*').order('created_at', { ascending: false });
      if (visibleOnly) query = query.eq('is_visible', true);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useManageTestimonial = () => {
  const queryClient = useQueryClient();
  return {
    create: useMutation({
      mutationFn: async (testimonial: { name: string; location: string; text: string; rating: number }) => {
        const { error } = await supabase.from('testimonials').insert(testimonial);
        if (error) throw error;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['testimonials'] }),
    }),
    update: useMutation({
      mutationFn: async ({ id, ...data }: { id: string; name?: string; location?: string; text?: string; rating?: number; is_visible?: boolean }) => {
        const { error } = await supabase.from('testimonials').update(data).eq('id', id);
        if (error) throw error;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['testimonials'] }),
    }),
    remove: useMutation({
      mutationFn: async (id: string) => {
        const { error } = await supabase.from('testimonials').delete().eq('id', id);
        if (error) throw error;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['testimonials'] }),
    }),
  };
};
