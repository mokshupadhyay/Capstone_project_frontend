// "use client";

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { projectsApi } from '@/app/api/api';
// import { useAuth } from '@/app/context/AuthContext';
// import FileUpload from '@/app/components/projects/FileUploadForm';

// export default function ProjectCreatePage() {
//     const { user } = useAuth();
//     const router = useRouter();
//     const [title, setTitle] = useState('');
//     const [description, setDescription] = useState('');
//     const [firstDeadline, setFirstDeadline] = useState('');
//     const [finalDeadline, setFinalDeadline] = useState('');
//     const [file, setFile] = useState(null);
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [success, setSuccess] = useState(false);

//     const handleFileSelect = (file) => {
//         setFile(file);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError(null);

//         if (!title.trim() || !description.trim()) {
//             setError('Title and description are required');
//             return;
//         }

//         if (!firstDeadline || !finalDeadline) {
//             setError('Both deadlines must be provided');
//             return;
//         }

//         // Validate that first deadline is before final deadline
//         const firstDate = new Date(firstDeadline);
//         const finalDate = new Date(finalDeadline);

//         if (firstDate >= finalDate) {
//             setError('First deadline must be before final deadline');
//             return;
//         }

//         try {
//             setLoading(true);

//             // Format dates in ISO format to ensure proper serialization
//             const projectData = {
//                 title,
//                 description,
//                 firstDeadline: firstDate.toISOString(),
//                 finalDeadline: finalDate.toISOString(),
//                 accessRoles: [
//                     { role: "student", canView: true, canEdit: false, canSubmit: true },
//                     { role: "teacher", canView: true, canEdit: true, canSubmit: false }
//                 ]
//             };

//             console.log('Submitting project data:', projectData);
//             const response = await projectsApi.createProject(projectData);
//             const projectId = response.project.id;

//             if (file) {
//                 const formData = new FormData();
//                 formData.append('file', file);
//                 formData.append('fileType', 'problem_statement');
//                 await projectsApi.uploadProjectFile(projectId, formData);
//             }

//             setSuccess(true);
//             setTimeout(() => {
//                 router.push(`/projects/${projectId}`);
//             }, 1500);

//         } catch (err) {
//             console.error('Error creating project:', err);
//             setError(err.message || 'Failed to create project');
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (user?.role === "student") {
//         return (
//             <div className="max-w-2xl mx-auto mt-10 p-6 bg-white border border-red-300 rounded-lg text-center">
//                 <div className="flex flex-col items-center">
//                     <svg className="w-10 h-10 text-red-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                     </svg>
//                     <h2 className="text-xl font-semibold text-black">Permission Denied</h2>
//                     <p className="mt-2 text-gray-600">You do not have permission to create a project. Please contact your teacher or administrator.</p>
//                 </div>
//             </div>
//         );
//     }

//     // Calculate minimum date values (today for first deadline)
//     const today = new Date().toISOString().split('T')[0];

//     return (
//         <div className="max-w-3xl mx-auto mt-10 mb-16">
//             <div className="bg-white shadow-md border border-gray-200 rounded-lg overflow-hidden">
//                 <div className="px-6 py-5 border-b border-gray-100">
//                     <h1 className="text-2xl font-bold text-black">Create New Project</h1>
//                 </div>

//                 <form onSubmit={handleSubmit} className="p-6 text-gray-800">
//                     {error && (
//                         <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md text-red-700">
//                             <div className="flex">
//                                 <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                                 </svg>
//                                 <span>{error}</span>
//                             </div>
//                         </div>
//                     )}

//                     {success && (
//                         <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md text-green-700">
//                             <div className="flex">
//                                 <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                                 </svg>
//                                 <span>Project created successfully! Redirecting...</span>
//                             </div>
//                         </div>
//                     )}

//                     <div className="grid grid-cols-1 gap-6">
//                         <div>
//                             <label className="block text-sm font-medium text-black mb-1">Project Title</label>
//                             <input
//                                 type="text"
//                                 className="w-full h-11 px-4 text-base rounded-md border border-gray-300 shadow-sm focus:border-black focus:ring-black"
//                                 value={title}
//                                 onChange={(e) => setTitle(e.target.value)}
//                                 placeholder="Enter project title"
//                                 required
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-black mb-1">Description</label>
//                             <textarea
//                                 className="w-full h-36 px-4 py-3 text-base rounded-md border border-gray-300 shadow-sm focus:border-black focus:ring-black"
//                                 value={description}
//                                 onChange={(e) => setDescription(e.target.value)}
//                                 rows={5}
//                                 placeholder="Enter project description"
//                                 required
//                             />
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-black mb-1">First Deadline</label>
//                                 <input
//                                     type="date"
//                                     className="w-full h-11 px-4 text-base rounded-md border border-gray-300 shadow-sm focus:border-black focus:ring-black"
//                                     value={firstDeadline}
//                                     onChange={(e) => setFirstDeadline(e.target.value)}
//                                     min={today}
//                                     required
//                                 />
//                                 <p className="text-xs text-gray-500 mt-1">Initial submission deadline</p>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-black mb-1">Final Deadline</label>
//                                 <input
//                                     type="date"
//                                     className="w-full h-11 px-4 text-base rounded-md border border-gray-300 shadow-sm focus:border-black focus:ring-black"
//                                     value={finalDeadline}
//                                     onChange={(e) => setFinalDeadline(e.target.value)}
//                                     min={firstDeadline || today}
//                                     required
//                                 />
//                                 <p className="text-xs text-gray-500 mt-1">Final submission deadline</p>
//                             </div>
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-black mb-1">Problem Statement (PDF)</label>
//                             <FileUpload onFileSelect={handleFileSelect} />
//                             <p className="text-xs text-gray-500 mt-1">Optional: You can upload files later</p>
//                         </div>
//                     </div>

//                     <div className="mt-8 flex justify-end">
//                         <button
//                             type="button"
//                             onClick={() => router.back()}
//                             className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400"
//                             disabled={loading || success}
//                         >
//                             {loading ? (
//                                 <span className="flex items-center">
//                                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                                     </svg>
//                                     Creating...
//                                 </span>
//                             ) : success ? 'Created!' : 'Create Project'}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { projectsApi } from '@/app/api/api';
import { useAuth } from '@/app/context/AuthContext';
import FileUpload from '@/app/components/projects/FileUploadForm';

export default function ProjectCreatePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [firstDeadline, setFirstDeadline] = useState('');
    const [finalDeadline, setFinalDeadline] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [debugInfo, setDebugInfo] = useState(null);

    const handleFileSelect = (file) => {
        setFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setDebugInfo(null);

        if (!title.trim() || !description.trim()) {
            setError('Title and description are required');
            return;
        }

        if (!firstDeadline || !finalDeadline) {
            setError('Both deadlines must be provided');
            return;
        }

        // Validate that first deadline is before final deadline
        const firstDate = new Date(firstDeadline);
        const finalDate = new Date(finalDeadline);

        if (firstDate >= finalDate) {
            setError('First deadline must be before final deadline');
            return;
        }

        try {
            setLoading(true);

            // Make sure both dates are valid before converting to ISO
            if (isNaN(firstDate.getTime()) || isNaN(finalDate.getTime())) {
                throw new Error('Invalid date format');
            }

            // Format dates in ISO format to ensure proper serialization
            const projectData = {
                title,
                description,
                firstDeadline: firstDate.toISOString(),
                finalDeadline: finalDate.toISOString(),
                accessRoles: [
                    { role: "student", canView: true, canEdit: false, canSubmit: true },
                    { role: "teacher", canView: true, canEdit: true, canSubmit: false }
                ]
            };

            // Add debug info to see what's being sent
            setDebugInfo({
                message: 'Submitting project data',
                data: projectData
            });

            console.log('Submitting project data:', projectData);
            const response = await projectsApi.createProject(projectData);

            if (!response || !response.project || !response.project.id) {
                throw new Error('Invalid server response: missing project ID');
            }

            const projectId = response.project.id;

            if (file) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('fileType', 'problem_statement');
                await projectsApi.uploadProjectFile(projectId, formData);
            }

            setSuccess(true);
            setTimeout(() => {
                router.push(`/projects/${projectId}`);
            }, 1500);

        } catch (err) {
            console.error('Error creating project:', err);
            // Enhanced error display
            setError(err.message || 'Failed to create project');
            setDebugInfo({
                message: 'Error creating project',
                error: err.toString(),
                stack: err.stack
            });
        } finally {
            setLoading(false);
        }
    };

    if (user?.role === "student") {
        return (
            <div className="max-w-2xl mx-auto mt-10 p-6 bg-white border border-red-300 rounded-lg text-center">
                <div className="flex flex-col items-center">
                    <svg className="w-10 h-10 text-red-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h2 className="text-xl font-semibold text-black">Permission Denied</h2>
                    <p className="mt-2 text-gray-600">You do not have permission to create a project. Please contact your teacher or administrator.</p>
                </div>
            </div>
        );
    }

    // Calculate minimum date values (today for first deadline)
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="max-w-3xl mx-auto mt-10 mb-16">
            <div className="bg-white shadow-md border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-black">Create New Project</h1>
                </div>

                <form onSubmit={handleSubmit} className="p-6 text-gray-800">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md text-red-700">
                            <div className="flex">
                                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md text-green-700">
                            <div className="flex">
                                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Project created successfully! Redirecting...</span>
                            </div>
                        </div>
                    )}

                    {debugInfo && (
                        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-md text-blue-700">
                            <div className="flex flex-col">
                                <h3 className="font-bold">Debug Information:</h3>
                                <pre className="mt-2 text-xs overflow-auto max-h-40">
                                    {JSON.stringify(debugInfo, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Project Title</label>
                            <input
                                type="text"
                                className="w-full h-11 px-4 text-base rounded-md border border-gray-300 shadow-sm focus:border-black focus:ring-black"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter project title"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Description</label>
                            <textarea
                                className="w-full h-36 px-4 py-3 text-base rounded-md border border-gray-300 shadow-sm focus:border-black focus:ring-black"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={5}
                                placeholder="Enter project description"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-black mb-1">First Deadline</label>
                                <input
                                    type="date"
                                    className="w-full h-11 px-4 text-base rounded-md border border-gray-300 shadow-sm focus:border-black focus:ring-black"
                                    value={firstDeadline}
                                    onChange={(e) => setFirstDeadline(e.target.value)}
                                    min={today}
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Initial submission deadline</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-black mb-1">Final Deadline</label>
                                <input
                                    type="date"
                                    className="w-full h-11 px-4 text-base rounded-md border border-gray-300 shadow-sm focus:border-black focus:ring-black"
                                    value={finalDeadline}
                                    onChange={(e) => setFinalDeadline(e.target.value)}
                                    min={firstDeadline || today}
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Final submission deadline</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Problem Statement (PDF)</label>
                            <FileUpload onFileSelect={handleFileSelect} />
                            <p className="text-xs text-gray-500 mt-1">Optional: You can upload files later</p>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400"
                            disabled={loading || success}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating...
                                </span>
                            ) : success ? 'Created!' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}