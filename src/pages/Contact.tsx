import { useState } from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Contact = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', message: '' });

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
      toast.success('Message sent successfully!');
      setForm({ name: '', phone: '', message: '' });
    } catch {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-center mb-3">
          {t('contact.title')}
        </h1>
        <p className="text-center text-muted-foreground mb-10">{t('contact.subtitle')}</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder={t('contact.name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} />
              <Input placeholder={t('contact.phone')} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={20} />
              <Textarea placeholder={t('contact.message')} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={6} maxLength={1000} />
              <Button type="submit" disabled={loading} className="w-full">
                <Send className="mr-2 h-4 w-4" /> {t('contact.send')}
              </Button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              {[
                { icon: MapPin, title: 'Address', value: t('contact.address') },
                { icon: Phone, title: 'Phone', value: t('contact.phoneNum') },
                { icon: Mail, title: 'Email', value: t('contact.email') },
                { icon: Clock, title: 'Hours', value: '24/7 Check-in Available' },
              ].map((item) => (
                <Card key={item.title}>
                  <CardContent className="p-4 flex items-start gap-3">
                    <item.icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">{item.title}</p>
                      <p className="text-sm font-medium">{item.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="rounded-lg overflow-hidden h-80 lg:h-full min-h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3516.3!2d83.9510!3d28.2096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDEyJzM0LjYiTiA4M8KwNTcnMDMuNiJF!5e0!3m2!1sen!2snp!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Map"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
