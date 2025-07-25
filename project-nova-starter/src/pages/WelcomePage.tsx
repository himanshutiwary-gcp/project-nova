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

// --- MAIN WELCOME PAGE COMPONENT (ALL NEW CHANGES ARE HERE) ---
const WelcomePage = ({ showLogin }: { showLogin: boolean }) => {
    const backgroundImageUrl = "https://storage.googleapis.com/sample-bucket-for-nova/website-images/gcp_background.png";
    const novaLogoUrl = "https://storage.googleapis.com/sample-bucket-for-nova/website-images/nova.png";
    const cognizantLogoUrl = "https://storage.googleapis.com/sample-bucket-for-nova/website-images/cognizant.png";

    // --- THIS IS THE NEW PART ---
    // Point this to your actual video file in Cloud Storage
    const videoUrl = "https://storage.googleapis.com/sample-bucket-for-nova/website-images/nova_intro.mp4";

    return (
        <main className="w-full min-h-screen relative overflow-hidden bg-background">
            {/* Background Image Layer */}
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0" style={{ backgroundImage: `url(${backgroundImageUrl})`, opacity: 0.25 }} />

            {/* Gradient Overlay Layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-background/60 via-background/90 to-background z-10" />

            {/* Content Layer */}
            <div className="w-full min-h-screen relative z-20 grid grid-cols-1 lg:grid-cols-2">

                {/* Left Side: Landing Page Content */}
                <div className="flex flex-col h-full p-10 lg:p-16">
                    {/* Header: Positioned at the top */}
                    <header className='flex items-center gap-6'>
                      <img src={novaLogoUrl} alt="Nova Logo" className="h-16 w-16"/>
                      <div className='border-l-2 border-border pl-6'>
                        <h1 className='text-4xl font-extrabold tracking-tight'>PROJECT NOVA</h1>
                        <div className='flex items-center gap-2 mt-1'>
                           <p className='text-sm font-medium text-muted-foreground'>A Cognizant & Google Cloud Initiative</p>
                           <img src={cognizantLogoUrl} alt="Cognizant Logo" className="h-5"/>
                        </div>
                      </div>
                    </header>

                    {/* Main Content Sections: Flex-grow pushes footer down */}
                    <main className='flex-grow flex flex-col justify-center py-12'>
                        <section id="tagline" className='mb-12'>
                            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
                                Igniting Transformation through <span className="text-primary">Google Cloud.</span>
                            </h2>
                            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                                A collaborative platform to showcase projects, share technical expertise, and drive the future of cloud technology forward.
                            </p>
                        </section>

                        <section id="video">
                            <h3 className='text-2xl font-bold mb-4'>Why Nova?</h3>
                            {/* --- NEW CUSTOM VIDEO PLAYER --- */}
                            <div className="w-full max-w-2xl rounded-lg overflow-hidden shadow-2xl border bg-black">
                                <video 
                                    className="w-full h-full"
                                    controls  // Show play/pause, volume controls
                                    playsInline // Important for mobile browsers
                                    muted     // Often needed for autoplay to work
                                    autoPlay  // Optional: if you want it to play on load
                                    loop      // Optional: if you want it to loop
                                    src={videoUrl}
                                    // You can also add a poster image that shows before the video plays
                                    // poster="URL_TO_A_THUMBNAIL_IMAGE.jpg"
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                            {/* ----------------------------- */}
                        </section>
                    </main>

                    {/* Footer at the bottom */}
                    <footer className='text-xs text-muted-foreground'>
                       © 2025 Project Nova. All rights reserved.
                    </footer>
                </div>

                {/* Right Side: Login/Register Form */}
                 <div className="flex items-center justify-center p-6 bg-background/50 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none">
                    {showLogin ? <LoginForm /> : <RegisterForm />}
                </div>
            </div>
        </main>
    );
};

export default WelcomePage;
