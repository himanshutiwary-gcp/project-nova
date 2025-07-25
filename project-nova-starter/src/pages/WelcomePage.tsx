import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// UI and Auth Imports
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuthStore } from '@/stores/auth.store';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';

// --- LOGIN COMPONENT (Internal to this file) ---
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
            navigate('/app'); // Navigate to the protected app space
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-sm border-0 shadow-none md:border md:shadow-lg">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">Sign In to Nova</CardTitle>
                <CardDescription>Use your registered Google account to access the platform.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className='flex justify-center'>
                     {isLoading ? (
                        <div className='flex justify-center items-center h-10'>
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <GoogleLogin onSuccess={handleLoginSuccess} onError={() => toast.error('Google sign-in failed.')} theme="filled_blue" shape='rectangular' width="320px"/>
                    )}
                </div>
                <div className="text-center text-sm">
                    Don't have an account?{" "}
                    <Link to="/register" className="underline font-semibold text-primary">Register Here</Link>
                </div>
            </CardContent>
        </Card>
    );
};

// --- REGISTER COMPONENT (Internal to this file) ---
const RegisterForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', specialization: '', role: '', site: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSelectChange = (name: string, value: string) => setFormData({ ...formData, [name]: value });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/auth/register', formData);
            toast.success('Registration successful! Please sign in.');
            navigate('/');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const specializations = ["Compute Engine", "DevOps", "GKE and Anthos", "Networking", "Security", "Database", "Storage", "Data Analytics", "AI/ML", "Apigee"];
    const roles = ["TSR/SME", "Lead", "QM", "OM", "EM", "QA"];
    const sites = ["CGN-HYD", "CGN-TelAviv", "CGN-BUH", "CGN-CBE"];

    return (
        <Card className="w-full max-w-sm border-0 shadow-none md:border md:shadow-lg">
            <CardHeader className='text-center'>
                <CardTitle className="text-2xl">Create an Account</CardTitle>
                <CardDescription>Join the Nova innovation platform.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2"><Label htmlFor="name">Full Name</Label><Input id="name" name="name" type="text" placeholder="Your full name" required onChange={handleInputChange} /></div>
                    <div className="grid gap-2"><Label htmlFor="email">Google Email</Label><Input id="email" name="email" type="email" placeholder="name@google.com" required onChange={handleInputChange} /></div>
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

// --- MAIN WELCOME PAGE COMPONENT ---
const WelcomePage = ({ showLogin }: { showLogin: boolean }) => {
    // A simple carousel state
    const [currentMember, setCurrentMember] = useState(0);
    const teamMembers = [
        { name: "Himanshu Tiwary", title: "SME-Networking", description: "Himanshu architects and manages the cloud storage infrastructure, ensuring data is securely stored, highly available, and cost-effectively managed. He implements data protection strategies, including backups and disaster recovery...", image: "https://storage.googleapis.com/sample-bucket-for-nova/profile-picture/himanshu.jpg" },
        { name: "Lavanya Lanka", title: "TSR-Infra", description: "Lavanya architects and manages the cloud storage infrastructure, ensuring data is securely stored, highly available, and cost-effectively managed. He implements data protection strategies, including backups and disaster recovery...", image: "https://storage.googleapis.com/sample-bucket-for-nova/profile-picture/lavanya.jpg" }
        { name: "Anurag Kumar", title: "TSR-Platform", description: "Anurag architects and manages the cloud storage infrastructure, ensuring data is securely stored, highly available, and cost-effectively managed. He implements data protection strategies, including backups and disaster recovery...", image: "https://storage.googleapis.com/sample-bucket-for-nova/profile-picture/anurag.jpg" }
        { name: "Dhiraj Kumar", title: "TSR-Platform", description: "Dhiraj specializes in Kubernetes and Anthos, helping teams orchestrate complex microservice architectures with ease and reliability.", image: "https://storage.googleapis.com/sample-bucket-for-nova/profile-picture/dhiraj.jpg" }
    ];

    const nextMember = () => setCurrentMember((prev) => (prev + 1) % teamMembers.length);
    const prevMember = () => setCurrentMember((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);

    return (
        <div className="w-full min-h-screen lg:grid lg:grid-cols-2 bg-white dark:bg-black">
            {/* Left Side: Landing Page Content */}
            <div className="hidden lg:flex flex-col bg-gray-100 dark:bg-gray-900/50 p-10 xl:p-16 overflow-y-auto">
                <header className="flex items-center gap-4">
                   <img src="https://storage.googleapis.com/sample-bucket-for-nova/website-images/nova.png" alt="Nova Logo" className="h-10 w-10"/>
                   <div>
                       <h1 className='text-2xl font-bold'>NOVA</h1>
                       <p className='text-sm text-muted-foreground'>Igniting Transformation through Google Cloud</p>
                   </div>
                </header>

                <main className='flex-grow flex flex-col justify-center text-center py-10'>
                    <section id="about" className='mb-16'>
                        <h2 className="text-3xl font-bold tracking-tight">About Project NOVA</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">Nova is an internal initiative to explore and master Google Cloud by building innovative applications. It's a platform for showcasing our skills, sharing knowledge, and fostering a culture of continuous learning and excellence.</p>
                        <img src="https://storage.googleapis.com/sample-bucket-for-nova/website-images/about_bg.jpg" alt="GCP Illustration" className="mt-6 mx-auto w-full max-w-lg"/>
                    </section>

                    <section id="team">
                        <h2 className="text-3xl font-bold tracking-tight">Meet Our Team</h2>
                        <div className='mt-8 relative'>
                            <div className='flex items-center justify-center gap-8'>
                                <Button onClick={prevMember} variant='outline' size='icon' className='rounded-full h-12 w-12 shrink-0'><ArrowLeft/></Button>
                                <div className='text-center w-full max-w-lg'>
                                    <img src={teamMembers[currentMember].image} alt={teamMembers[currentMember].name} className="w-40 h-40 rounded-full object-cover mx-auto border-4 border-primary shadow-lg mb-4"/>
                                    <h3 className="text-2xl font-semibold">{teamMembers[currentMember].name}</h3>
                                    <p className="text-md text-primary font-medium">{teamMembers[currentMember].title}</p>
                                    <p className="mt-3 text-sm text-muted-foreground h-24">{teamMembers[currentMember].description}</p>
                                </div>
                                <Button onClick={nextMember} variant='outline' size='icon' className='rounded-full h-12 w-12 shrink-0'><ArrowRight/></Button>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            {/* Right Side: Login/Register Form */}
             <div className="flex items-center justify-center p-6 bg-dots-pattern">
                {showLogin ? <LoginForm /> : <RegisterForm />}
            </div>
        </div>
    );
};

export default WelcomePage;
