import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

const HeroSection = () => {
  const { t } = useLanguage();
  const { data: settings } = useSiteSettings();

  const heroImage = settings?.hero_image || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&q=80';
  const heroTitle = settings?.hero_title || t('hero.title');
  const heroSubtitle = settings?.hero_subtitle || t('hero.subtitle');
  const heroCta = settings?.hero_cta || t('hero.cta');

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${heroImage}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
            ))}
            <span className="text-primary-foreground/90 text-sm ml-1">4.9 · 120+ reviews</span>
          </div>

          <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-primary-foreground leading-tight mb-6">
            {heroTitle}
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/85 mb-8 leading-relaxed max-w-xl">
            {heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" className="text-base px-8">
              <Link to="/booking">
                {heroCta} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base px-8 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground">
              <Link to="/gallery">{t('hero.explore')}</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
