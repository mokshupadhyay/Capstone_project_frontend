"use client";

// Environment variable for API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Get token from localStorage (only works client-side)
const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// Custom error class for API errors
class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Helper function for API requests with improved error handling and debugging
async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers || {}),
  };

  try {
    console.log(`Making request to: ${API_URL}${endpoint}`);

    // Log the actual payload being sent
    if (options.body) {
      const bodyContent =
        typeof options.body === "string"
          ? JSON.parse(options.body)
          : options.body;
      console.log("Request payload:", bodyContent);
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Log response status
    console.log(`Response status: ${response.status}`);

    // Try to get the response as JSON
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
      console.log("Response data:", data);
    } else {
      const text = await response.text();
      console.log("Response (not JSON):", text);
      // Try to parse as JSON anyway in case content-type is wrong
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = { message: text };
      }
    }

    if (!response.ok) {
      // Handle forbidden responses (403)
      if (response.status === 403) {
        // Check if it's a pending approval error
        if (data?.pending_approval) {
          throw new ApiError(
            data.message || "Your account is pending approval",
            response.status,
            "PENDING_APPROVAL",
            { pending_approval: true }
          );
        }
        // Handle other forbidden errors
        throw new ApiError(
          data.message || "Access forbidden",
          response.status,
          "FORBIDDEN"
        );
      }

      // Handle unauthorized responses (401)
      if (response.status === 401) {
        // Clear token as it might be invalid/expired
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
        throw new ApiError(
          data.message || "Unauthorized access",
          response.status,
          "UNAUTHORIZED"
        );
      }

      // Handle other errors
      throw new ApiError(
        data.message || `Error ${response.status} from ${endpoint}`,
        response.status
      );
    }

    return data as T;
  } catch (error) {
    console.error("Fetch error:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      "Network or server error. Please try again later.",
      500,
      "NETWORK_ERROR"
    );
  }
}

// Types (keep existing types)
interface Project {
  id: string;
  title: string;
  description: string;
}

interface UserData {
  username: string;
  password: string;
  email: string;
  role: string;
}

interface ProjectData {
  title: string;
  description: string;
  deadline: string; // ISO format date string
  accessRoles?: Array<{
    role: string;
    canView: boolean;
    canEdit: boolean;
    canSubmit: boolean;
  }>;
}

interface SubmissionResponse {
  message: string;
  submissionId: string;
  fileName: string;
  fileUrl: string;
  status: string;
  size: string;
}

interface FileUploadResponse {
  message: string;
  fileId: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
  size: string;
  compressed: boolean;
}

interface ProjectResponse {
  submissions: Array<{
    student_id: string;
    username: string;
    email: string;
    submission_id: string | null;
    file_url: string | null;
    submitted_at: string | null;
    status: string | null;
    review_count?: number;
  }>;
  project_state: "active" | "past";
}

// ---------- Projects API ----------
export const projectsApi = {
  // Get submissions for a project (Teacher, Academic Team, etc.)
  getSubmissions: (projectId: string): Promise<any[]> => {
    return fetchWithAuth(`/api/projects/${projectId}/submissions`);
  },

  // Get complete submissions (across phases)
  getCompleteSubmissions: (projectId: string): Promise<any[]> =>
    fetchWithAuth(`/api/projects/${projectId}/complete-submissions`),

  getSubmissionsReview: (projectId: string): Promise<ProjectResponse> =>
    fetchWithAuth(`/api/projects/${projectId}/submissions-review`),

  // ---------- Reviews ----------

  // Get all reviews for a submission
  getReviews: (submissionId: string): Promise<any[]> =>
    fetchWithAuth(`/api/reviews/${submissionId}`),

  // Get reviews for a specific submission
  getSubmissionReviews: (submissionId: string): Promise<any[]> =>
    fetchWithAuth(`/api/submissions/${submissionId}/reviews`),

  // Submit a new review
  submitReview: (
    submissionId: string,
    reviewData: { rating: number; comments: string }
  ): Promise<any> =>
    fetchWithAuth(`/api/submissions/${submissionId}/reviews`, {
      method: "POST",
      body: JSON.stringify(reviewData),
    }),

  // Update a review
  updateReview: (
    reviewId: string,
    updatedReview: { rating: number; comments: string }
  ) =>
    fetchWithAuth(`/api/reviews/${reviewId}`, {
      method: "PUT",
      body: JSON.stringify(updatedReview),
    }),

  // Delete a review
  deleteReview: (reviewId: string) =>
    fetchWithAuth(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    }),
  // Create project (Teacher)
  createProject: (projectData: ProjectData): Promise<any> => {
    console.log("Creating project with data:", projectData);

    // Validate date field before sending
    try {
      // Make sure the date string can be parsed
      const deadlineDate = new Date(projectData.deadline);

      if (isNaN(deadlineDate.getTime())) {
        throw new Error("Invalid date format in project data");
      }

      // Continue with the API call
      return fetchWithAuth("/api/projects", {
        method: "POST",
        body: JSON.stringify(projectData),
      });
    } catch (err) {
      console.error("Date validation error:", err);
      return Promise.reject(err);
    }
  },
  // Upload a single project file (problem_statement/dataset/additional_resource) with debug logs
  uploadProjectFile: async (
    projectId: string,
    formData: FormData,
    fileType: string // Add fileType parameter
  ): Promise<FileUploadResponse> => {
    const token = getToken();
    if (!token) throw new Error("Authentication required");
    if (!projectId) throw new Error("Project ID is required");

    try {
      const response = await fetch(
        `${API_URL}/api/projects/${projectId}/files/${fileType}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const contentType = response.headers.get("content-type");
      let data: any;

      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text };
        }
      }

      if (!response.ok) {
        throw new Error(
          data.message || `File upload failed (${response.status})`
        );
      }

      return {
        message: data.message,
        fileId: data.fileId,
        fileName: data.fileName,
        fileUrl: data.fileUrl,
        fileType: data.fileType,
        size: data.size,
        compressed: data.compressed,
      };
    } catch (error) {
      console.error("File upload error:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to upload file. Please try again."
      );
    }
  },
  // Teacher: Get all projects
  getTeacherProjects: (): Promise<any> =>
    fetchWithAuth("/api/teacher/projects"),

  getAllProjects: (): Promise<any> => fetchWithAuth("/api/all/projects"),

  // Student: Get accessible projects
  getStudentProjects: (): Promise<any> =>
    fetchWithAuth("/api/student/projects"),

  // Get single project details
  getProject: (projectId: string): Promise<any> =>
    fetchWithAuth(`/api/projects/${projectId}`),

  // Delete a project and all its associated data
  deleteProject: (projectId: string): Promise<any> =>
    fetchWithAuth(`/api/projects/${projectId}`, {
      method: "DELETE",
    }),

  getProjectOthers: (projectId: string): Promise<any> =>
    fetchWithAuth(`/api/projects/${projectId}/others`),

  // Submit solution for Phase 1
  // Update to submitPhase1Solution and submitPhase2Solution in projectsApi

  // Submit solution for Phase 1
  submitPhase1Solution: (
    projectId: string,
    formData: FormData
  ): Promise<SubmissionResponse> => {
    const token = getToken();
    if (!token) throw new Error("Authentication required");

    console.log(`Submitting Phase 1 solution for project: ${projectId}`);

    // Log file content for debugging
    const file = formData.get("file") as File;
    if (file) {
      console.log("File details:", {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(2)} KB`,
      });
    }

    return fetch(`${API_URL}/api/projects/${projectId}/submissions/phase1`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }).then(async (response) => {
      // Handle both JSON and non-JSON responses
      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch (e) {
          data = { message: text || "Unknown error" };
        }
      }

      console.log("Phase 1 submission response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Phase 1 submission failed");
      }
      return data;
    });
  },

  // Submit solution for Phase 2
  submitPhase2Solution: (
    projectId: string,
    formData: FormData
  ): Promise<SubmissionResponse> => {
    const token = getToken();
    if (!token) throw new Error("Authentication required");

    console.log(`Submitting Phase 2 solution for project: ${projectId}`);

    // Log file content for debugging
    const file = formData.get("file") as File;
    if (file) {
      console.log("File details:", {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(2)} KB`,
      });
    }

    return fetch(`${API_URL}/api/projects/${projectId}/submissions/phase2`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }).then(async (response) => {
      // Handle both JSON and non-JSON responses
      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch (e) {
          data = { message: text || "Unknown error" };
        }
      }

      console.log("Phase 2 submission response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Phase 2 submission failed");
      }
      return data;
    });
  },

  // Submit solution (single phase)
  submitSolution: (
    projectId: string,
    formData: FormData
  ): Promise<SubmissionResponse> => {
    const token = getToken();
    if (!token) throw new Error("Authentication required");

    console.log(`Submitting solution for project: ${projectId}`);

    // Log file content for debugging
    const file = formData.get("file") as File;
    if (file) {
      console.log("File details:", {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(2)} KB`,
      });
    }

    return fetch(`${API_URL}/api/projects/${projectId}/submissions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }).then(async (response) => {
      // Handle both JSON and non-JSON responses
      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch (e) {
          data = { message: text || "Unknown error" };
        }
      }

      console.log("Submission response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Submission failed");
      }
      return data;
    });
  },

  // Update project deadline
  updateProjectDeadline: (
    projectId: string,
    data: {
      deadline: string;
    }
  ): Promise<any> => {
    return fetchWithAuth(`/api/projects/${projectId}/deadlines`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deadline: new Date(data.deadline).toISOString(),
      }),
    });
  },

  // Update project state
  updateProjectState: (
    projectId: string,
    data: {
      state: "active" | "past";
      deadline?: string;
    }
  ): Promise<any> => {
    return fetchWithAuth(`/api/projects/${projectId}/state`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },
};

// ---------- Manager API ----------
export const managerApi = {
  // Get all managers
  getAllManagers: (): Promise<any[]> => fetchWithAuth("/api/managers"),

  // Get a single manager by ID
  getManagerById: (managerId: string): Promise<any> =>
    fetchWithAuth(`/api/managers/${managerId}`),

  // Create a new manager
  createManager: (managerData: {
    name: string;
    email: string;
    department?: string;
    role: string;
  }): Promise<any> =>
    fetchWithAuth("/api/managers", {
      method: "POST",
      body: JSON.stringify(managerData),
    }),

  // Update an existing manager
  updateManager: (
    managerId: string,
    updatedData: Partial<{
      name: string;
      email: string;
      department: string;
      role: string;
    }>
  ): Promise<any> =>
    fetchWithAuth(`/api/managers/${managerId}`, {
      method: "PUT",
      body: JSON.stringify(updatedData),
    }),

  // Delete a manager
  deleteManager: (managerId: string): Promise<any> =>
    fetchWithAuth(`/api/managers/${managerId}`, {
      method: "DELETE",
    }),

  // Assign manager to project
  assignManagerToProject: (
    managerId: string,
    projectId: string
  ): Promise<any> =>
    fetchWithAuth(`/api/projects/${projectId}/assign-manager`, {
      method: "POST",
      body: JSON.stringify({ managerId }),
    }),

  // Get projects assigned to a manager
  getManagerProjects: (managerId: string): Promise<any[]> =>
    fetchWithAuth(`/api/managers/${managerId}/projects`),

  // ---------------- Additional Project Access Routes ----------------

  // Get all students with their project access
  getStudentsWithAccess: (): Promise<any> =>
    fetchWithAuth("/api/manager/students-with-access"),

  // Grant project access to a student
  grantProjectAccess: (studentId: string, projectId: string): Promise<any> =>
    fetchWithAuth(`/api/manager/students/${studentId}/projects/${projectId}`, {
      method: "POST",
    }),

  // Remove project access from a student
  removeProjectAccess: (studentId: string, projectId: string): Promise<any> =>
    fetchWithAuth(`/api/manager/students/${studentId}/projects/${projectId}`, {
      method: "DELETE",
    }),

  // Get all students
  getAllStudents: (): Promise<any> => fetchWithAuth("/api/manager/students"),

  // Get pending projects for approval
  getPendingProjects: (): Promise<any> =>
    fetchWithAuth("/api/manager/pending-projects"),

  // Approve project and assign to students
  // In api.ts
  approveProject: (payload: {
    projectId: string;
    approvedStudentIds: string[];
  }): Promise<any> =>
    fetchWithAuth("/api/manager/approve-project", {
      method: "POST",
      body: JSON.stringify(payload), // Properly stringify the payload object
    }),

  // Get project access details for a specific student
  getStudentProjectAccess: (studentId: string): Promise<any> =>
    fetchWithAuth(`/api/manager/students/${studentId}/projects`),

  // Bulk grant access to students for a project
  bulkGrantAccess: (projectId: string, studentIds: string[]): Promise<any> =>
    fetchWithAuth(`/api/manager/projects/${projectId}/grant-access`, {
      method: "POST",
      body: JSON.stringify({ studentIds }),
    }),

  // Get access summary for all projects
  getAccessSummary: (): Promise<any> =>
    fetchWithAuth("/api/manager/access-summary"),
};

// ---------- Auth API ----------
export const authApi = {
  // Login
  login: (usernameOrEmail: string, password: string): Promise<any> =>
    fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usernameOrEmail, password }),
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      return data;
    }),

  // Register
  register: (userData: UserData): Promise<any> =>
    fetch(`${API_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
      return data;
    }),

  // Forgot password
  forgotPassword: (email: string, newPassword: string): Promise<any> => {
    return fetchWithAuth("/api/forgot-password", {
      method: "POST",
      body: JSON.stringify({
        email,
        password: newPassword,
      }),
    });
  },
};

// ---------- Admin API ----------
export const adminApi = {
  // Get all pending users awaiting approval
  getPendingUsers: (): Promise<any> =>
    fetchWithAuth("/api/admin/pending-users"),

  // Get all users (both approved and pending)
  getAllUsers: (): Promise<any> => fetchWithAuth("/api/admin/users"),

  // Approve or reject a user
  updateUserApproval: (userId: string, approve: boolean): Promise<any> =>
    fetchWithAuth(`/api/admin/users/${userId}/approve`, {
      method: "POST",
      body: JSON.stringify({ approve }),
    }),

  // Get user approval status
  getUserApprovalStatus: (): Promise<any> =>
    fetchWithAuth("/api/users/approval-status"),

  // Get admin dashboard stats
  getDashboardStats: (): Promise<any> =>
    fetchWithAuth("/api/admin/dashboard-stats"),
};
