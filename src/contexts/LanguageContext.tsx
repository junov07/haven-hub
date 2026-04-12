import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'np';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Navbar
  'nav.home': { en: 'Home', np: 'गृहपृष्ठ' },
  'nav.booking': { en: 'Book Now', np: 'बुकिङ गर्नुहोस्' },
  'nav.gallery': { en: 'Gallery', np: 'ग्यालेरी' },
  'nav.about': { en: 'About', np: 'हाम्रो बारेमा' },
  'nav.contact': { en: 'Contact', np: 'सम्पर्क' },
  'nav.admin': { en: 'Admin', np: 'एडमिन' },

  // Hero
  'hero.title': { en: 'Experience the Heart of Nepal', np: 'नेपालको हृदयको अनुभव गर्नुहोस्' },
  'hero.subtitle': { en: 'Nestled in the hills of Pokhara, our homestay offers authentic Nepali hospitality with breathtaking mountain views.', np: 'पोखराको पहाडमा बसेको, हाम्रो होमस्टेले हिमालको अद्भुत दृश्यसहित प्रामाणिक नेपाली आतिथ्य प्रदान गर्दछ।' },
  'hero.cta': { en: 'Book Now', np: 'अहिले बुक गर्नुहोस्' },
  'hero.explore': { en: 'Explore Rooms', np: 'कोठाहरू हेर्नुहोस्' },

  // Services
  'services.title': { en: 'Our Services', np: 'हाम्रा सेवाहरू' },
  'services.subtitle': { en: 'Everything you need for a perfect stay', np: 'उत्तम बसाइको लागि आवश्यक सबै कुरा' },
  'services.rooms': { en: 'Comfortable Rooms', np: 'आरामदायक कोठाहरू' },
  'services.rooms.desc': { en: 'Cozy rooms with mountain views, hot showers, and traditional decor.', np: 'हिमालको दृश्य, तातो पानी, र परम्परागत सजावटसहित आरामदायक कोठाहरू।' },
  'services.hall': { en: 'Event Hall', np: 'कार्यक्रम हल' },
  'services.hall.desc': { en: 'Spacious hall for gatherings, workshops, and celebrations up to 100 guests.', np: '१०० जना अतिथिसम्मका भेला, कार्यशाला र उत्सवका लागि ठूलो हल।' },
  'services.food': { en: 'Local Cuisine', np: 'स्थानीय खाना' },
  'services.food.desc': { en: 'Authentic Nepali meals prepared with fresh local ingredients — dal bhat, momo, and more.', np: 'ताजा स्थानीय सामग्रीबाट तयार गरिएको प्रामाणिक नेपाली खाना — दालभात, मोमो, र अन्य।' },
  'services.tent': { en: 'Tent Camping', np: 'टेन्ट क्याम्पिङ' },
  'services.tent.desc': { en: 'Camp under the stars with our quality tents and gear in a scenic hillside setting.', np: 'सुन्दर पहाडी वातावरणमा हाम्रा गुणस्तरीय टेन्ट र सामानसहित ताराहरू मुनि क्याम्प गर्नुहोस्।' },

  // Testimonials
  'testimonials.title': { en: 'What Our Guests Say', np: 'हाम्रा पाहुनाहरूको भनाइ' },

  // Gallery
  'gallery.title': { en: 'Photo Gallery', np: 'फोटो ग्यालेरी' },
  'gallery.subtitle': { en: 'Glimpses of your future stay', np: 'तपाईंको भावी बसाइको झलक' },
  'gallery.viewAll': { en: 'View All Photos', np: 'सबै फोटोहरू हेर्नुहोस्' },

  // Contact
  'contact.title': { en: 'Get in Touch', np: 'सम्पर्क गर्नुहोस्' },
  'contact.subtitle': { en: "We'd love to hear from you", np: 'हामी तपाईंको सन्देश पाउन चाहन्छौं' },
  'contact.name': { en: 'Your Name', np: 'तपाईंको नाम' },
  'contact.phone': { en: 'Phone Number', np: 'फोन नम्बर' },
  'contact.message': { en: 'Message', np: 'सन्देश' },
  'contact.send': { en: 'Send Message', np: 'सन्देश पठाउनुहोस्' },
  'contact.address': { en: 'Lakeside, Pokhara, Nepal', np: 'लेकसाइड, पोखरा, नेपाल' },
  'contact.email': { en: 'info@himalayhomestay.com', np: 'info@himalayhomestay.com' },
  'contact.phoneNum': { en: '+977 61-123456', np: '+977 61-123456' },

  // Booking
  'booking.title': { en: 'Book Your Stay', np: 'तपाईंको बसाइ बुक गर्नुहोस्' },
  'booking.step1': { en: 'Select Service', np: 'सेवा छान्नुहोस्' },
  'booking.step2': { en: 'Choose Dates', np: 'मिति छान्नुहोस्' },
  'booking.step3': { en: 'Add Food', np: 'खाना थप्नुहोस्' },
  'booking.step4': { en: 'Your Details', np: 'तपाईंको विवरण' },
  'booking.step5': { en: 'Summary', np: 'सारांश' },
  'booking.next': { en: 'Next', np: 'अर्को' },
  'booking.back': { en: 'Back', np: 'पछाडि' },
  'booking.confirm': { en: 'Confirm Booking', np: 'बुकिङ पुष्टि गर्नुहोस्' },
  'booking.success': { en: 'Booking Confirmed!', np: 'बुकिङ पुष्टि भयो!' },
  'booking.successMsg': { en: 'Your booking has been submitted. We will contact you shortly.', np: 'तपाईंको बुकिङ पेश गरिएको छ। हामी चाँडै सम्पर्क गर्नेछौं।' },
  'booking.total': { en: 'Total', np: 'जम्मा' },
  'booking.nights': { en: 'nights', np: 'रातहरू' },
  'booking.perNight': { en: 'per night', np: 'प्रति रात' },
  'booking.breakfast': { en: 'Breakfast', np: 'बिहानको खाना' },
  'booking.lunch': { en: 'Lunch', np: 'दिउँसोको खाना' },
  'booking.dinner': { en: 'Dinner', np: 'बेलुकाको खाना' },

  // About
  'about.title': { en: 'About Himalay Homestay', np: 'हिमालय होमस्टे बारेमा' },
  'about.story': { en: 'Our Story', np: 'हाम्रो कथा' },
  'about.storyText': { en: 'Founded in 2015 by the Gurung family, Himalay Homestay started as a small two-room home in the hills of Pokhara. Over the years, our warm hospitality and love for sharing Nepali culture has turned us into one of the most beloved homestays in the region. Today we offer 8 beautifully decorated rooms, a spacious event hall, tent camping, and authentic home-cooked meals.', np: '२०१५ मा गुरुङ परिवारद्वारा स्थापित, हिमालय होमस्टे पोखराको पहाडमा दुई कोठाको सानो घरबाट सुरु भएको थियो। वर्षौंको अवधिमा, हाम्रो न्यानो आतिथ्य र नेपाली संस्कृति साझा गर्ने प्रेमले हामीलाई क्षेत्रको सबैभन्दा प्रिय होमस्टेमध्ये एकमा परिणत गरेको छ।' },
  'about.mission': { en: 'Our Mission', np: 'हाम्रो उद्देश्य' },
  'about.missionText': { en: 'To provide travelers with an authentic, immersive Nepali experience while supporting the local community and preserving our cultural heritage.', np: 'स्थानीय समुदायलाई सहयोग गर्दै र हाम्रो सांस्कृतिक सम्पदा संरक्षण गर्दै यात्रुहरूलाई प्रामाणिक, गहन नेपाली अनुभव प्रदान गर्नु।' },

  // Footer
  'footer.tagline': { en: 'Your home away from home in the heart of Nepal', np: 'नेपालको हृदयमा तपाईंको दोस्रो घर' },
  'footer.quickLinks': { en: 'Quick Links', np: 'द्रुत लिंकहरू' },
  'footer.contactUs': { en: 'Contact Us', np: 'सम्पर्क गर्नुहोस्' },
  'footer.rights': { en: '© 2026 Himalay Homestay. All rights reserved.', np: '© २०२६ हिमालय होमस्टे। सर्वाधिकार सुरक्षित।' },

  // Chatbot
  'chat.title': { en: 'Chat with us', np: 'हामीसँग कुरा गर्नुहोस्' },
  'chat.placeholder': { en: 'Ask about rooms, booking, food...', np: 'कोठा, बुकिङ, खानाको बारेमा सोध्नुहोस्...' },
  'chat.welcome': { en: 'Namaste! 🙏 How can I help you today?', np: 'नमस्ते! 🙏 आज म तपाईंलाई कसरी मद्दत गर्न सक्छु?' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
