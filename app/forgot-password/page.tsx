'use client'

import { Suspense } from 'react';
import { useState } from "react";
import { useRouter } from 'next/navigation';
import ForgotPasswordModal from "../components/auth/ForgotPasswordModal";
import Loader from '../components/ui/Loader';

export default function ForgotPasswordPage() {
    const [isOpen, setIsOpen] = useState(true);
    const router = useRouter();

    const handleClose = () => {
        setIsOpen(false);
        router.push('/login');
    };

    return (
        <Suspense fallback={<Loader variant="full-page" text="Loading password reset..." />}>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
                <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center p-4">
                    <ForgotPasswordModal isOpen={isOpen} onClose={handleClose} />
                </div>
            </div>
        </Suspense>
    );
}