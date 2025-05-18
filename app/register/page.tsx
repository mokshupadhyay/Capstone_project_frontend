'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
    const { user } = useAuth();
    const router = useRouter();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
                <p className="text-gray-600">
                    Join the capstone project portal to collaborate on projects
                </p>
            </div>

            <RegisterForm />
        </div>
    );
}