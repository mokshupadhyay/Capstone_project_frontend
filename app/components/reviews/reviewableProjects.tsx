'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { projectsApi } from '../../api/api';
import Link from 'next/link';

interface Project {
    id: number;
    title: string;
    description: string;
    created_by: number;
    deadline: string;
    created_at: string;
    status: string;
    approved_by?: number;
    approved_at?: string;
    files: Array<{
        id: number;
        project_id: number;
        file_name: string;
        file_url: string;
        file_type: string;
        uploaded_by: number;
        uploaded_at: string;
    }>;
    // For non-student roles
    submissionCount?: number;
    reviewCount?: number;
    reviewable?: number;
    reviewed_count?: number;
    reviews?: any[];
    // For student role
    hasSubmitted?: boolean;
    submission?: any;
    // Computed fields
    submissionAvailable?: boolean;
}

export default function ReviewableProjects() {
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedProject, setExpandedProject] = useState<number | null>(null);

    useEffect(() => {
        if (!user) return;

        const fetchProjects = async () => {
            try {
                setLoading(true);
                setError(null);
                let projectsData: Project[] = [];

                if (user.role === 'student') {
                    const response = await projectsApi.getStudentProjects();
                    projectsData = response.projects || [];

                    // Filter only projects with submissions and enhance data
                    const enhancedProjects = projectsData
                        .filter(project => project.hasSubmitted)
                        .map(project => ({
                            ...project,
                            submissionAvailable: project.hasSubmitted || false,
                            reviewed_count: project.reviews?.length || 0,
                        }));
                    setProjects(enhancedProjects);
                } else if (['teacher', 'evaluator', 'admin', 'coordinator', 'manager', 'academic_team'].includes(user.role)) {
                    const response = user.role === 'teacher'
                        ? await projectsApi.getTeacherProjects()
                        : await projectsApi.getAllProjects();
                    projectsData = response.projects || [];

                    const enhancedProjects = projectsData.map(project => {
                        const reviewable = (project.submissionCount || 0) > (project.reviewCount || 0) ? 1 : 0;
                        return {
                            ...project,
                            reviewable: reviewable,
                            reviewed_count: project.reviewCount || 0,
                        };
                    });
                    setProjects(enhancedProjects);
                } else {
                    setError("Your role doesn't have access to reviews");
                }
            } catch (err) {
                console.error('Error fetching projects:', err);
                setError(err instanceof Error ? err.message : 'Failed to load projects');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [user]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getSubmissionReviews = (project: Project) => {
        if (!project.reviews) return [];
        const targetSubmissionId = project.submission?.id;
        return project.reviews.filter(review => review.submission_id === targetSubmissionId);
    };

    const renderStudentProjectCard = (project: Project) => (
        <div key={project.id} className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="p-6">
                {/* Project Header */}
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2 pr-2 leading-tight">
                        {project.title || 'Untitled Project'}
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${project.status === 'approved'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-gray-100 text-gray-600'
                        }`}>
                        {project.status}
                    </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {project.description || 'No description provided'}
                </p>

                {/* Deadline */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="text-sm">
                        <span className="text-gray-500 block font-medium">Deadline:</span>
                        <span className="font-semibold text-gray-800">{formatDate(project.deadline)}</span>
                    </div>
                </div>

                {/* Submission Section */}
                {project.submissionAvailable && (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div
                            className="bg-gray-50 p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                                        <span className="text-violet-600 font-bold text-sm">✓</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Your Submission</h4>
                                        <p className="text-xs text-gray-500">
                                            Submitted: {project.submission?.submitted_at ? formatDate(project.submission.submitted_at) : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    {getSubmissionReviews(project).length > 0 && (
                                        <span className="bg-violet-100 text-violet-700 px-2 py-1 rounded-full text-xs font-medium">
                                            {getSubmissionReviews(project).length} Review{getSubmissionReviews(project).length > 1 ? 's' : ''}
                                        </span>
                                    )}
                                    <svg
                                        className={`w-5 h-5 text-gray-400 transition-transform ${expandedProject === project.id ? 'rotate-180' : ''
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {expandedProject === project.id && (
                            <div className="p-4 bg-white border-t border-gray-200">
                                {/* File Info */}
                                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Submitted File:</p>
                                    <p className="text-sm text-gray-600">{project.submission?.file_name || 'No file'}</p>
                                </div>

                                {/* Reviews */}
                                {getSubmissionReviews(project).length > 0 ? (
                                    <div className="space-y-3">
                                        <h5 className="font-medium text-gray-900">Reviews & Feedback</h5>
                                        {getSubmissionReviews(project).map((review, idx) => (
                                            <Link
                                                href={`/review?projectId=${project.id}`}
                                                key={idx}
                                                className="block no-underline"
                                            >
                                                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-medium text-gray-900">{review.reviewer_name}</span>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-xs text-gray-500">{review.reviewer_role}</span>
                                                            <div className="flex items-center space-x-1">
                                                                <svg className="w-4 h-4 text-violet-500" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                </svg>
                                                                <span className="font-semibold text-gray-900">{review.rating}/10</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 text-sm leading-relaxed">{review.comments}</p>
                                                    <p className="text-xs text-gray-400 mt-2">{formatDate(review.created_at)}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm text-gray-500">Awaiting review feedback</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );

    const renderNonStudentProjectCard = (project: Project) => (
        <div key={project.id} className="group bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/60 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-800 line-clamp-2 pr-2 leading-tight">
                        {project.title || 'Untitled Project'}
                    </h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${project.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {project.status}
                    </div>
                </div>

                <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {project.description || 'No description provided'}
                </p>

                {/* Deadline */}
                <div className="mb-4 p-3 bg-slate-50/80 rounded-lg">
                    <div className="text-xs">
                        <span className="text-slate-500 block">Deadline:</span>
                        <span className="font-medium text-slate-700">{formatDate(project.deadline)}</span>
                    </div>
                </div>

                {/* Status Information */}
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600">Submissions:</span>
                        <span className="font-semibold px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                            {project.submissionCount || 0}
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600">Pending Review:</span>
                        <span className={`font-semibold px-2 py-1 rounded-full text-xs ${project.reviewable ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                            {project.reviewable || 0}
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600">Reviews Completed:</span>
                        <span className="font-semibold text-green-600 px-2 py-1 rounded-full text-xs bg-green-100">
                            {project.reviewed_count || 0}
                        </span>
                    </div>
                </div>

                {/* Action Button */}
                <Link
                    href={`/review?projectId=${project.id}`}
                    className={`block w-full text-center py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${project.reviewable
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                        }`}
                >
                    {project.reviewable
                        ? 'Review Submissions'
                        : 'View Completed Reviews'}
                </Link>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-[400px] flex justify-center items-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-20 animate-pulse"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg max-w-lg">
                    <div className="flex items-center space-x-3">
                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-red-800">Error Loading Projects</h3>
                    </div>
                    <p className="mt-2 text-red-700">{error}</p>
                </div>
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 shadow-xl text-center max-w-lg">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 7v6l3 3" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {user?.role === 'student'
                            ? "No Submissions Available"
                            : "No Projects to Review"}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {user?.role === 'student'
                            ? "You don't have any submissions ready for review at this time."
                            : "There are currently no projects that require your review."}
                    </p>
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-left">
                        <h3 className="font-medium text-indigo-900 mb-2">What to do next?</h3>
                        <ul className="space-y-2 text-sm text-indigo-800">
                            {user?.role === 'student' ? (
                                <>
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                        Submit your work for review
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                        Check back after submission
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                        Check back later for new submissions
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                        Review project guidelines
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project.id}>
                        {user?.role === 'student'
                            ? renderStudentProjectCard(project)
                            : renderNonStudentProjectCard(project)}
                    </div>
                ))}
            </div>
        </div>
    );
}