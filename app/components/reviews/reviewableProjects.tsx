'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { projectsApi } from '../../api/api';
import Link from 'next/link';

interface Project {
    id: string;
    title: string;
    description: string;
    firstDeadline: string;
    finalDeadline: string;
    created_at: string;
    submission_count?: number;
    complete_submission_count?: number;
    reviewable_count?: number;
    reviewed_count?: number;
    status?: string;
    reviews?: any[];
}

const ReviewableProjects = () => {
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

                let projectsData;

                // Students can only see projects they've submitted to
                if (user.role === 'student') {
                    const response = await projectsApi.getStudentProjects();
                    projectsData = response.projects || [];

                    // Filter projects where the student has submitted both phases
                    projectsData = projectsData.filter((project: any) => {
                        return project.phase1Submission && project.phase2Submission;
                    });
                }
                // Teachers/evaluators/etc get projects they can review
                else if (['teacher', 'evaluator', 'admin', 'coordinator', 'manager', 'academic_team'].includes(user.role)) {
                    // For teachers, we'll get projects they created
                    if (user.role === 'teacher') {
                        const response = await projectsApi.getTeacherProjects();
                        projectsData = response.projects || [];
                    }
                    // For other roles like evaluators, admins, etc. - get all reviewable projects
                    else {
                        // This endpoint might need to be implemented on your backend
                        // For now, we'll use a generic endpoint
                        const response = await projectsApi.getTeacherProjects(); // Could be replaced with getReviewableProjects
                        projectsData = response.projects || [];
                    }
                } else {
                    // Unrecognized role
                    setProjects([]);
                    setError("Your role doesn't have access to reviews");
                    setLoading(false);
                    return;
                }

                // For each project, get complete submissions info
                const projectsWithSubmissionCounts = await Promise.all(
                    projectsData.map(async (project: Project) => {
                        // For students, use existing data from the API response
                        if (user?.role === 'student') {
                            return {
                                ...project,
                                // Use reviews array from the project data
                                complete_submission_count: project.reviews?.length || 0,
                                reviewable_count: 0 // Students don't need this field
                            };
                        }

                        // For other roles, keep the existing logic
                        try {
                            const completeSubmissionsResponse = await projectsApi.getCompleteSubmissions(project.id);
                            const completeSubmissions = completeSubmissionsResponse.completeSubmissions || [];
                            const needReviewCount = completeSubmissions.filter((sub: any) => !sub.has_reviews).length;
                            const reviewedCount = completeSubmissions.filter((sub: any) => sub.has_reviews).length;

                            return {
                                ...project,
                                complete_submission_count: completeSubmissions.length,
                                reviewable_count: needReviewCount,
                                reviewed_count: reviewedCount
                            };
                        } catch (err) {
                            console.error(`Error getting submission data for project ${project.id}:`, err);
                            return {
                                ...project,
                                complete_submission_count: 0,
                                reviewable_count: 0,
                                reviewed_count: 0
                            };
                        }
                    })
                );

                setProjects(projectsWithSubmissionCounts);
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

    // For students, we show projects that have reviews they can see
    const projectsToDisplay = user?.role === 'student'
        ? projects.filter(project => project.reviews && project.reviews.length > 0)
        : projects.filter(project => project.complete_submission_count > 0); // Show all projects with submissions for teachers

    if (projectsToDisplay.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">No Projects Available</h2>
                <p className="text-gray-600">
                    {user?.role === 'student'
                        ? "You don't have any completed submissions with reviews yet."
                        : "There are no projects with submissions yet."}
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">
                {user?.role === 'student' ? 'My Project Reviews' : 'Project Submissions'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projectsToDisplay.map((project) => (
                    <div key={project.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-4">
                            <h3 className="text-lg font-semibold mb-2 truncate">{project.title}</h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>

                            {user?.role !== 'student' && (
                                <div className="flex flex-col gap-1 text-sm text-gray-500 mb-3">
                                    <span>Complete submissions: {project.complete_submission_count}</span>
                                    <span className={`${project.reviewable_count > 0 ? 'text-orange-500 font-medium' : ''}`}>
                                        Needs review: {project.reviewable_count}
                                    </span>
                                    <span className="text-green-600">
                                        Reviewed: {project.reviewed_count}
                                    </span>
                                </div>
                            )}

                            {user?.role === 'student' && (
                                <div className="text-sm text-gray-500 mb-3">
                                    <span>Final Deadline: {new Date(project.final_deadline).toLocaleDateString()}</span>
                                </div>
                            )}

                            <div className="mt-4">
                                <Link
                                    href={`/review?projectId=${project.id}`}
                                    className={`block w-full text-center py-2 px-4 rounded ${user?.role !== 'student' && project.reviewable_count > 0
                                        ? 'bg-blue-500 hover:bg-black text-white'
                                        : 'bg-gray-800 hover:bg-black text-white'
                                        }`}
                                >
                                    {user?.role === 'student'
                                        ? 'View Reviews'
                                        : project.reviewable_count > 0
                                            ? 'Review Now'
                                            : 'View Submissions'}
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewableProjects;