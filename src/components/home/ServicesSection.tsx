import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Bed, Building2, UtensilsCrossed, Tent } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const services = [
  { icon: Bed, titleKey: 'services.rooms', descKey: 'services.rooms.desc', price: 'NPR 2,500/night' },
  { icon: Building2, titleKey: 'services.hall', descKey: 'services.hall.desc', price: 'NPR 15,000/day' },
  { icon: UtensilsCrossed, titleKey: 'services.food', descKey: 'services.food.desc', price: 'NPR 500/meal' },
  { icon: Tent, titleKey: 'services.tent', descKey: 'services.tent.desc', price: 'NPR 1,200/night' },
];

const ServicesSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            {t('services.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full hover:border-primary/30 transition-colors group">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <service.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2 text-foreground">
                    {t(service.titleKey)}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {t(service.descKey)}
                  </p>
                  <span className="text-sm font-semibold text-secondary">
                    {service.price}
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
