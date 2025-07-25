import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// UI and Auth Imports
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from './components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuthStore } from '@/stores/auth.store';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

// --- LOGIN COMPONENT ---
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
            navigate('/app'); // Navigate to the main app feed
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-2xl">Sign In</CardTitle>
                <CardDescription>Use your registered Google account to access Nova.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                 {isLoading ? (
                    <div className='flex justify-center items-center h-10'>
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <GoogleLogin onSuccess={handleLoginSuccess} onError={() => toast.error('Google sign-in failed.')} theme="filled_blue" shape='rectangular' width="320px"/>
                )}
                <div className="text-center text-sm">
                    Don't have an account?{" "}
                    <Link to="/register" className="underline">Register here</Link>
                </div>
            </CardContent>
        </Card>
    );
};

// --- REGISTER COMPONENT ---
const RegisterForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', specialization: '', role: '', site: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/auth/register', formData);
            toast.success('Registration successful! Please sign in.');
            navigate('/'); // Redirect to the login page
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
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-2xl">Create an Account</CardTitle>
                <CardDescription>Register to join the Nova innovation platform.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" type="text" placeholder="Dhiraj Kumar Prince" required onChange={handleInputChange} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Cognizant/Google Email</Label>
                        <Input id="email" name="email" type="email" placeholder="name@cognizant.com" required onChange={handleInputChange} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Specialization</Label>
                         <Select name="specialization" required onValueChange={(value) => handleSelectChange('specialization', value)}>
                            <SelectTrigger><SelectValue placeholder="Select your specialization" /></SelectTrigger>
                            <SelectContent>{specializations.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                           <Label>Role</Label>
                           <Select name="role" required onValueChange={(value) => handleSelectChange('role', value)}><SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger><SelectContent>{roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select>
                        </div>
                        <div className="grid gap-2">
                           <Label>Site</Label>
                           <Select name="site" required onValueChange={(value) => handleSelectChange('site', value)}><SelectTrigger><SelectValue placeholder="Site" /></SelectTrigger><SelectContent>{sites.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
                        </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
                    </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/" className="underline">Sign in instead</Link>
                </div>
            </CardContent>
        </Card>
    );
};

// --- MAIN WELCOME PAGE ---
const WelcomePage = ({ showLogin }: { showLogin: boolean }) => {
    const teamMembers = [
        {
            name: "Himanshu Tiwary",
            title: "SME-Networking",
            description: "Dhiraj architects and manages the cloud storage infrastructure, ensuring data is securely stored, highly available, and cost-effectively managed. He implements data protection strategies, including backups and disaster recovery. His expertise in selecting and configuring storage services optimizes performance and scalability for various data needs. By managing data lifecycles and implementing automation, he contributes to efficient and reliable data storage solutions in the cloud.",
            image: "https://i.ibb.co/3s68J1n/dhiraj.png" 
        },
       {
            name: "Lavanya Lanka",
            title: "TSR-Compute",
            description: "Dhiraj architects and manages the cloud storage infrastructure, ensuring data is securely stored, highly available, and cost-effectively managed. He implements data protection strategies, including backups and disaster recovery. His expertise in selecting and configuring storage services optimizes performance and scalability for various data needs. By managing data lifecycles and implementing automation, he contributes to efficient and reliable data storage solutions in the cloud.",
            image: "https://i.ibb.co/3s68J1n/dhiraj.png" 
        },
      {
            name: "Dhiraj Kumar Prince",
            title: "Cloud Storage Engineer",
            description: "Dhiraj architects and manages the cloud storage infrastructure, ensuring data is securely stored, highly available, and cost-effectively managed. He implements data protection strategies, including backups and disaster recovery. His expertise in selecting and configuring storage services optimizes performance and scalability for various data needs. By managing data lifecycles and implementing automation, he contributes to efficient and reliable data storage solutions in the cloud.",
            image: "https://i.ibb.co/3s68J1n/dhiraj.png" 
        },
      {
            name: "Anurag Kumar",
            title: "Cloud Storage Engineer",
            description: "Dhiraj architects and manages the cloud storage infrastructure, ensuring data is securely stored, highly available, and cost-effectively managed. He implements data protection strategies, including backups and disaster recovery. His expertise in selecting and configuring storage services optimizes performance and scalability for various data needs. By managing data lifecycles and implementing automation, he contributes to efficient and reliable data storage solutions in the cloud.",
            image: "https://i.ibb.co/3s68J1n/dhiraj.png" 
        },
        // Add other team members here
    ];

    return (
        <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
            {/* Left Side: Landing Page Content */}
            <div className="hidden lg:block bg-gray-100 dark:bg-gray-800 p-12 overflow-y-auto">
                <div className="flex items-center gap-4">
                   <img src="https://i.ibb.co/1KkZ35n/logo.png" alt="Nova Logo" className="h-12"/>
                   <div>
                       <h1 className='text-3xl font-bold'>NOVA</h1>
                       <p className='text-muted-foreground'>Igniting Transformation through Google Cloud</p>
                   </div>
                </div>

                 <div className="mt-16 text-center">
                    <h2 className="text-4xl font-bold tracking-tight">About Project NOVA</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                        Project Nova: Igniting Transformation through Google Cloud is an initiative to explore and implement Google Cloud Platform (GCP) services. We aim to build innovative applications based on various architectures and models while learning and mastering GCP tools.
                    </p>
                    <img src="https://i.ibb.co/L5hKzHz/illustration.png" alt="GCP Illustration" className="mt-8 mx-auto"/>
                </div>

                 <div className="mt-16 text-center">
                    <h2 className="text-4xl font-bold tracking-tight">Meet Our Team</h2>
                    {/* A simple map for now, can be replaced with a carousel */}
                    {teamMembers.map(member => (
                        <div key={member.name} className='mt-12 flex flex-col items-center gap-8'>
                           <img src={member.image} alt={member.name} className="w-48 h-48 rounded-full object-cover border-4 border-primary"/>
                           <div>
                               <h3 className="text-2xl font-semibold">{member.name}</h3>
                               <p className="text-lg text-primary">{member.title}</p>
                               <p className="mt-4 max-w-xl mx-auto text-muted-foreground">{member.description}</p>
                           </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Side: Login/Register Form */}
             <div className="flex items-center justify-center p-6">
                {showLogin ? <LoginForm /> : <RegisterForm />}
            </div>
        </div>
    );
};

export default WelcomePage;
