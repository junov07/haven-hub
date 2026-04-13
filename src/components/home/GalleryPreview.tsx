import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGalleryImages } from '@/hooks/useGalleryImages';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const GalleryPreview = () => {
  const { t } = useLanguage();
  const { data: images = [] } = useGalleryImages();

  const previewImages = images.slice(0, 6);

  if (previewImages.length === 0) return null;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            {t('gallery.title')}
          </h2>
          <p className="text-muted-foreground text-lg">{t('gallery.subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {previewImages.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="aspect-[4/3] rounded-lg overflow-hidden"
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

        <div className="text-center mt-8">
          <Button asChild variant="outline" size="lg">
            <Link to="/gallery">
              {t('gallery.viewAll')} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GalleryPreview;
