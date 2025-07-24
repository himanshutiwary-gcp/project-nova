import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuthStore } from '@/stores/auth.store'; // Correct: Imports from our Zustand store
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Zap, BrainCircuit, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
    // Correct: Uses the hook from our Zustand store, NOT useAuth()
    const { user, setUser } = useAuthStore(); 
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        setIsLoading(true);
        try {
            const { data } = await api.post('/auth/google', {
                token: credentialResponse.credential,
            });
            setUser(data, data.token);
            toast.success(`Welcome back, ${data.name.split(' ')[0]}!`);
            navigate('/');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginError = () => {
        toast.error('Google login failed. Please try again.');
    };

    return (
         <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 m-4 space-y-8 bg-white rounded-2xl shadow-2xl dark:bg-gray-800">
                <div className="text-center">
                    <div className="flex justify-center items-center mb-4">
                        <Zap className="w-12 h-12 text-primary" />
                        <h1 className="ml-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Nova</h1>
                    </div>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">The Professional Innovation Showcase</p>
                </div>
                <div className="flex flex-col items-center space-y-6">
                    <p className="text-center text-gray-700 dark:text-gray-300 flex items-center">
                        <BrainCircuit className="inline-block w-5 h-5 mr-2 text-accent" />
                        Built for Innovators at Google & Cognizant
                    </p>
                    {isLoading ? (
                        <div className='flex flex-col items-center justify-center h-10'>
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <p className='mt-2 text-sm text-muted-foreground'>Verifying with Nova systems...</p>
                        </div>
                    ) : (
                        <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} useOneTap theme="filled_blue" shape="pill" />
                    )}
                </div>
                <p className="px-8 text-xs text-center text-gray-500 dark:text-gray-400">By signing in, you agree to our internal terms of service.</p>
            </div>
        </div>
    );
};

export default LoginPage;