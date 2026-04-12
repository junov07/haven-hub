import Layout from '@/components/Layout';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import GalleryPreview from '@/components/home/GalleryPreview';
import ContactSection from '@/components/home/ContactSection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ServicesSection />
      <TestimonialsSection />
      <GalleryPreview />
      <ContactSection />
    </Layout>
  );
};

export default Index;
