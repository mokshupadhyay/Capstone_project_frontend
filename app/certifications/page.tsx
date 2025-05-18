'use client';

import React from 'react';
import { useAuth } from '@/app/context/AuthContext';
import CertificateProjects from '@/app/components/certificates/certificateProjects';
import Link from 'next/link';

const CertificatePage = () => {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Please log in</h1>
                    <Link href="/login" className="text-blue-500 hover:text-blue-700">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Project Certificates</h1>
                <p className="text-gray-600">
                    {user.role === 'student'
                        ? 'Generate certificates for your high-scoring projects'
                        : 'View and manage student certificates'}
                </p>
            </div>

            <CertificateProjects />
        </div>
    );
};

export default CertificatePage;