'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { projectsApi } from '../../api/api';
import Link from 'next/link';

interface Project {
    id: string;
    title: string;
    description: string;
    finalDeadline: string;
    reviews?: Array<{
        rating: number;
        // ... other review properties
    }>;
    phase1Submission?: any;
    phase2Submission?: any;
}

const CertificateProjects = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        const fetchProjects = async () => {
            try {
                setLoading(true);
                setError(null);
                let projectsData: Project[] = [];

                if (user.role === 'student') {
                    const response = await projectsApi.getStudentProjects();
                    projectsData = response.projects?.filter(project =>
                        project.phase1Submission &&
                        project.phase2Submission &&
                        project.reviews?.some(review => review.rating > 7)
                    ) || [];
                } else {
                    // Handle other roles if needed
                    projectsData = [];
                }

                setProjects(projectsData);
            } catch (err) {
                console.error('Error fetching projects:', err);
                setError(err instanceof Error ? err.message : 'Failed to load projects');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{error}</p>
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">No Certificates Available</h2>
                <p className="text-gray-600">
                    {user?.role === 'student'
                        ? "You don't have any projects with ratings above 7. Projects need at least one review with a score greater than 7 to qualify for a certificate."
                        : "No certificate-eligible projects found"}
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">
                {user?.role === 'student' ? 'Your Certificate-Eligible Projects' : 'Certificate Management'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-4">
                            <h3 className="text-lg font-semibold mb-2 truncate">{project.title}</h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>

                            {user?.role === 'student' && (
                                <div className="text-sm text-gray-500 mb-3">
                                    <span>Highest Rating: {
                                        Math.max(...(project.reviews?.map(r => r.rating) || [0]))
                                    }/10</span>
                                </div>
                            )}

                            <div className="mt-4">
                                <Link
                                    href={`/certificate?projectId=${project.id}`}
                                    className="block w-full text-center py-2 px-4 rounded bg-green-500 hover:bg-green-600 text-white font-medium transition-colors"
                                >
                                    {user?.role === 'student' ? 'Generate Certificate' : 'View Certificates'}
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CertificateProjects;