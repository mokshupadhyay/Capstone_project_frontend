'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';

const LoginForm = () => {
    const { login, isLoading, error } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        if (!username || !password) {
            setFormError('All fields are required');
            return;
        }

        try {
            await login(username, password);
        } catch (err) {
            setFormError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg overflow-hidden mt-12">
            <div className="bg-black text-white py-5 px-8">
                <h2 className="text-2xl font-semibold">Login to Your Account</h2>
                <p className="text-sm text-gray-300 mt-1">Access your capstone dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-10">
                {(error || formError) && (
                    <div className="mb-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                        {error || formError}
                    </div>
                )}

                <div className="mb-5">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-md transition duration-300"
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-black font-medium hover:underline">
                        Register here
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default LoginForm;
