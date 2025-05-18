

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import pdf from "../../../public/pdf.jpg";
import {
    CheckCircle2,
    Clock,
    FileText,
    AlertCircle,
    Loader2,
    Upload,
    Download
} from "lucide-react";
import { projectsApi } from "@/app/api/api";
import { useAuth } from "@/app/context/AuthContext";
import SubmissionForm from "@/app/components/projects/SubmissionForm";

interface File {
    id: number;
    file_name: string;
    file_url: string;
    file_type: string;
}

interface Submission {
    id: number;
    file_name: string;
    file_url: string;
    submitted_at: string;
    username: string;
    phase: number; // API returns numeric phase (1 or 2)
}

// Update the Project interface
interface Project {
    id: number;
    title: string;
    description: string;
    created_at: string;
    files: File[];
    phase1Submissions?: Submission[];  // Changed from submissions
    phase2Submissions?: Submission[];  // Changed from submissions
    first_deadline?: string;
    final_deadline?: string;
    phase1Submission?: {
        id: number;
        file_name: string;
        file_url: string;
        submitted_at: string;
    } | null;
    phase2Submission?: {
        id: number;
        file_name: string;
        file_url: string;
        submitted_at: string;
    } | null;
    phase1DeadlinePassed?: boolean;
    phase2DeadlinePassed?: boolean;
}

export default function ProjectDetailsPage() {
    const { projectId } = useParams();
    const { user } = useAuth();
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<{
        loading: boolean;
        error: string | null;
        success: boolean;
    }>({
        loading: false,
        error: null,
        success: false,
    });

    useEffect(() => {
        const loadProject = async () => {
            try {
                setIsLoading(true);
                const data = await projectsApi.getProject(projectId as string);
                setProject(data.project);
            } catch (err) {
                console.error("Error loading project:", err);
                setError("Failed to load project details.");
            } finally {
                setIsLoading(false);
            }
        };

        if (projectId) {
            loadProject();
        }
    }, [projectId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;

        if (file && file.type !== "application/pdf") {
            setUploadStatus({
                loading: false,
                error: "Only PDF files are allowed",
                success: false,
            });
            setSelectedFile(null);
            return;
        }

        setUploadStatus({ loading: false, error: null, success: false });
        setSelectedFile(file);
    };

    const handleFileUpload = async () => {
        if (!selectedFile || !projectId) return;

        setUploadStatus({
            loading: true,
            error: null,
            success: false,
        });

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("fileType", "problem_statement");

            await projectsApi.uploadProjectFile(projectId as string, formData);

            const updated = await projectsApi.getProject(projectId as string);
            setProject(updated.project);

            setUploadStatus({
                loading: false,
                error: null,
                success: true,
            });

            setTimeout(() => {
                setUploadStatus((prev) => ({ ...prev, success: false }));
            }, 3000);

            setSelectedFile(null); // clear after upload
        } catch (err: any) {
            console.error("File upload failed", err);
            setUploadStatus({
                loading: false,
                error: err.message || "Failed to upload file",
                success: false,
            });
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Helper to filter submissions by phase (converts numeric phases to strings for UI)
    const submissionsByPhase = (phase: "phase1" | "phase2") => {
        if (!Array.isArray(project?.submissions)) return [];

        // Map phase1/phase2 string to numeric value from API
        const numericPhase = phase === "phase1" ? 1 : 2;
        return project.submissions?.filter(sub => sub.phase === numericPhase) || [];
    };

    // Check if user submitted for a particular phase
    const hasSubmittedForPhase = (phase: "phase1" | "phase2") => {
        if (!user?.role === "student") {
            return false;
        }

        if (phase === "phase1") {
            return !!project?.phase1Submission;
        } else {
            return !!project?.phase2Submission;
        }
    };

    // Check if deadlines have passed
    const isDeadlinePassed = (phase: "phase1" | "phase2") => {
        if (!project) return false;

        if (phase === "phase1") {
            return !!project.phase1DeadlinePassed;
        } else {
            return !!project.phase2DeadlinePassed;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Loading project details...</p>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="max-w-xl mx-auto mt-8 p-6 bg-red-50 border-l-4 border-red-500 rounded-md shadow-sm">
                <div className="flex items-center">
                    <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
                    <h3 className="text-lg font-medium text-red-800">Error Loading Project</h3>
                </div>
                <p className="mt-2 text-red-700">{error || "Project not found"}</p>
                <button
                    className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md transition-colors"
                    onClick={() => window.location.reload()}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            {/* Project header and details */}
            <div className="mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
                    {project.title}
                </h1>
                <p className="text-gray-600 text-center mt-2 max-w-2xl mx-auto">
                    {formatDate(project.created_at)}
                </p>
                {project.first_deadline && (
                    <p className="text-indigo-600 text-center mt-1">
                        Phase 1 Deadline: {formatDate(project.first_deadline)}
                    </p>
                )}
                {project.final_deadline && (
                    <p className="text-indigo-600 text-center mt-1">
                        Phase 2 Deadline: {formatDate(project.final_deadline)}
                    </p>
                )}
            </div>

            {/* Project Description and Files */}
            <div className="border border-gray-200 rounded-xl shadow-sm bg-white mb-8 overflow-hidden">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Project Description</h2>
                    <p className="text-gray-600 mb-6 whitespace-pre-line">{project.description}</p>

                    {/* Project Files */}
                    <div className="mt-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <FileText className="mr-2" size={20} />
                            Problem Statement Files
                        </h2>

                        {project.files && project.files.length > 0 ? (
                            <div className="grid gap-4">
                                {project.files.map((file) => (
                                    <div
                                        key={file.id}
                                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="relative w-12 h-16 flex-shrink-0 mr-4 rounded-md border border-gray-200 bg-gray-50 overflow-hidden">
                                            <Image
                                                src={pdf}
                                                alt="File icon"
                                                fill
                                                className="object-contain p-1"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate" title={file.file_name}>
                                                {file.file_name}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {file.file_type.toUpperCase()} Document
                                            </p>
                                        </div>
                                        <Link
                                            href={file.file_url}
                                            target="_blank"
                                            className="ml-4 flex items-center px-3 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-md transition-colors"
                                        >
                                            <Download size={16} className="mr-1" />
                                            Download
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600">No problem statement files uploaded yet.</p>
                            </div>
                        )}

                        {/* File Upload Form for Teachers and Managers */}
                        {(user?.role === 'teacher' ||
                            user?.role === 'academic_team' ||
                            user?.role === 'evaluator' ||
                            user?.role === 'manager' ||
                            user?.role === 'coordinator' ||
                            user?.role === 'admin') && (
                                <div className="mt-8 border border-gray-200 rounded-lg p-6 bg-gray-50">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Problem Statement</h3>

                                    <div className="space-y-4">
                                        {!selectedFile ? (
                                            <div className="flex items-center justify-center w-full">
                                                <label
                                                    htmlFor="file-upload"
                                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                                        <p className="mb-2 text-sm text-gray-500">
                                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                                        </p>
                                                        <p className="text-xs text-gray-500">PDF files only</p>
                                                    </div>
                                                    <input
                                                        id="file-upload"
                                                        type="file"
                                                        className="hidden"
                                                        onChange={handleFileChange}
                                                        accept=".pdf"
                                                    />
                                                </label>
                                            </div>
                                        ) : (
                                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center">
                                                        <div className="relative w-10 h-12 flex-shrink-0 mr-3">
                                                            <Image
                                                                src={pdf}
                                                                alt="File icon"
                                                                fill
                                                                className="object-contain"
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{selectedFile.name}</p>
                                                            <p className="text-sm text-gray-500"> {(selectedFile.size / 1024).toFixed(2)} KB </p>
                                                        </div>
                                                    </div>
                                                    <button className="text-red-600 hover:text-red-800" onClick={() => setSelectedFile(null)} aria-label="Remove selected file" > ✕ </button>
                                                </div>
                                                <button
                                                    className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    onClick={handleFileUpload}
                                                    disabled={uploadStatus.loading}
                                                >
                                                    {uploadStatus.loading ? (
                                                        <Loader2 className="h-5 w-5 mx-auto animate-spin" />
                                                    ) : (
                                                        "Upload File"
                                                    )}
                                                </button>

                                                {uploadStatus.error && (
                                                    <p className="text-red-600 mt-2">{uploadStatus.error}</p>
                                                )}
                                                {uploadStatus.success && (
                                                    <p className="text-green-600 mt-2">File uploaded successfully!</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </div>

            {/* Submissions Section */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Student Submissions</h2>

                {/* Phase 1 Submissions */}
                <div className="mb-10 border border-gray-200 rounded-lg bg-white p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">Phase 1 Submissions</h3>

                    {/* Phase 1 Submission */}
                    {user?.role === "student" && project.phase1Submission ? (
                        <div className="grid gap-4">
                            <div className="flex items-center justify-between border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="relative w-12 h-16 flex-shrink-0 rounded-md border border-gray-200 bg-gray-50 overflow-hidden">
                                        <Image
                                            src={pdf}
                                            alt="Submission PDF"
                                            fill
                                            className="object-contain p-1"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 truncate max-w-xs" title={project.phase1Submission.file_name}>
                                            {project.phase1Submission.file_name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Submitted on {formatDate(project.phase1Submission.submitted_at)}
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href={project.phase1Submission.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800"
                                >
                                    <Download size={18} />
                                    <span>Download</span>
                                </a>
                            </div>
                        </div>
                    ) : (
                        <>
                            {project.phase1Submissions && project.phase1Submissions.length > 0 ? (
                                <div className="grid gap-4">
                                    {project.phase1Submissions.map((submission) => (
                                        <div key={submission.id} className="flex items-center justify-between border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center space-x-4">
                                                <div className="relative w-12 h-16 flex-shrink-0 rounded-md border border-gray-200 bg-gray-50 overflow-hidden">
                                                    <Image
                                                        src={pdf}
                                                        alt="Submission PDF"
                                                        fill
                                                        className="object-contain p-1"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 truncate max-w-xs">
                                                        {submission.file_name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Submitted by {submission.username} on {formatDate(submission.submitted_at)}
                                                    </p>
                                                </div>
                                            </div>
                                            <a
                                                href={submission.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800"
                                            >
                                                <Download size={18} />
                                                <span>Download</span>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600">No submissions for Phase 1 yet.</p>
                            )}</>
                    )}

                    {/* Phase 1 Submission Form */}
                    {user?.role === "student" && !project.phase1Submission && !project.phase1DeadlinePassed && (
                        <div className="mt-6">
                            <SubmissionForm
                                projectId={project.id}
                                phase="phase1"
                                onSubmissionSuccess={async () => {
                                    const updated = await projectsApi.getProject(projectId as string);
                                    setProject(updated.project);
                                }}
                            />
                        </div>
                    )}

                    {/* Message if student already submitted */}
                    {user?.role === "student" && !!project.phase1Submission && (
                        <p className="mt-4 text-green-700 font-medium">
                            You have already submitted for Phase 1.
                        </p>
                    )}

                    {/* Message if deadline has passed */}
                    {user?.role === "student" && !project.phase1Submission && project.phase1DeadlinePassed && (
                        <p className="mt-4 text-red-600 font-medium">
                            The deadline for Phase 1 has passed.
                        </p>
                    )}
                </div>

                {/* Phase 2 Submissions */}
                <div className="mb-10 border border-gray-200 rounded-lg bg-white p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">Phase 2 Submissions</h3>

                    {/* Phase 2 Submission */}
                    {project.phase2Submission ? (
                        <div className="grid gap-4">
                            <div className="flex items-center justify-between border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="relative w-12 h-16 flex-shrink-0 rounded-md border border-gray-200 bg-gray-50 overflow-hidden">
                                        <Image
                                            src={pdf}
                                            alt="Submission PDF"
                                            fill
                                            className="object-contain p-1"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 truncate max-w-xs" title={project.phase2Submission.file_name}>
                                            {project.phase2Submission.file_name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Submitted on {formatDate(project.phase2Submission.submitted_at)}
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href={project.phase2Submission.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800"
                                >
                                    <Download size={18} />
                                    <span>Download</span>
                                </a>
                            </div>
                        </div>
                    ) : (
                        <>
                            {project.phase2Submissions && project.phase2Submissions.length > 0 ? (
                                <div className="grid gap-4">
                                    {project.phase2Submissions.map((submission) => (
                                        <div key={submission.id} className="flex items-center justify-between border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center space-x-4">
                                                <div className="relative w-12 h-16 flex-shrink-0 rounded-md border border-gray-200 bg-gray-50 overflow-hidden">
                                                    <Image
                                                        src={pdf}
                                                        alt="Submission PDF"
                                                        fill
                                                        className="object-contain p-1"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 truncate max-w-xs">
                                                        {submission.file_name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Submitted by {submission.username} on {formatDate(submission.submitted_at)}
                                                    </p>
                                                </div>
                                            </div>
                                            <a
                                                href={submission.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800"
                                            >
                                                <Download size={18} />
                                                <span>Download</span>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600">No submissions for Phase 2 yet.</p>
                            )}
                        </>
                    )}

                    {/* Phase 2 Submission Form */}
                    {user?.role === "student" && !project.phase2Submission && project.phase1Submission && !project.phase2DeadlinePassed && (
                        <div className="mt-6">
                            <SubmissionForm
                                projectId={project.id}
                                phase="phase2"
                                onSubmissionSuccess={async () => {
                                    const updated = await projectsApi.getProject(projectId as string);
                                    setProject(updated.project);
                                }}
                            />
                        </div>
                    )}

                    {/* Message if student already submitted */}
                    {user?.role === "student" && !!project.phase2Submission && (
                        <p className="mt-4 text-green-700 font-medium">
                            You have already submitted for Phase 2.
                        </p>
                    )}

                    {/* Message if student needs to submit Phase 1 first */}
                    {user?.role === "student" && !project.phase2Submission && !project.phase1Submission && !project.phase2DeadlinePassed && (
                        <p className="mt-4 text-amber-600 font-medium">
                            You must submit Phase 1 before you can submit Phase 2.
                        </p>
                    )}

                    {/* Message if deadline has passed */}
                    {user?.role === "student" && !project.phase2Submission && project.phase2DeadlinePassed && (
                        <p className="mt-4 text-red-600 font-medium">
                            The deadline for Phase 2 has passed.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}