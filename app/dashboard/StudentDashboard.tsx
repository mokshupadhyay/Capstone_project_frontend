'use client';

import { useState, useEffect } from 'react';
import ProjectCard from '@/app/components/projects/ProjectCard';
import { projectsApi } from '../api/api';
import { BookCheck, Clock4, BookOpen } from 'lucide-react';

interface File {
  id: number;
  project_id: number;
  file_name: string;
  file_url: string;
  file_type: string;
}

interface Submission {
  id: number;
  project_id: number;
  student_id: number;
  file_name: string;
  file_url: string;
  submitted_at: string;
  phase: number;
}

interface Project {
  id: number;
  title: string;
  description: string;
  created_at: string;
  files: File[];
  hasSubmittedPhase1: boolean;
  hasSubmittedPhase2: boolean;
  phase1Submission?: Submission;
  phase2Submission?: Submission;
}

const StudentDashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const data = await projectsApi.getStudentProjects();
        console.log("data projects", data);

        const uniqueProjects = Array.from(
          new Map(
            data.projects.map((project: Project) => [
              project.id,
              {
                ...project,
                // Check if both phases are submitted
                hasSubmitted: project.hasSubmittedPhase1 && project.hasSubmittedPhase2,
              },
            ])
          )
        ).map(([_, project]) => project);

        setProjects(uniqueProjects);
      } catch (err) {
        setError('Failed to load projects');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const completedProjects = projects.filter((project) => project.hasSubmitted);
  const pendingProjects = projects.filter((project) => !project.hasSubmitted);

  return (
    <div>
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
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No Projects Available
          </h3>
          <p className="text-gray-600">
            There are currently no projects available for you. Check back later.
          </p>
        </div>
      ) : (
        <>
          <div className="my-12 bg-gray-50 rounded-lg p-10">
            <h3 className="text-3xl font-semibold mb-4 text-gray-800">Your Progress</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-xl shadow-sm flex items-center space-x-4">
                <BookOpen className="text-indigo-600 w-6 h-6" />
                <div>
                  <p className="text-sm text-gray-500">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-800">{projects.length}</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm flex items-center space-x-4">
                <BookCheck className="text-green-600 w-6 h-6" />
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {completedProjects.length}
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm flex items-center space-x-4">
                <Clock4 className="text-yellow-600 w-6 h-6" />
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {pendingProjects.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {pendingProjects.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Pending Projects
              </h2>
              <div className="space-y-8">
                {pendingProjects.map((project) => (
                  <div
                    key={`pending-${project.id}`}
                    className="border rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <ProjectCard project={project} role="student" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {completedProjects.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Completed Projects
              </h2>
              <div className="space-y-8">
                {completedProjects.map((project) => (
                  <div
                    key={`completed-${project.id}`}
                    className="border rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <ProjectCard project={project} role="student" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentDashboard;
