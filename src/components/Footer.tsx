import { Link } from 'react-router-dom';
import { Mountain, MapPin, Phone, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const Footer = () => {
  const { t } = useLanguage();
  const { data: settings } = useSiteSettings();

  const siteName = settings?.site_name || 'Himalay Homestay';
  const logoUrl = settings?.logo_url;
  const tagline = settings?.footer_tagline || t('footer.tagline');
  const address = settings?.contact_address || t('contact.address');
  const phone = settings?.contact_phone || t('contact.phoneNum');
  const email = settings?.contact_email || t('contact.email');

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              {logoUrl ? (
                <img src={logoUrl} alt={siteName} className="h-6 w-6 object-contain rounded" />
              ) : (
                <Mountain className="h-6 w-6" />
              )}
              <span className="font-heading font-bold text-lg">{siteName}</span>
            </div>
            <p className="text-sm opacity-80">{tagline}</p>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <div className="space-y-2">
              {[
                { to: '/', label: t('nav.home') },
                { to: '/booking', label: t('nav.booking') },
                { to: '/gallery', label: t('nav.gallery') },
                { to: '/about', label: t('nav.about') },
                { to: '/contact', label: t('nav.contact') },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="block text-sm opacity-80 hover:opacity-100 transition-opacity">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">{t('footer.contactUs')}</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm opacity-80">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm opacity-80">
                <Phone className="h-4 w-4 shrink-0" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm opacity-80">
                <Mail className="h-4 w-4 shrink-0" />
                <span>{email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-sm opacity-60">
          {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
