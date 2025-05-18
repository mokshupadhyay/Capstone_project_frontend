'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
// import TeacherDashboard from './TeacherDashboard.tsx';
import StudentDashboard from './StudentDashboard';
import OtherRoleDashboard from './OtherRoleDashboard';
import TeacherDashboard from './TeacherDashboard';

export default function DashboardPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    // Handle client-side rendering
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isLoading && !user && isClient) {
            router.push('/login');
        }
    }, [user, isLoading, router, isClient]);

    if (!isClient || isLoading || !user) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-gray-600">
                    Welcome back, {user.username}! ({user.role})
                </p>
            </div>

            {user.role === 'teacher' && <TeacherDashboard />}
            {user.role === 'student' && <StudentDashboard />}

            {(
                user.role === 'academic_team' ||
                user.role === 'evaluator' ||
                user.role === 'manager' ||
                user.role === 'coordinator' ||
                user.role === 'admin') && <OtherRoleDashboard />}

            {/* {!['teacher', 'student'].includes(user.role) && <OtherRoleDashboard />} */}
        </div>
    );
}