'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { projectsApi } from '@/app/api/api';
import { useAuth } from '@/app/context/AuthContext';

interface File {
    id: number;
    file_name: string;
    file_url: string;
    file_type: string;
}

const ProjectDetailPage = () => {
    const { projectId } = useParams();
    const { user } = useAuth();
    const [project, setProject] = useState<any>(null);
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState('');

    useEffect(() => {
        if (typeof projectId === 'string') {
            projectsApi.getProject(projectId).then(setProject).catch(console.error);
        }
    }, [projectId]);

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUploadError('');
        setUploadSuccess('');

        const fileInput = (e.target as HTMLFormElement).file as HTMLInputElement;
        const file = fileInput.files?.[0];

        if (!file || file.type !== 'application/pdf') {
            setUploadError('Only PDF files are allowed.');
            return;
        }

        // Compress if >100kb
        if (file.size > 200 * 1024) {
            setUploadError('File too large to upload. Must be under 200KB.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            await projectsApi.submitSolution(projectId as string, formData);
            setUploadSuccess('Submission uploaded successfully!');
        } catch (err: any) {
            console.error(err);
            setUploadError(err.message || 'Upload failed');
        }
    };

    if (!project) return <div>Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
            <p className="text-gray-700 mb-4">{project.description}</p>

            <h3 className="text-lg font-semibold mb-2">Files</h3>
            {project.files.map((file: File) => (
                <div key={file.id}>
                    <a
                        href={file.file_url}
                        target="_blank"
                        className="text-indigo-600 underline"
                    >
                        {file.file_name}
                    </a>
                </div>
            ))}

            {user?.role === 'student' && (
                <form onSubmit={handleUpload} className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold">Submit your response</h3>
                    <input type="file" name="file" accept="application/pdf" required />
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white py-2 px-4 rounded"
                    >
                        Upload PDF
                    </button>
                    {uploadError && <p className="text-red-600">{uploadError}</p>}
                    {uploadSuccess && <p className="text-green-600">{uploadSuccess}</p>}
                </form>
            )}
        </div>
    );
};

export default ProjectDetailPage;
