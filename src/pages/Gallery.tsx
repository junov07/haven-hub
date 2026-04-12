import { useState } from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const categories = ['All', 'Rooms', 'Food', 'Events', 'Tents'] as const;

const images = [
  { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80', category: 'Rooms', alt: 'Deluxe Room' },
  { url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80', category: 'Rooms', alt: 'Mountain View Room' },
  { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', category: 'Rooms', alt: 'Traditional Room' },
  { url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80', category: 'Food', alt: 'Dal Bhat Set' },
  { url: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80', category: 'Food', alt: 'Nepali Momo' },
  { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', category: 'Food', alt: 'Local Cuisine' },
  { url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80', category: 'Events', alt: 'Cultural Evening' },
  { url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80', category: 'Events', alt: 'Group Event' },
  { url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80', category: 'Tents', alt: 'Camping Setup' },
  { url: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80', category: 'Tents', alt: 'Mountain Camping' },
  { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80', category: 'Rooms', alt: 'Suite' },
  { url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80', category: 'Food', alt: 'Breakfast Spread' },
];

const Gallery = () => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const filtered = activeCategory === 'All' ? images : images.filter((img) => img.category === activeCategory);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-center mb-3">
          {t('gallery.title')}
        </h1>
        <p className="text-center text-muted-foreground mb-8">{t('gallery.subtitle')}</p>

        {/* Category filter */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Image grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((img, i) => (
            <motion.div
              key={img.url}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="aspect-square rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setLightboxImg(img.url)}
            >
              <img
                src={img.url}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
            onClick={() => setLightboxImg(null)}
          >
            <button className="absolute top-4 right-4 text-primary-foreground" onClick={() => setLightboxImg(null)}>
              <X className="h-8 w-8" />
            </button>
            <img src={lightboxImg.replace('w=800', 'w=1400')} alt="" className="max-w-full max-h-[90vh] rounded-lg object-contain" />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Gallery;
