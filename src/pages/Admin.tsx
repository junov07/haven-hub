import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { LogOut, Settings, Bed, UtensilsCrossed, Image, MessageSquare, Star, FileText, Phone, CalendarCheck } from 'lucide-react';
import AdminSiteSettings from '@/components/admin/AdminSiteSettings';
import AdminRooms from '@/components/admin/AdminRooms';
import AdminServices from '@/components/admin/AdminServices';
import AdminGallery from '@/components/admin/AdminGallery';
import AdminTestimonials from '@/components/admin/AdminTestimonials';
import AdminAbout from '@/components/admin/AdminAbout';
import AdminContact from '@/components/admin/AdminContact';
import AdminMessages from '@/components/admin/AdminMessages';
import AdminBookings from '@/components/admin/AdminBookings';

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      onLogin();
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-sm">
          <CardHeader><CardTitle>Admin Login</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

const Admin = () => {
  const [authed, setAuthed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setAuthed(true);
        const { data } = await supabase.rpc('has_role', { _user_id: session.user.id, _role: 'admin' });
        setIsAdmin(!!data);
      }
      setChecking(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (session) {
        setAuthed(true);
        const { data } = await supabase.rpc('has_role', { _user_id: session.user.id, _role: 'admin' });
        setIsAdmin(!!data);
      } else {
        setAuthed(false);
        setIsAdmin(false);
      }
    });

    checkAuth();
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthed(false);
    setIsAdmin(false);
  };

  if (checking) return <Layout><div className="flex items-center justify-center min-h-[60vh]"><p>Loading...</p></div></Layout>;
  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;
  if (!isAdmin) return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted-foreground">You do not have admin access.</p>
        <Button variant="outline" onClick={handleLogout}>Sign Out</Button>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-2xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>

        <Tabs defaultValue="settings" className="space-y-4">
          <TabsList className="flex flex-wrap h-auto gap-1">
            <TabsTrigger value="settings" className="gap-1.5"><Settings className="h-4 w-4" /> Site</TabsTrigger>
            <TabsTrigger value="rooms" className="gap-1.5"><Bed className="h-4 w-4" /> Rooms</TabsTrigger>
            <TabsTrigger value="services" className="gap-1.5"><UtensilsCrossed className="h-4 w-4" /> Services</TabsTrigger>
            <TabsTrigger value="gallery" className="gap-1.5"><Image className="h-4 w-4" /> Gallery</TabsTrigger>
            <TabsTrigger value="testimonials" className="gap-1.5"><Star className="h-4 w-4" /> Reviews</TabsTrigger>
            <TabsTrigger value="about" className="gap-1.5"><FileText className="h-4 w-4" /> About</TabsTrigger>
            <TabsTrigger value="contact" className="gap-1.5"><Phone className="h-4 w-4" /> Contact</TabsTrigger>
            <TabsTrigger value="bookings" className="gap-1.5"><CalendarCheck className="h-4 w-4" /> Bookings</TabsTrigger>
            <TabsTrigger value="messages" className="gap-1.5"><MessageSquare className="h-4 w-4" /> Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="settings"><AdminSiteSettings /></TabsContent>
          <TabsContent value="rooms"><AdminRooms /></TabsContent>
          <TabsContent value="services"><AdminServices /></TabsContent>
          <TabsContent value="gallery"><AdminGallery /></TabsContent>
          <TabsContent value="testimonials"><AdminTestimonials /></TabsContent>
          <TabsContent value="about"><AdminAbout /></TabsContent>
          <TabsContent value="contact"><AdminContact /></TabsContent>
          <TabsContent value="bookings"><AdminBookings /></TabsContent>
          <TabsContent value="messages"><AdminMessages /></TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
