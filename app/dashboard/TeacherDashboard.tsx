// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { projectsApi } from '@/app/api/api';
// import ProjectCard from '@/app/components/projects/ProjectCard';
// import { FileText, FolderOpen, UploadCloud, CheckCircle2 } from 'lucide-react';

// interface Project {
//   id: number;
//   title: string;
//   description: string;
//   created_at: string;
//   submissionCount: number;
//   files: File[];
// }

// interface File {
//   id: number;
//   project_id: number;
//   file_name: string;
//   file_url: string;
//   file_type: string;
// }

// const TeacherDashboard = () => {
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         setIsLoading(true);
//         const data = await projectsApi.getTeacherProjects();
//         setProjects(data.projects);
//       } catch (err) {
//         setError('Failed to load projects');
//         console.error(err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProjects();
//   }, []);

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-semibold text-gray-800">Your Capstone Projects</h2>
//         <Link
//           href="/projects/create"
//           className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md flex items-center"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-5 w-5 mr-2"
//             viewBox="0 0 20 20"
//             fill="currentColor"
//           >
//             <path
//               fillRule="evenodd"
//               d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
//               clipRule="evenodd"
//             />
//           </svg>
//           Create New Project
//         </Link>
//       </div>

//       {isLoading ? (
//         <div className="flex justify-center py-12">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
//         </div>
//       ) : error ? (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       ) : projects.length === 0 ? (
//         <div className="text-center py-12 bg-gray-50 rounded-lg">
//           <h3 className="text-xl font-medium text-gray-700 mb-2">No Projects Yet</h3>
//           <p className="text-gray-600 mb-6">
//             Get started by creating your first capstone project
//           </p>
//           <Link
//             href="/projects/create"
//             className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-md inline-flex items-center"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5 mr-2"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             Create Project
//           </Link>
//         </div>
//       ) : (
//         <div className="space-y-8">
//           {projects.map((project) => (
//             <div key={project.id} className="border rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
//               <ProjectCard project={project} />
//             </div>
//           ))}
//         </div>
//       )}

//       <div className="mt-12 bg-gray-50 rounded-lg p-6">
//         <h3 className="text-xl font-semibold mb-4 text-gray-800">Quick Stats</h3>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//           <div className="bg-white p-5 rounded-xl shadow-sm flex items-center space-x-4">
//             <FolderOpen className="text-indigo-600 w-6 h-6" />
//             <div>
//               <p className="text-sm text-gray-500">Total Projects</p>
//               <p className="text-2xl font-bold text-gray-800">{projects.length}</p>
//             </div>
//           </div>

//           <div className="bg-white p-5 rounded-xl shadow-sm flex items-center space-x-4">
//             <FileText className="text-green-600 w-6 h-6" />
//             <div>
//               <p className="text-sm text-gray-500">Total Submissions</p>
//               <p className="text-2xl font-bold text-gray-800">
//                 {projects.reduce((sum, project) => sum + project.submissionCount, 0)}
//               </p>
//             </div>
//           </div>

//           <div className="bg-white p-5 rounded-xl shadow-sm flex items-center space-x-4">
//             <CheckCircle2 className="text-blue-600 w-6 h-6" />
//             <div>
//               <p className="text-sm text-gray-500">Active Projects</p>
//               <p className="text-2xl font-bold text-gray-800">{projects.length}</p>
//             </div>
//           </div>

//           <div className="bg-white p-5 rounded-xl shadow-sm flex items-center space-x-4">
//             <UploadCloud className="text-purple-600 w-6 h-6" />
//             <div>
//               <p className="text-sm text-gray-500">Files Uploaded</p>
//               <p className="text-2xl font-bold text-gray-800">
//                 {projects.reduce((sum, project) => sum + project.files.length, 0)}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TeacherDashboard;

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { projectsApi } from '@/app/api/api';
import ProjectCard from '@/app/components/projects/ProjectCardTeacher';
import { FileText, FolderOpen, UploadCloud, CheckCircle2 } from 'lucide-react';

interface File {
  id: number;
  project_id: number;
  file_name: string;
  file_url: string;
  file_type: string;
}

interface Submission {
  id: number;
  student_id: number;
  phase: number; // Phase 1 or 2
  file_name: string;
  file_url: string;
  submitted_at: string;
  final_deadline: string; // Added final deadline

}

interface Project {
  id: number;
  title: string;
  description: string;
  created_at: string;
  files: File[];
  submissions?: Submission[];  // optional but should default to []
}

const TeacherDashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const data = await projectsApi.getTeacherProjects();
        console.log("Projects:", data.projects);


        // Ensure submissions is always an array
        const projectsWithSubs = data.projects.map((project: Project) => ({
          ...project,
          submissions: project.submissions || [],
        }));

        setProjects(projectsWithSubs);
      } catch (err) {
        setError('Failed to load projects');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const countActiveProjects = () => {
    const now = new Date();
    return projects.filter(project => {
      const isCompleted = project.hasSubmittedPhase1 && project.hasSubmittedPhase2;
      const deadlinePassed = new Date(project.final_deadline) < now;
      return !isCompleted && !deadlinePassed;
    }).length;
  };


  // Count submissions only if both phases (1 and 2) are submitted by the student
  const countFullySubmitted = (project: Project) => {
    if (!project.submissions || !Array.isArray(project.submissions)) {
      return 0;
    }

    const submissionsByStudent = project.submissions.reduce<Record<number, Set<number>>>((acc, sub) => {
      if (!acc[sub.student_id]) acc[sub.student_id] = new Set();
      acc[sub.student_id].add(sub.phase);
      return acc;
    }, {});

    // Count students who have submitted both phase 1 and 2
    return Object.values(submissionsByStudent).filter(phasesSet => phasesSet.has(1) && phasesSet.has(2)).length;
  };

  // Count total files uploaded in all projects
  const countFilesUploaded = () => projects.reduce((sum, project) => sum + project.files.length, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Your Capstone Projects</h2>
        <Link
          href="/projects/create"
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Create New Project
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium text-gray-700 mb-2">No Projects Yet</h3>
          <p className="text-gray-600 mb-6">
            Get started by creating your first capstone project
          </p>
          <Link
            href="/projects/create"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-md inline-flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create Project
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {projects.map((project) => (
            <div key={project.id} className="border rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Quick Stats</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-xl shadow-sm flex items-center space-x-4">
            <FolderOpen className="text-indigo-600 w-6 h-6" />
            <div>
              <p className="text-sm text-gray-500">Total Projects</p>
              <p className="text-2xl font-bold text-gray-800">{projects.length}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm flex items-center space-x-4">
            <FileText className="text-green-600 w-6 h-6" />
            <div>
              <p className="text-sm text-gray-500">Total Full Submissions</p>
              <p className="text-2xl font-bold text-gray-800">
                {projects.reduce((sum, project) => sum + project.completeSubmissionCount, 0)}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm flex items-center space-x-4">
            <CheckCircle2 className="text-blue-600 w-6 h-6" />
            <div>
              <p className="text-sm text-gray-500">Active Projects</p>
              <p className="text-2xl font-bold text-gray-800">{countActiveProjects()}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm flex items-center space-x-4">
            <UploadCloud className="text-purple-600 w-6 h-6" />
            <div>
              <p className="text-sm text-gray-500">Files Uploaded</p>
              <p className="text-2xl font-bold text-gray-800">{countFilesUploaded()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
