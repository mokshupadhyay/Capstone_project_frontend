"use client";

import React, { useEffect, useState } from 'react';

const AllSubmissionsList = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (userStr) {
            const parsedUser = JSON.parse(userStr);
            setUser(parsedUser);

            const fetchAllSubmissions = async () => {
                try {
                    const projectsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teacher/projects`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    const projectsData = await projectsResponse.json();

                    if (!projectsResponse.ok) {
                        throw new Error(projectsData.message || 'Failed to load projects');
                    }

                    const allSubmissions = [];

                    for (const project of projectsData.projects) {
                        const submissionsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${project.id}/submissions`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });

                        const submissionsData = await submissionsRes.json();

                        if (submissionsRes.ok) {
                            const projectSubmissions = submissionsData.submissions.map((s) => ({
                                ...s,
                                projectTitle: project.title,
                                projectId: project.id,
                            }));
                            allSubmissions.push(...projectSubmissions);
                        }
                    }

                    setSubmissions(allSubmissions);
                } catch (err) {
                    console.error(err);
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            if (['teacher', 'academic_team', 'evaluator', 'manager', 'coordinator'].includes(parsedUser.role)) {
                fetchAllSubmissions();
            } else {
                setError("You don't have permission to view all submissions.");
                setLoading(false);
            }
        }
    }, []);

    if (loading) return <div className="text-center py-12">Loading submissions...</div>;
    if (error) return <div className="text-red-500 p-4">{error}</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">All Submissions</h2>
            {submissions.length === 0 ? (
                <p>No submissions found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="bg-gray-100 text-left text-gray-600 text-sm">
                                <th className="py-3 px-4 font-medium">Student</th>
                                <th className="py-3 px-4 font-medium">Email</th>
                                <th className="py-3 px-4 font-medium">Project</th>
                                <th className="py-3 px-4 font-medium">Submitted On</th>
                                <th className="py-3 px-4 font-medium">File</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {submissions.map((s) => (
                                <tr key={s.id}>
                                    <td className="py-2 px-4">{s.username}</td>
                                    <td className="py-2 px-4">{s.email}</td>
                                    <td className="py-2 px-4">{s.projectTitle}</td>
                                    <td className="py-2 px-4">{new Date(s.submitted_at).toLocaleString()}</td>
                                    <td className="py-2 px-4">
                                        <a href={s.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                            {s.file_name}
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AllSubmissionsList;
