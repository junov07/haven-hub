import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const quickReplies: Record<string, string> = {
  'rooms': 'We have 8 rooms available: Standard (NPR 2,500/night), Deluxe (NPR 3,500/night), and Suite (NPR 5,000/night). All rooms include mountain views, hot showers, and free Wi-Fi. Would you like to book one?',
  'food': 'We serve authentic Nepali cuisine:\n• Breakfast: NPR 400 (includes tea, eggs, toast, fruits)\n• Lunch: NPR 500 (dal bhat, vegetables, pickle)\n• Dinner: NPR 500 (dal bhat or special Nepali thali)\n\nAll meals are prepared fresh with local ingredients!',
  'tent': 'Tent camping is NPR 1,200 per tent per night. We provide quality 2-person tents, sleeping bags, and mats. The campsite has stunning mountain views. You can add it to your booking.',
  'hall': 'Our event hall accommodates up to 100 guests. It\'s NPR 15,000/day and is perfect for workshops, retreats, and celebrations. Contact us for availability!',
  'booking': 'To make a booking, click "Book Now" in the menu or visit our booking page. You can select rooms, tents, or the hall, choose dates, and add food services. We\'ll confirm within 24 hours!',
  'location': 'We\'re located in Lakeside, Pokhara, Nepal — just 10 minutes from Phewa Lake. The nearest airport is Pokhara Airport (PKR). We can arrange airport pickup for NPR 1,500.',
  'payment': 'We accept cash (NPR), and we\'re setting up Khalti and eSewa for online payments soon. For international guests, we also accept USD at the current exchange rate.',
  'checkin': 'Check-in is from 2:00 PM and check-out is by 11:00 AM. Early check-in and late check-out are available on request based on availability.',
};

const ChatBot = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '' },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ role: 'assistant', content: t('chat.welcome') }]);
  }, [t]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim().toLowerCase();
    setMessages((prev) => [...prev, { role: 'user', content: input.trim() }]);
    setInput('');

    // Simple keyword matching for quick responses
    setTimeout(() => {
      let reply = "Thank you for your message! 🙏 For specific inquiries, please contact us at +977 61-123456 or visit our booking page. Our team will be happy to help!";

      for (const [key, value] of Object.entries(quickReplies)) {
        if (userMsg.includes(key)) {
          reply = value;
          break;
        }
      }

      // Check for greetings
      if (/^(hi|hello|hey|namaste|नमस्ते)/.test(userMsg)) {
        reply = "Namaste! 🙏 Welcome to Himalay Homestay. How can I help you today? You can ask about:\n• Rooms & pricing\n• Food & meals\n• Tent camping\n• Event hall\n• Booking process\n• Location & directions";
      }

      // Check for price/cost
      if (userMsg.includes('price') || userMsg.includes('cost') || userMsg.includes('rate')) {
        reply = "Our pricing:\n• Standard Room: NPR 2,500/night\n• Deluxe Room: NPR 3,500/night\n• Suite: NPR 5,000/night\n• Tent: NPR 1,200/night\n• Event Hall: NPR 15,000/day\n• Breakfast: NPR 400 | Lunch/Dinner: NPR 500\n\nBook now to get the best rates!";
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    }, 600);
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-105 transition-transform ${isOpen ? 'hidden' : ''}`}
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[340px] max-w-[calc(100vw-2rem)] bg-card border border-border rounded-xl shadow-xl flex flex-col overflow-hidden"
            style={{ height: '450px' }}
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between shrink-0">
              <span className="font-heading font-semibold text-sm">{t('chat.title')}</span>
              <button onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t border-border p-3 flex gap-2 shrink-0">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('chat.placeholder')}
                className="text-sm"
              />
              <Button size="icon" onClick={handleSend} disabled={!input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
