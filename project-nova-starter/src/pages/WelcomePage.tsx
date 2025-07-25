import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion"; // Import for animations

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

// --- MAIN WELCOME PAGE ---
const WelcomePage = ({ showLogin }: { showLogin: boolean }) => {
    const novaLogoUrl = "https://storage.googleapis.com/sample-bucket-for-nova/website-images/nova.png";
    const videoUrl = "https://storage.googleapis.com/sample-bucket-for-nova/website-images/nova_intro.mp4";

    // Animation Variants for the headline
    const sentence = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                delay: 0.5,
                staggerChildren: 0.08,
            },
        },
    };
    const letter = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
        },
    };

    const headlineText = "Igniting Transformation with Google Cloud";

    return (
        <main className="w-full min-h-screen relative bg-background text-foreground overflow-hidden">
            
            {/* The new animated background layer */}
            <div className="absolute inset-0 z-0 aurora-glow" />

            {/* Content Layer */}
            <div className="w-full min-h-screen relative z-10 flex items-center justify-center p-4">
                <div className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    
                    {/* Left Side: The new integrated branding and content */}
                    <div className="flex flex-col gap-8 text-center lg:text-left">
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className='flex items-center gap-6 justify-center lg:justify-start'
                        >
                          <img src={novaLogoUrl} alt="Nova Logo" className="h-24 w-24"/>
                          <h1 className='text-8xl font-extrabold tracking-tighter bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent'>
                            NOVA
                          </h1>
                        </motion.div>

                        <motion.h2 
                            className="text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
                            variants={sentence}
                            initial="hidden"
                            animate="visible"
                        >
                            {headlineText.split(" ").map((word, index) => (
                                <motion.span key={word + "-" + index} variants={letter} className="inline-block">
                                    {word}&nbsp; {/* Add space between words */}
                                </motion.span>
                            ))}
                        </motion.h2>

                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.5, ease: "easeOut" }}
                            className="max-w-xl text-lg text-muted-foreground mx-auto lg:mx-0"
                        >
                            An elite platform for innovators to showcase implementation and architectures, share expertise, and drive the future of cloud technology forward using Google Cloud Platform.
                        </motion.p>
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.8, ease: "easeOut" }}
                            className="w-full max-w-xl mx-auto lg:mx-0 rounded-lg overflow-hidden shadow-2xl border-2 border-border/30"
                        >
                            <video className="w-full h-full" controls playsInline muted autoPlay loop src={videoUrl}>
                                Your browser does not support the video tag.
                            </video>
                        </motion.div>
                    </div>

                    {/* Right Side: The Login/Register Form with animation */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 2.1, ease: "easeOut" }}
                        className="flex items-center justify-center p-6"
                    >
                        {showLogin ? <LoginForm /> : <RegisterForm />}
                    </motion.div>

                </div>
            </div>
        </main>
    );
};

export default WelcomePage;
