import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { format, differenceInDays } from 'date-fns';
import { CalendarIcon, Bed, Building2, Tent, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type Room = Tables<'rooms'>;

const serviceTypes = [
  { id: 'room', icon: Bed, labelKey: 'services.rooms', descKey: 'services.rooms.desc' },
  { id: 'hall', icon: Building2, labelKey: 'services.hall', descKey: 'services.hall.desc' },
  { id: 'tent', icon: Tent, labelKey: 'services.tent', descKey: 'services.tent.desc' },
];

const foodAddOns = [
  { id: 'breakfast', labelKey: 'booking.breakfast', price: 400 },
  { id: 'lunch', labelKey: 'booking.lunch', price: 500 },
  { id: 'dinner', labelKey: 'booking.dinner', price: 500 },
];

const Booking = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [serviceType, setServiceType] = useState('');
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [tentQty, setTentQty] = useState(1);
  const [selectedFood, setSelectedFood] = useState<string[]>([]);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      const { data } = await supabase.from('rooms').select('*').eq('is_available', true);
      if (data) setRooms(data);
    };
    fetchRooms();
  }, []);

  const nights = checkIn && checkOut ? Math.max(differenceInDays(checkOut, checkIn), 1) : 0;

  const calculateTotal = () => {
    let total = 0;
    if (serviceType === 'room' && selectedRoom) {
      total += selectedRoom.price_per_night * nights;
    } else if (serviceType === 'hall') {
      total += 15000 * nights;
    } else if (serviceType === 'tent') {
      total += 1200 * tentQty * nights;
    }
    const foodPerDay = selectedFood.reduce((sum, id) => {
      const item = foodAddOns.find((f) => f.id === id);
      return sum + (item?.price || 0);
    }, 0);
    total += foodPerDay * nights;
    return total;
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!serviceType;
      case 2: return !!checkIn && !!checkOut && (serviceType !== 'room' || !!selectedRoom);
      case 3: return true;
      case 4: return guestName.trim() && guestEmail.trim() && guestPhone.trim();
      default: return true;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('bookings').insert({
        guest_name: guestName.trim(),
        guest_email: guestEmail.trim(),
        guest_phone: guestPhone.trim(),
        service_type: serviceType,
        room_id: selectedRoom?.id || null,
        check_in: format(checkIn!, 'yyyy-MM-dd'),
        check_out: format(checkOut!, 'yyyy-MM-dd'),
        add_ons: { food: selectedFood, tent_qty: tentQty },
        total_price: calculateTotal(),
      }).select().single();

      if (error) throw error;
      setBookingId(data.id.slice(0, 8).toUpperCase());
      setConfirmed(true);
      toast.success(t('booking.success'));
    } catch {
      toast.error('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    t('booking.step1'),
    t('booking.step2'),
    t('booking.step3'),
    t('booking.step4'),
    t('booking.step5'),
  ];

  if (confirmed) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center px-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md">
            <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="font-heading text-3xl font-bold mb-2">{t('booking.success')}</h2>
            <p className="text-muted-foreground mb-2">{t('booking.successMsg')}</p>
            <p className="text-sm font-mono bg-muted px-4 py-2 rounded-lg inline-block mb-6">
              Ref: #{bookingId}
            </p>
            <div>
              <Button onClick={() => navigate('/')}>{t('nav.home')}</Button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-center mb-8">
          {t('booking.title')}
        </h1>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                i + 1 <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              )}>
                {i + 1}
              </div>
              <span className="hidden sm:inline text-xs text-muted-foreground">{label}</span>
              {i < steps.length - 1 && <div className="w-6 h-px bg-border" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Step 1: Service Type */}
            {step === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {serviceTypes.map((s) => (
                  <Card
                    key={s.id}
                    className={cn(
                      'cursor-pointer transition-all hover:border-primary/40',
                      serviceType === s.id && 'border-primary ring-2 ring-primary/20'
                    )}
                    onClick={() => setServiceType(s.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <s.icon className="h-10 w-10 mx-auto mb-3 text-primary" />
                      <h3 className="font-heading font-semibold mb-1">{t(s.labelKey)}</h3>
                      <p className="text-xs text-muted-foreground">{t(s.descKey)}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Step 2: Dates & Room */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Check-in</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn('w-full justify-start', !checkIn && 'text-muted-foreground')}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkIn ? format(checkIn, 'PPP') : 'Select date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkIn}
                          onSelect={setCheckIn}
                          disabled={(date) => date < new Date()}
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Check-out</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn('w-full justify-start', !checkOut && 'text-muted-foreground')}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkOut ? format(checkOut, 'PPP') : 'Select date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkOut}
                          onSelect={setCheckOut}
                          disabled={(date) => date <= (checkIn || new Date())}
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {serviceType === 'room' && (
                  <div>
                    <h3 className="font-heading font-semibold mb-3">Select Room</h3>
                    {rooms.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No rooms available at the moment.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {rooms.map((room) => (
                          <Card
                            key={room.id}
                            className={cn(
                              'cursor-pointer transition-all hover:border-primary/40',
                              selectedRoom?.id === room.id && 'border-primary ring-2 ring-primary/20'
                            )}
                            onClick={() => setSelectedRoom(room)}
                          >
                            <CardContent className="p-4">
                              {room.image_url && (
                                <img src={room.image_url} alt={room.name} className="w-full h-32 object-cover rounded-md mb-3" loading="lazy" />
                              )}
                              <h4 className="font-semibold">{room.name}</h4>
                              <p className="text-xs text-muted-foreground">{room.type} · {room.capacity} guests</p>
                              <p className="text-sm font-semibold text-secondary mt-1">NPR {room.price_per_night.toLocaleString()}/{t('booking.perNight')}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {serviceType === 'tent' && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Number of Tents</label>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="icon" onClick={() => setTentQty(Math.max(1, tentQty - 1))}>-</Button>
                      <span className="text-lg font-semibold w-8 text-center">{tentQty}</span>
                      <Button variant="outline" size="icon" onClick={() => setTentQty(tentQty + 1)}>+</Button>
                      <span className="text-sm text-muted-foreground ml-2">× NPR 1,200/{t('booking.perNight')}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Food add-ons */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('booking.step3')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {foodAddOns.map((food) => (
                    <label key={food.id} className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        checked={selectedFood.includes(food.id)}
                        onCheckedChange={(checked) => {
                          setSelectedFood(
                            checked
                              ? [...selectedFood, food.id]
                              : selectedFood.filter((f) => f !== food.id)
                          );
                        }}
                      />
                      <span className="flex-1 font-medium">{t(food.labelKey)}</span>
                      <span className="text-sm text-muted-foreground">NPR {food.price}/person/day</span>
                    </label>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Step 4: Guest details */}
            {step === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('booking.step4')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder={t('contact.name')} value={guestName} onChange={(e) => setGuestName(e.target.value)} maxLength={100} />
                  <Input placeholder="Email" type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} maxLength={255} />
                  <Input placeholder={t('contact.phone')} value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} maxLength={20} />
                </CardContent>
              </Card>
            )}

            {/* Step 5: Summary */}
            {step === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('booking.step5')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium capitalize">{serviceType}</span>
                  </div>
                  {selectedRoom && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Room</span>
                      <span className="font-medium">{selectedRoom.name}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Dates</span>
                    <span className="font-medium">{checkIn && format(checkIn, 'MMM d')} — {checkOut && format(checkOut, 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{nights} {t('booking.nights')}</span>
                  </div>
                  {serviceType === 'tent' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tents</span>
                      <span className="font-medium">{tentQty}</span>
                    </div>
                  )}
                  {selectedFood.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Food</span>
                      <span className="font-medium">{selectedFood.map((f) => t(`booking.${f}`)).join(', ')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Guest</span>
                    <span className="font-medium">{guestName}</span>
                  </div>
                  <div className="border-t border-border pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>{t('booking.total')}</span>
                      <span className="text-primary">NPR {calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> {t('booking.back')}
          </Button>

          {step < 5 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
            >
              {t('booking.next')} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Submitting...' : t('booking.confirm')}
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Booking;
