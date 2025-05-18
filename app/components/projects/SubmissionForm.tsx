// "use client";

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';

// const SubmissionForm = ({ projectId, projectTitle }: { projectId: string, projectTitle: string }) => {
//     const router = useRouter();
//     const [file, setFile] = useState(null);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(null);
//     const [fileError, setFileError] = useState(null);

//     const handleFileChange = (e) => {
//         const selectedFile = e.target.files?.[0];
//         setFileError(null);

//         if (!selectedFile) {
//             return;
//         }

//         // Validate file type (PDF only)
//         if (selectedFile.type !== 'application/pdf') {
//             setFileError('Only PDF files are allowed');
//             return;
//         }

//         // Check file size (max 10MB as per backend)
//         if (selectedFile.size > 10 * 1024 * 1024) {
//             setFileError('File size must be less than 10MB');
//             return;
//         }

//         setFile(selectedFile);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!file) {
//             setFileError('Please select a file to submit');
//             return;
//         }

//         setIsSubmitting(true);
//         setError(null);
//         setSuccess(null);

//         try {
//             const formData = new FormData();
//             formData.append('file', file);

//             // Get token from localStorage
//             const token = localStorage.getItem('token');

//             const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/submissions`, {
//                 method: 'POST',
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//                 body: formData,
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || 'Submission failed');
//             }

//             setSuccess('Your solution has been submitted successfully');
//             setTimeout(() => {
//                 router.refresh();
//             }, 2000);

//         } catch (err) {
//             if (err.message.includes('too large') || err.message.includes('200KB')) {
//                 setError('Your file is too large even after compression. Please reduce the file size and try again.');
//             } else {
//                 setError(err.message);
//             }
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <div className="bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-xl font-bold mb-4">Submit Solution</h2>
//             <p className="text-gray-600 mb-6">Upload your solution for project: {projectTitle}</p>

//             {error && (
//                 <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
//                     <p className="font-bold">Error</p>
//                     <p>{error}</p>
//                 </div>
//             )}

//             {success && (
//                 <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md mb-6">
//                     <p className="font-bold">Success</p>
//                     <p>{success}</p>
//                 </div>
//             )}

//             <form onSubmit={handleSubmit}>
//                 <div className="mb-6">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Upload PDF Solution
//                     </label>
//                     <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
//                         <input
//                             id="solution-file"
//                             type="file"
//                             accept="application/pdf"
//                             onChange={handleFileChange}
//                             className="hidden"
//                         />
//                         <div className="flex flex-col items-center">
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
//                             </svg>
//                             <label
//                                 htmlFor="solution-file"
//                                 className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
//                             >
//                                 {file ? 'Change file' : 'Select file'}
//                             </label>
//                             <p className="text-xs text-gray-500 mt-2">
//                                 Only PDF files are supported.
//                             </p>
//                             {file && (
//                                 <p className="text-sm text-gray-700 mt-2">
//                                     Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
//                                 </p>
//                             )}
//                             {fileError && (
//                                 <p className="text-sm text-red-500 mt-1">{fileError}</p>
//                             )}
//                         </div>
//                     </div>
//                     <p className="text-xs text-gray-500 italic mt-1">
//                         Note: Files will be compressed to under 100KB if possible. Files that cannot be compressed below 200KB will be rejected.
//                     </p>
//                 </div>

//                 <button
//                     type="submit"
//                     className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors disabled:bg-blue-300"
//                     disabled={isSubmitting || !file}
//                 >
//                     {isSubmitting ? 'Submitting...' : 'Submit Solution'}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default SubmissionForm;

// "use client";

// import { useState } from 'react';
// import { projectsApi } from '@/app/api/api';

// interface SubmissionFormProps {
//     projectId: string;
//     projectTitle: string;
// }

// export default function SubmissionForm({ projectId, projectTitle }: SubmissionFormProps) {
//     const [file, setFile] = useState<File | null>(null);
//     const [uploading, setUploading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [success, setSuccess] = useState(false);

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const selectedFile = e.target.files?.[0] || null;

//         // Validate file
//         if (selectedFile && selectedFile.type !== 'application/pdf') {
//             setError('Only PDF files are allowed');
//             setFile(null);
//             return;
//         }

//         setFile(selectedFile);
//         setError(null);
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!file) {
//             setError('Please select a file to submit');
//             return;
//         }

//         setUploading(true);
//         setError(null);

//         try {
//             const formData = new FormData();
//             formData.append('file', file);

//             console.log('Submitting solution for project:', projectId);
//             const result = await projectsApi.submitSolution(projectId, formData);
//             console.log('Submission result:', result);

//             setSuccess(true);
//             setFile(null);

//             // Reset form after success
//             const fileInput = document.getElementById('submission-file') as HTMLInputElement;
//             if (fileInput) {
//                 fileInput.value = '';
//             }
//         } catch (err: any) {
//             console.error('Error submitting solution:', err);
//             setError(err.message || 'Failed to submit solution');
//         } finally {
//             setUploading(false);
//         }
//     };

//     return (
//         <div className="bg-white shadow p-6 rounded-md">
//             <h2 className="text-xl font-semibold mb-4">Submit Your Solution</h2>
//             <p className="text-gray-600 mb-4">Upload your solution for {projectTitle}</p>

//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                     <label htmlFor="submission-file" className="block text-sm font-medium text-gray-700 mb-1">
//                         Solution File (PDF only)
//                     </label>

//                     <input
//                         id="submission-file"
//                         type="file"
//                         onChange={handleFileChange}
//                         accept=".pdf"
//                         className="block w-full text-sm text-gray-500
//                       file:mr-4 file:py-2 file:px-4
//                       file:rounded file:border-0
//                       file:text-sm file:font-semibold
//                       file:bg-indigo-50 file:text-indigo-700
//                       hover:file:bg-indigo-100"
//                     />
//                 </div>

//                 {file && (
//                     <p className="text-sm text-gray-600">
//                         Selected file: {file.name} ({(file.size / 1024).toFixed(1)} KB)
//                     </p>
//                 )}

//                 <button
//                     type="submit"
//                     disabled={uploading || !file}
//                     className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 
//                     disabled:bg-indigo-300 disabled:cursor-not-allowed"
//                 >
//                     {uploading ? 'Submitting...' : 'Submit Solution'}
//                 </button>

//                 {error && <p className="text-red-500">{error}</p>}
//                 {success && <p className="text-green-500">Solution submitted successfully!</p>}
//             </form>
//         </div>
//     );
// }


// "use client";

// import { useState } from "react";
// import { projectsApi } from "@/app/api/api";
// import { Loader2, Upload } from "lucide-react";

// interface SubmissionFormProps {
//     projectId: number;
//     phase: "phase1" | "phase2";
//     onSubmissionSuccess?: () => void;
// }

// export default function SubmissionForm({ projectId, phase, onSubmissionSuccess }: SubmissionFormProps) {
//     const [selectedFile, setSelectedFile] = useState<File | null>(null);
//     const [status, setStatus] = useState<{
//         loading: boolean;
//         error: string | null;
//         success: boolean;
//     }>({
//         loading: false,
//         error: null,
//         success: false,
//     });

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0] || null;

//         if (file && file.type !== "application/pdf") {
//             setStatus({
//                 loading: false,
//                 error: "Only PDF files are allowed",
//                 success: false,
//             });
//             setSelectedFile(null);
//             return;
//         }

//         setSelectedFile(file);
//         setStatus({ loading: false, error: null, success: false });
//     };

//     const handleSubmit = async () => {
//         if (!selectedFile) return;

//         setStatus({ loading: true, error: null, success: false });

//         try {
//             const formData = new FormData();
//             formData.append("file", selectedFile);
//             formData.append("phase", phase);

//             await projectsApi.submitSolution(projectId, formData);

//             setStatus({ loading: false, error: null, success: true });
//             setSelectedFile(null);

//             if (onSubmissionSuccess) {
//                 onSubmissionSuccess();
//             }
//         } catch (err: any) {
//             setStatus({ loading: false, error: err.message || "Failed to submit solution", success: false });
//         }
//     };

//     return (
//         <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
//             <h4 className="text-lg font-semibold mb-4">Submit Your Solution for {phase === "phase1" ? "Phase 1" : "Phase 2"}</h4>

//             {!selectedFile ? (
//                 <label
//                     htmlFor={`file-upload-${phase}`}
//                     className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
//                 >
//                     <Upload className="w-8 h-8 mb-3 text-gray-500" />
//                     <p className="text-sm text-gray-600">
//                         Click to upload or drag and drop your PDF solution
//                     </p>
//                     <p className="text-xs text-gray-400">PDF files only</p>
//                     <input
//                         id={`file-upload-${phase}`}
//                         type="file"
//                         accept=".pdf"
//                         className="hidden"
//                         onChange={handleFileChange}
//                     />
//                 </label>
//             ) : (
//                 <div className="flex items-center justify-between bg-white p-4 border border-gray-300 rounded-md">
//                     <p className="truncate max-w-xs">{selectedFile.name}</p>
//                     <button
//                         onClick={() => setSelectedFile(null)}
//                         className="text-red-600 hover:text-red-800"
//                         aria-label="Remove selected file"
//                     >
//                         ✕
//                     </button>
//                 </div>
//             )}

//             <button
//                 onClick={handleSubmit}
//                 disabled={!selectedFile || status.loading}
//                 className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//                 {status.loading ? (
//                     <Loader2 className="h-5 w-5 mx-auto animate-spin" />
//                 ) : (
//                     "Submit Solution"
//                 )}
//             </button>

//             {status.error && <p className="mt-2 text-red-600">{status.error}</p>}
//             {status.success && <p className="mt-2 text-green-600">Submission successful!</p>}
//         </div>
//     );
// }


"use client";

import { useState } from "react";
import { projectsApi } from "@/app/api/api";
import { Loader2, Upload } from "lucide-react";

interface SubmissionFormProps {
    projectId: number | string;
    phase: "phase1" | "phase2";
    onSubmissionSuccess?: () => void;
}

export default function SubmissionForm({ projectId, phase, onSubmissionSuccess }: SubmissionFormProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [status, setStatus] = useState<{
        loading: boolean;
        error: string | null;
        success: boolean;
    }>({
        loading: false,
        error: null,
        success: false,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;

        if (file && file.type !== "application/pdf") {
            setStatus({
                loading: false,
                error: "Only PDF files are allowed",
                success: false,
            });
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
        setStatus({ loading: false, error: null, success: false });
    };

    const handleSubmit = async () => {
        if (!selectedFile) return;

        setStatus({ loading: true, error: null, success: false });

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);

            // Use the appropriate API method for each phase
            if (phase === "phase1") {
                await projectsApi.submitPhase1Solution(projectId.toString(), formData);
            } else if (phase === "phase2") {
                await projectsApi.submitPhase2Solution(projectId.toString(), formData);
            }

            setStatus({ loading: false, error: null, success: true });
            setSelectedFile(null);

            if (onSubmissionSuccess) {
                onSubmissionSuccess();
            }
        } catch (err: any) {
            setStatus({ loading: false, error: err.message || "Failed to submit solution", success: false });
        }
    };

    return (
        <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
            <h4 className="text-lg font-semibold mb-4">Submit Your Solution for {phase === "phase1" ? "Phase 1" : "Phase 2"}</h4>

            {!selectedFile ? (
                <label
                    htmlFor={`file-upload-${phase}`}
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                >
                    <Upload className="w-8 h-8 mb-3 text-gray-500" />
                    <p className="text-sm text-gray-600">
                        Click to upload or drag and drop your PDF solution
                    </p>
                    <p className="text-xs text-gray-400">PDF files only</p>
                    <input
                        id={`file-upload-${phase}`}
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </label>
            ) : (
                <div className="flex items-center justify-between bg-white p-4 border border-gray-300 rounded-md">
                    <p className="truncate max-w-xs">{selectedFile.name}</p>
                    <button
                        onClick={() => setSelectedFile(null)}
                        className="text-red-600 hover:text-red-800"
                        aria-label="Remove selected file"
                    >
                        ✕
                    </button>
                </div>
            )}

            <button
                onClick={handleSubmit}
                disabled={!selectedFile || status.loading}
                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {status.loading ? (
                    <Loader2 className="h-5 w-5 mx-auto animate-spin" />
                ) : (
                    "Submit Solution"
                )}
            </button>

            {status.error && <p className="mt-2 text-red-600">{status.error}</p>}
            {status.success && <p className="mt-2 text-green-600">Submission successful!</p>}
        </div>
    );
}