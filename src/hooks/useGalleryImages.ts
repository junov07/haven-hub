import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useGalleryImages = () => {
  return useQuery({
    queryKey: ['gallery-images'],
    queryFn: async () => {
      const { data, error } = await supabase.from('gallery_images').select('*').order('sort_order');
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useManageGalleryImage = () => {
  const queryClient = useQueryClient();
  return {
    create: useMutation({
      mutationFn: async (img: { url: string; alt: string; category: string; sort_order?: number }) => {
        const { error } = await supabase.from('gallery_images').insert(img);
        if (error) throw error;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gallery-images'] }),
    }),
    update: useMutation({
      mutationFn: async ({ id, ...data }: { id: string; url?: string; alt?: string; category?: string; sort_order?: number }) => {
        const { error } = await supabase.from('gallery_images').update(data).eq('id', id);
        if (error) throw error;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gallery-images'] }),
    }),
    remove: useMutation({
      mutationFn: async (id: string) => {
        const { error } = await supabase.from('gallery_images').delete().eq('id', id);
        if (error) throw error;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gallery-images'] }),
    }),
  };
};
