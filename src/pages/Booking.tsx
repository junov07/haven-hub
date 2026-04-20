import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { format, differenceInDays, addDays } from 'date-fns';
import { CalendarIcon, Bed, Building2, Tent, CheckCircle2, Minus, Plus, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { z } from 'zod';
import type { Tables } from '@/integrations/supabase/types';

type Room = Tables<'rooms'>;

const serviceTypes = [
  { id: 'room', icon: Bed, labelKey: 'services.rooms' },
  { id: 'hall', icon: Building2, labelKey: 'services.hall' },
  { id: 'tent', icon: Tent, labelKey: 'services.tent' },
];

const foodAddOns = [
  { id: 'breakfast', labelKey: 'booking.breakfast', price: 400 },
  { id: 'lunch', labelKey: 'booking.lunch', price: 500 },
  { id: 'dinner', labelKey: 'booking.dinner', price: 500 },
];

const bookingSchema = z.object({
  guestName: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  guestPhone: z.string().trim().min(7, 'Enter a valid phone number').max(20),
  guestEmail: z.string().trim().email('Invalid email').max(255).optional().or(z.literal('')),
});

const Booking = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [serviceType, setServiceType] = useState<string>(searchParams.get('service') || 'room');
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
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
    (async () => {
      const { data } = await supabase.from('rooms').select('*').eq('is_available', true);
      if (data) {
        setRooms(data);
        const preselect = searchParams.get('room');
        if (preselect) {
          const match = data.find((r) => r.id === preselect);
          if (match) {
            setSelectedRoom(match);
            setServiceType('room');
          }
        }
      }
    })();
  }, [searchParams]);

  const nights = checkIn && checkOut ? Math.max(differenceInDays(checkOut, checkIn), 1) : 0;

  const total = useMemo(() => {
    let sum = 0;
    if (serviceType === 'room' && selectedRoom) sum += selectedRoom.price_per_night * nights;
    else if (serviceType === 'hall') sum += 15000 * nights;
    else if (serviceType === 'tent') sum += 1200 * tentQty * nights;
    const foodPerDay = selectedFood.reduce((s, id) => s + (foodAddOns.find((f) => f.id === id)?.price || 0), 0);
    sum += foodPerDay * nights;
    return sum;
  }, [serviceType, selectedRoom, nights, tentQty, selectedFood]);

  const validationError = useMemo(() => {
    if (!serviceType) return 'Select a service';
    if (!checkIn || !checkOut) return 'Pick check-in and check-out dates';
    if (serviceType === 'room' && !selectedRoom) return 'Select a room';
    if (!guestName.trim() || guestName.trim().length < 2) return 'Enter your name';
    if (!guestPhone.trim() || guestPhone.trim().length < 7) return 'Enter your phone number';
    return null;
  }, [serviceType, checkIn, checkOut, selectedRoom, guestName, guestPhone]);

  const handleSubmit = async () => {
    const parsed = bookingSchema.safeParse({ guestName, guestPhone, guestEmail });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (validationError) {
      toast.error(validationError);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.from('bookings').insert({
        guest_name: guestName.trim(),
        guest_email: guestEmail.trim() || 'not-provided@himalay.local',
        guest_phone: guestPhone.trim(),
        service_type: serviceType,
        room_id: selectedRoom?.id || null,
        check_in: format(checkIn!, 'yyyy-MM-dd'),
        check_out: format(checkOut!, 'yyyy-MM-dd'),
        add_ons: { food: selectedFood, tent_qty: tentQty },
        total_price: total,
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

  if (confirmed) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center px-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md">
            <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="font-heading text-3xl font-bold mb-2">{t('booking.success')}</h2>
            <p className="text-muted-foreground mb-2">{t('booking.successMsg')}</p>
            <p className="text-sm font-mono bg-muted px-4 py-2 rounded-lg inline-block mb-6">Ref: #{bookingId}</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => window.location.reload()}>Book another</Button>
              <Button onClick={() => navigate('/')}>{t('nav.home')}</Button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">{t('booking.title')}</h1>
          <p className="text-muted-foreground">Quick & easy — book in under a minute</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          {/* Form */}
          <div className="space-y-6">
            {/* Service */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-heading font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">1. Service</h3>
                <div className="grid grid-cols-3 gap-3">
                  {serviceTypes.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setServiceType(s.id)}
                      className={cn(
                        'p-4 rounded-lg border-2 transition-all text-center',
                        serviceType === s.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
                      )}
                    >
                      <s.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="text-sm font-medium">{t(s.labelKey)}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dates */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-heading font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">2. Dates</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn('justify-start font-normal', !checkIn && 'text-muted-foreground')}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkIn ? format(checkIn, 'MMM d, yyyy') : 'Check-in'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkIn}
                        onSelect={(d) => {
                          setCheckIn(d);
                          if (d && (!checkOut || checkOut <= d)) setCheckOut(addDays(d, 1));
                        }}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn('justify-start font-normal', !checkOut && 'text-muted-foreground')}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkOut ? format(checkOut, 'MMM d, yyyy') : 'Check-out'}
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
                {nights > 0 && <p className="text-xs text-muted-foreground mt-2">{nights} {t('booking.nights')}</p>}
              </CardContent>
            </Card>

            {/* Room / Tent */}
            {serviceType === 'room' && (
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-heading font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">3. Choose room</h3>
                  {rooms.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No rooms available right now.</p>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {rooms.map((room) => (
                        <button
                          key={room.id}
                          type="button"
                          onClick={() => setSelectedRoom(room)}
                          className={cn(
                            'text-left rounded-lg border-2 overflow-hidden transition-all',
                            selectedRoom?.id === room.id ? 'border-primary' : 'border-border hover:border-primary/40'
                          )}
                        >
                          {room.image_url && (
                            <img src={room.image_url} alt={room.name} className="w-full h-28 object-cover" loading="lazy" />
                          )}
                          <div className="p-3">
                            <div className="font-semibold text-sm">{room.name}</div>
                            <div className="text-xs text-muted-foreground">{room.type} · {room.capacity} guests</div>
                            <div className="text-sm font-semibold text-secondary mt-1">NPR {room.price_per_night.toLocaleString()}/{t('booking.perNight')}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {serviceType === 'tent' && (
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-heading font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">3. Tents</h3>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" onClick={() => setTentQty(Math.max(1, tentQty - 1))}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-semibold w-10 text-center">{tentQty}</span>
                    <Button variant="outline" size="icon" onClick={() => setTentQty(tentQty + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground ml-2">× NPR 1,200/{t('booking.perNight')}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Food */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-heading font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                  {serviceType === 'hall' ? '3' : '4'}. Food <span className="normal-case text-xs text-muted-foreground font-normal">(optional)</span>
                </h3>
                <div className="grid sm:grid-cols-3 gap-2">
                  {foodAddOns.map((food) => {
                    const checked = selectedFood.includes(food.id);
                    return (
                      <label
                        key={food.id}
                        className={cn(
                          'flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all',
                          checked ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
                        )}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(c) => setSelectedFood(c ? [...selectedFood, food.id] : selectedFood.filter((f) => f !== food.id))}
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{t(food.labelKey)}</div>
                          <div className="text-xs text-muted-foreground">NPR {food.price}/day</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Guest */}
            <Card>
              <CardContent className="p-5 space-y-3">
                <h3 className="font-heading font-semibold mb-1 text-sm uppercase tracking-wide text-muted-foreground">Your details</h3>
                <Input placeholder={t('contact.name') + ' *'} value={guestName} onChange={(e) => setGuestName(e.target.value)} maxLength={100} />
                <Input placeholder={t('contact.phone') + ' *'} value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} maxLength={20} />
                <Input placeholder="Email (optional)" type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} maxLength={255} />
              </CardContent>
            </Card>
          </div>

          {/* Sticky summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card className="border-primary/20">
              <CardContent className="p-5">
                <h3 className="font-heading font-semibold mb-4">{t('booking.step5')}</h3>
                <div className="space-y-2 text-sm">
                  <Row label="Service" value={<span className="capitalize">{serviceType || '—'}</span>} />
                  {selectedRoom && <Row label="Room" value={selectedRoom.name} />}
                  {serviceType === 'tent' && <Row label="Tents" value={tentQty} />}
                  <Row label="Dates" value={checkIn && checkOut ? `${format(checkIn, 'MMM d')} → ${format(checkOut, 'MMM d')}` : '—'} />
                  <Row label="Nights" value={nights || '—'} />
                  {selectedFood.length > 0 && (
                    <Row label="Food" value={selectedFood.map((f) => t(`booking.${f}`)).join(', ')} />
                  )}
                </div>
                <div className="border-t border-border mt-4 pt-4">
                  <div className="flex justify-between items-baseline mb-4">
                    <span className="font-semibold">{t('booking.total')}</span>
                    <span className="text-2xl font-bold text-primary">NPR {total.toLocaleString()}</span>
                  </div>
                  <Button onClick={handleSubmit} disabled={loading || !!validationError} className="w-full" size="lg">
                    {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Booking...</> : t('booking.confirm')}
                  </Button>
                  {validationError && (
                    <p className="text-xs text-muted-foreground text-center mt-2">{validationError}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between gap-3">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-right">{value}</span>
  </div>
);

export default Booking;
