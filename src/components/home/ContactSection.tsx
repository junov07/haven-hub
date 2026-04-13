import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ContactSection = () => {
  const { t } = useLanguage();
  const { data: settings } = useSiteSettings();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', message: '' });

  const address = settings?.contact_address || t('contact.address');
  const phone = settings?.contact_phone || t('contact.phoneNum');
  const email = settings?.contact_email || t('contact.email');
  const mapUrl = settings?.contact_map_url || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3516.3!2d83.9510!3d28.2096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDEyJzM0LjYiTiA4M8KwNTcnMDMuNiJF!5e0!3m2!1sen!2snp!4v1';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: form.name.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
      });
      if (error) throw error;
      toast.success(t('contact.send') + ' ✓');
      setForm({ name: '', phone: '', message: '' });
    } catch {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-accent/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            {t('contact.title')}
          </h2>
          <p className="text-muted-foreground text-lg">{t('contact.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder={t('contact.name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} />
              <Input placeholder={t('contact.phone')} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={20} />
              <Textarea placeholder={t('contact.message')} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} maxLength={1000} />
              <Button type="submit" disabled={loading} className="w-full">
                <Send className="mr-2 h-4 w-4" />
                {t('contact.send')}
              </Button>
            </form>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>{email}</span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-lg overflow-hidden h-80 lg:h-full min-h-[300px]">
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Himalay Homestay Location"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
