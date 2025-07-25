import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// UI & Auth Imports
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuthStore } from '@/stores/auth.store';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

// --- LOGIN FORM COMPONENT (with larger logo) ---
const LoginForm = () => {
    const { setUser } = useAuthStore();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        setIsLoading(true);
        try {
            const { data } = await api.post('/auth/google', { token: credentialResponse.credential });
            setUser(data, data.token);
            toast.success(`Welcome back, ${data.name.split(' ')[0]}!`);
            navigate('/app');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto bg-card/90 backdrop-blur-sm border-2 shadow-2xl">
            <CardHeader className="text-center space-y-4">
                {/* Bigger Logo in Sign-in Card */}
                <img src="https://storage.googleapis.com/sample-bucket-for-nova/website-images/nova.png" alt="Nova Logo" className="w-20 h-20 mx-auto"/>
                <CardTitle className="text-3xl font-bold">Welcome to Nova</CardTitle>
                <CardDescription className="text-muted-foreground">Sign in to continue your journey of innovation.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <div className='flex justify-center'>
                     {isLoading ? <div className='flex justify-center items-center h-10'><Loader2 className="w-8 h-8 animate-spin text-primary" /></div> : <GoogleLogin onSuccess={handleLoginSuccess} onError={() => toast.error('Google sign-in failed.')} theme="outline" shape='pill' width="340px"/>}
                </div>
                <div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or become a member</span></div></div>
                <Link to="/register"><Button variant="secondary" className="w-full">Create a new account</Button></Link>
            </CardContent>
        </Card>
    );
};

// --- REGISTER FORM COMPONENT (with larger logo) ---
const RegisterForm = () => {
  // ... (RegisterForm logic remains the same)
  const [formData, setFormData] = useState({ name: '', email: '', specialization: '', role: '', site: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSelectChange = (name: string, value: string) => setFormData({ ...formData, [name]: value });
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setIsLoading(true); try { await api.post('/auth/register', formData); toast.success('Registration successful! Please sign in.'); navigate('/'); } catch (error: any) { const errorMessage = error.response?.data?.message || 'Registration failed.'; toast.error(errorMessage); } finally { setIsLoading(false); } };
  const specializations = ["Compute Engine", "DevOps", "GKE and Anthos", "Networking", "Security", "Database", "Storage", "Data Analytics", "AI/ML", "Apigee"];
  const roles = ["TSR/SME", "Lead", "QM", "OM", "EM", "QA"];
  const sites = ["CGN-HYD", "CGN-TelAviv", "CGN-BUH", "CGN-CBE"];

  return (
    <Card className="w-full max-w-md mx-auto bg-card/90 backdrop-blur-sm border-2 shadow-2xl">
      <CardHeader className='text-center space-y-4'>
        {/* Bigger Logo in Register Card */}
        <img src="https://storage.googleapis.com/sample-bucket-for-nova/website-images/nova.png" alt="Nova Logo" className="w-20 h-20 mx-auto"/>
        <CardTitle className="text-3xl font-bold">Join Nova</CardTitle>
        <CardDescription className="text-muted-foreground">Fill out your details to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2"><Label htmlFor="name">Full Name</Label><Input id="name" name="name" type="text" placeholder="Your full name" required onChange={handleInputChange} /></div>
          <div className="grid gap-2"><Label htmlFor="email">Work Email</Label><Input id="email" name="email" type="email" placeholder="name@google.com or name@cognizant.com" required onChange={handleInputChange} /></div>
          <div className="grid gap-2"><Label>Specialization</Label><Select name="specialization" required onValueChange={(value) => handleSelectChange('specialization', value)}><SelectTrigger><SelectValue placeholder="Select your specialization" /></SelectTrigger><SelectContent>{specializations.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2"><Label>Role</Label><Select name="role" required onValueChange={(value) => handleSelectChange('role', value)}><SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger><SelectContent>{roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select></div>
            <div className="grid gap-2"><Label>Site</Label><Select name="site" required onValueChange={(value) => handleSelectChange('site', value)}><SelectTrigger><SelectValue placeholder="Site" /></SelectTrigger><SelectContent>{sites.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}</Button>
        </form>
        <div className="mt-4 text-center text-sm">Already have an account? <Link to="/" className="underline font-semibold text-primary">Sign In</Link></div>
      </CardContent>
    </Card>
  );
};

// --- MAIN WELCOME PAGE (THE FINAL FUSION DESIGN) ---
const WelcomePage = ({ showLogin }: { showLogin: boolean }) => {
    const backgroundImageUrl = "https://storage.googleapis.com/sample-bucket-for-nova/website-images/gcp_background.png";
    const novaLogoUrl = "https://storage.googleapis.com/sample-bucket-for-nova/website-images/nova.png";
    const cognizantLogoUrl = "https://storage.googleapis.com/sample-bucket-for-nova/website-images/cognizant.png";
    const videoUrl = "https://storage.googleapis.com/sample-bucket-for-nova/website-images/nova_intro.mp4";

    return (
        <main className="w-full min-h-screen relative bg-background text-foreground overflow-hidden">
            
            {/* Background Image & Vignette Layer */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transition-all duration-1000 ease-in-out"
                style={{
                    backgroundImage: `url(${backgroundImageUrl})`,
                    opacity: 0.15, // Visible but not overwhelming
                    transform: 'scale(1.1)', // Slightly zoomed in
                }}
            />
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-10" />

            {/* Content Layer */}
            <div className="w-full min-h-screen relative z-20 flex flex-col">

                {/* Top Header Row */}
                <header className="container mx-auto px-6 lg:px-8 py-8 flex justify-between items-center">
                    {/* Top-left Nova Header */}
                    <div className='flex items-center gap-5'>
                        <img src={novaLogoUrl} alt="Nova Logo" className="h-14 w-14"/>
                        <h1 className='text-3xl font-extrabold tracking-tight'>PROJECT NOVA</h1>
                    </div>
                    {/* Top-right Cognizant Logo - Large and Prominent */}
                    <div className="flex items-center gap-3">
                         <span className='font-semibold text-muted-foreground hidden md:inline'>In partnership with</span>
                         <img src={cognizantLogoUrl} alt="Cognizant Logo" className="h-20"/>
                    </div>
                </header>

                {/* Main Content Grid */}
                <div className="flex-grow grid grid-cols-1 lg:grid-cols-5 items-center container mx-auto px-6 lg:px-8">
                    
                    {/* Left Content Column (Takes 3/5 width on large screens) */}
                    <div className="lg:col-span-3 flex flex-col justify-center space-y-12 py-12 text-center lg:text-left">
                        <section id="tagline">
                            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-tight">
                                Igniting Transformation with <span className="text-primary">Google Cloud</span>
                            </h2>
                            <p className="mt-6 max-w-2xl text-lg text-muted-foreground mx-auto lg:mx-0">
                                An elite platform for innovators to showcase projects, share expertise, and drive the future of cloud technology forward.
                            </p>
                        </section>

                        <section id="video">
                            {/* Video Player */}
                            <div className="w-full max-w-2xl mx-auto lg:mx-0 rounded-lg overflow-hidden shadow-2xl border-2 border-border/30">
                                <video 
                                    className="w-full h-full"
                                    controls playsInline muted autoPlay loop src={videoUrl}
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </section>
                    </div>

                    {/* Right Content Column (Takes 2/5 width on large screens) */}
                    <div className="lg:col-span-2 flex items-center justify-center p-6">
                        {showLogin ? <LoginForm /> : <RegisterForm />}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default WelcomePage;
