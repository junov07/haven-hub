import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    name: 'Sarah Mitchell',
    location: 'London, UK',
    text: 'The most authentic homestay experience I\'ve ever had. The Gurung family made us feel like part of their own. The dal bhat was incredible!',
    rating: 5,
  },
  {
    name: 'Takeshi Yamamoto',
    location: 'Tokyo, Japan',
    text: 'Waking up to Annapurna views every morning was magical. The rooms are clean, the food is delicious, and the hospitality is unmatched.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    location: 'Delhi, India',
    text: 'We booked the event hall for our yoga retreat and it was perfect. The staff went above and beyond to make everything smooth.',
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-accent/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            {t('testimonials.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <Quote className="h-6 w-6 text-primary/30 mb-3" />
                  <p className="text-foreground text-sm leading-relaxed mb-4">
                    "{item.text}"
                  </p>
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: item.rating }).map((_, j) => (
                      <Star key={j} className="h-3.5 w-3.5 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.location}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
