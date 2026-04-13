import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { motion } from 'framer-motion';
import { Heart, Users, Mountain, Leaf } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const defaultHighlights = [
  { icon: Heart, value: '8+', label: 'Years of Hospitality' },
  { icon: Users, value: '5000+', label: 'Happy Guests' },
  { icon: Mountain, value: '360°', label: 'Mountain Views' },
  { icon: Leaf, value: '100%', label: 'Organic Food' },
];

const About = () => {
  const { t } = useLanguage();
  const { data: settings } = useSiteSettings();

  const story = settings?.about_story || t('about.storyText');
  const mission = settings?.about_mission || t('about.missionText');

  let highlights = defaultHighlights;
  if (settings?.about_highlights) {
    try {
      const h = JSON.parse(settings.about_highlights);
      highlights = [
        { icon: Heart, value: h.years || '8+', label: 'Years of Hospitality' },
        { icon: Users, value: h.guests || '5000+', label: 'Happy Guests' },
        { icon: Mountain, value: h.rating || '4.8', label: 'Star Rating' },
        { icon: Leaf, value: h.rooms || '12', label: 'Rooms' },
      ];
    } catch {}
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12">
          {t('about.title')}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-2xl font-bold mb-4">{t('about.story')}</h2>
            <p className="text-muted-foreground leading-relaxed">{story}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80"
              alt="Himalay Homestay"
              className="w-full h-72 lg:h-96 object-cover rounded-lg"
              loading="lazy"
            />
          </motion.div>
        </div>

        <div className="bg-primary/5 rounded-2xl p-8 mb-16 text-center max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl font-bold mb-4">{t('about.mission')}</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">{mission}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {highlights.map((h, i) => (
            <motion.div key={h.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Card className="text-center">
                <CardContent className="p-6">
                  <h.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="font-heading text-2xl font-bold text-foreground">{h.value}</p>
                  <p className="text-xs text-muted-foreground">{h.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default About;
