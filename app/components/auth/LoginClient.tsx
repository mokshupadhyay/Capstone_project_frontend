// app/components/auth/LoginClient.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginForm from './LoginForm';
import { useAuth } from '../../context/AuthContext';

const LoginClient = () => {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get('registered');

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);

    return (
        <div className="max-w-4xl mx-auto py-8">
            {registered && (
                <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    Registration successful! Please log in with your new account.
                </div>
            )}

            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                <p className="text-gray-600">
                    Login to access your capstone project portal
                </p>
            </div>

            <LoginForm />
        </div>
    );
};

export default LoginClient;