// "use client";

// // Environment variable for API URL
// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// // Get token from localStorage (only works client-side)
// const getToken = (): string | null => {
//   if (typeof window !== "undefined") {
//     return localStorage.getItem("token");
//   }
//   return null;
// };

// // Helper function for API requests with improved error handling and debugging
// async function fetchWithAuth<T>(
//   endpoint: string,
//   options: RequestInit = {}
// ): Promise<T> {
//   const token = getToken();

//   const headers = {
//     "Content-Type": "application/json",
//     ...(token && { Authorization: `Bearer ${token}` }),
//     ...(options.headers || {}),
//   };

//   try {
//     console.log(`Making request to: ${API_URL}${endpoint}`);
//     if (options.body) {
//       console.log("Request payload:", options.body);
//     }

//     const response = await fetch(`${API_URL}${endpoint}`, {
//       ...options,
//       headers,
//     });

//     // Log response status
//     console.log(`Response status: ${response.status}`);

//     const data = await response.json();
//     console.log("Response data:", data);

//     if (!response.ok) {
//       throw new Error(data.message || `Error from ${endpoint}`);
//     }

//     return data as T;
//   } catch (error) {
//     console.error("Fetch error:", error);
//     if (error instanceof Error) {
//       throw error;
//     }
//     throw new Error("Network or server error. Please try again later.");
//   }
// }

// // Types (keep existing types)
// interface Project {
//   id: string;
//   title: string;
//   description: string;
// }

// interface UserData {
//   username: string;
//   password: string;
//   email: string;
//   role: string;
// }

// interface ProjectData {
//   title: string;
//   description: string;
//   firstDeadline: string; // ISO format date string
//   finalDeadline: string; // ISO format date string
//   accessRoles?: Array<{
//     role: string;
//     canView: boolean;
//     canEdit: boolean;
//     canSubmit: boolean;
//   }>;
// }

// // ---------- Projects API ----------
// export const projectsApi = {
//   // Teacher: Get all projects
//   getTeacherProjects: (): Promise<any> =>
//     fetchWithAuth("/api/teacher/projects"),

//   // Student: Get accessible projects
//   getStudentProjects: (): Promise<any> =>
//     fetchWithAuth("/api/student/projects"),

//   // Create project (Teacher)
//   createProject: (projectData: ProjectData): Promise<any> => {
//     console.log("Creating project with data:", projectData);
//     return fetchWithAuth("/api/projects", {
//       method: "POST",
//       body: JSON.stringify(projectData),
//     });
//   },

//   // Get single project details
//   getProject: (projectId: string): Promise<any> =>
//     fetchWithAuth(`/api/projects/${projectId}`),

//   // Upload project file (problem statement/dataset) with debug logs
//   uploadProjectFile: (projectId: string, formData: FormData): Promise<any> => {
//     const token = getToken();
//     if (!token) throw new Error("Authentication required");

//     console.log(`Uploading file to project: ${projectId}`);

//     return fetch(`${API_URL}/api/projects/${projectId}/files`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: formData,
//     }).then(async (response) => {
//       const data = await response.json();
//       console.log("File upload response:", data);

//       if (!response.ok) throw new Error(data.message || "File upload failed");
//       return data;
//     });
//   },

//   // Submit solution (Student)
//   submitSolution: (projectId: string, formData: FormData): Promise<any> => {
//     const token = getToken();
//     if (!token) throw new Error("Authentication required");

//     return fetch(`${API_URL}/api/projects/${projectId}/submissions`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: formData,
//     }).then(async (response) => {
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Submission failed");
//       return data;
//     });
//   },

//   // Get submissions for a project (Teacher, Academic Team, etc.)
//   getSubmissions: (projectId: string, phase?: number): Promise<any[]> => {
//     const query = phase ? `?phase=${phase}` : "";
//     return fetchWithAuth(`/api/projects/${projectId}/submissions${query}`);
//   },

//   // Get complete submissions (across phases)
//   getCompleteSubmissions: (projectId: string): Promise<any[]> =>
//     fetchWithAuth(`/api/projects/${projectId}/complete-submissions`),

//   // ---------- Reviews ----------

//   // Get all reviews for a submission
//   getReviews: (submissionId: string): Promise<any[]> =>
//     fetchWithAuth(`/api/reviews/${submissionId}`),

//   // Submit a new review
//   submitReview: (
//     submissionId: string,
//     reviewData: { phase: number; marks: number; comments: string }
//   ): Promise<any> =>
//     fetchWithAuth(`/api/reviews/${submissionId}`, {
//       method: "POST",
//       body: JSON.stringify(reviewData),
//     }),

//   // Update a review
//   updateReview: (
//     reviewId: string,
//     updatedReview: { marks?: number; comments?: string }
//   ): Promise<any> =>
//     fetchWithAuth(`/api/reviews/${reviewId}`, {
//       method: "PUT",
//       body: JSON.stringify(updatedReview),
//     }),

//   // Delete a review
//   deleteReview: (reviewId: string): Promise<any> =>
//     fetchWithAuth(`/api/reviews/${reviewId}`, {
//       method: "DELETE",
//     }),
// };

// // ---------- Auth API ----------
// export const authApi = {
//   // Login
//   login: (username: string, password: string): Promise<any> =>
//     fetch(`${API_URL}/api/login`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ username, password }),
//     }).then(async (response) => {
//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.message || "Login failed");
//       }
//       return data;
//     }),

//   // Register
//   register: (userData: UserData): Promise<any> =>
//     fetch(`${API_URL}/api/register`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(userData),
//     }).then(async (response) => {
//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.message || "Registration failed");
//       }
//       return data;
//     }),
// };

// "use client";

// // Environment variable for API URL
// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// // Get token from localStorage (only works client-side)
// const getToken = (): string | null => {
//   if (typeof window !== "undefined") {
//     return localStorage.getItem("token");
//   }
//   return null;
// };

// // Helper function for API requests with improved error handling and debugging
// async function fetchWithAuth<T>(
//   endpoint: string,
//   options: RequestInit = {}
// ): Promise<T> {
//   const token = getToken();

//   const headers = {
//     "Content-Type": "application/json",
//     ...(token && { Authorization: `Bearer ${token}` }),
//     ...(options.headers || {}),
//   };

//   try {
//     console.log(`Making request to: ${API_URL}${endpoint}`);

//     // Log the actual payload being sent
//     if (options.body) {
//       const bodyContent =
//         typeof options.body === "string"
//           ? JSON.parse(options.body)
//           : options.body;
//       console.log("Request payload:", bodyContent);
//     }

//     const response = await fetch(`${API_URL}${endpoint}`, {
//       ...options,
//       headers,
//     });

//     // Log response status
//     console.log(`Response status: ${response.status}`);

//     // Try to get the response as JSON
//     let data;
//     const contentType = response.headers.get("content-type");
//     if (contentType && contentType.includes("application/json")) {
//       data = await response.json();
//       console.log("Response data:", data);
//     } else {
//       const text = await response.text();
//       console.log("Response (not JSON):", text);
//       // Try to parse as JSON anyway in case content-type is wrong
//       try {
//         data = JSON.parse(text);
//       } catch (e) {
//         data = { message: text };
//       }
//     }

//     if (!response.ok) {
//       // Extract detailed error message if available
//       const errorMessage =
//         data?.message ||
//         data?.error ||
//         `Error ${response.status} from ${endpoint}`;

//       throw new Error(errorMessage);
//     }

//     return data as T;
//   } catch (error) {
//     console.error("Fetch error:", error);
//     if (error instanceof Error) {
//       throw error;
//     }
//     throw new Error("Network or server error. Please try again later.");
//   }
// }

// // Types (keep existing types)
// interface Project {
//   id: string;
//   title: string;
//   description: string;
// }

// interface UserData {
//   username: string;
//   password: string;
//   email: string;
//   role: string;
// }

// interface ProjectData {
//   title: string;
//   description: string;
//   firstDeadline: string; // ISO format date string
//   finalDeadline: string; // ISO format date string
//   accessRoles?: Array<{
//     role: string;
//     canView: boolean;
//     canEdit: boolean;
//     canSubmit: boolean;
//   }>;
// }

// // ---------- Projects API ----------
// export const projectsApi = {
//   // Teacher: Get all projects
//   getTeacherProjects: (): Promise<any> =>
//     fetchWithAuth("/api/teacher/projects"),

//   // Student: Get accessible projects
//   getStudentProjects: (): Promise<any> =>
//     fetchWithAuth("/api/student/projects"),

//   // Create project (Teacher)
//   createProject: (projectData: ProjectData): Promise<any> => {
//     console.log("Creating project with data:", projectData);

//     // Validate date fields before sending
//     try {
//       // Make sure the date strings can be parsed
//       const firstDate = new Date(projectData.firstDeadline);
//       const finalDate = new Date(projectData.finalDeadline);

//       if (isNaN(firstDate.getTime()) || isNaN(finalDate.getTime())) {
//         throw new Error("Invalid date format in project data");
//       }

//       // Continue with the API call
//       return fetchWithAuth("/api/projects", {
//         method: "POST",
//         body: JSON.stringify(projectData),
//       });
//     } catch (err) {
//       console.error("Date validation error:", err);
//       return Promise.reject(err);
//     }
//   },

//   // Get single project details
//   getProject: (projectId: string): Promise<any> =>
//     fetchWithAuth(`/api/projects/${projectId}`),

//   // Upload project file (problem statement/dataset) with debug logs
//   uploadProjectFile: (projectId: string, formData: FormData): Promise<any> => {
//     const token = getToken();
//     if (!token) throw new Error("Authentication required");

//     console.log(`Uploading file to project: ${projectId}`);

//     // Log file content for debugging
//     const file = formData.get("file") as File;
//     if (file) {
//       console.log("File details:", {
//         name: file.name,
//         type: file.type,
//         size: `${(file.size / 1024).toFixed(2)} KB`,
//       });
//     }

//     return fetch(`${API_URL}/api/projects/${projectId}/files`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: formData,
//     }).then(async (response) => {
//       // Handle both JSON and non-JSON responses
//       const contentType = response.headers.get("content-type");
//       let data;

//       if (contentType && contentType.includes("application/json")) {
//         data = await response.json();
//       } else {
//         const text = await response.text();
//         try {
//           data = JSON.parse(text);
//         } catch (e) {
//           data = { message: text || "Unknown error" };
//         }
//       }

//       console.log("File upload response:", data);

//       if (!response.ok) {
//         throw new Error(data.message || "File upload failed");
//       }
//       return data;
//     });
//   },

//   // Submit solution (Student)
//   submitSolution: (projectId: string, formData: FormData): Promise<any> => {
//     const token = getToken();
//     if (!token) throw new Error("Authentication required");

//     return fetch(`${API_URL}/api/projects/${projectId}/submissions`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: formData,
//     }).then(async (response) => {
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Submission failed");
//       return data;
//     });
//   },

//   // Get submissions for a project (Teacher, Academic Team, etc.)
//   getSubmissions: (projectId: string, phase?: number): Promise<any[]> => {
//     const query = phase ? `?phase=${phase}` : "";
//     return fetchWithAuth(`/api/projects/${projectId}/submissions${query}`);
//   },

//   // Get complete submissions (across phases)
//   getCompleteSubmissions: (projectId: string): Promise<any[]> =>
//     fetchWithAuth(`/api/projects/${projectId}/complete-submissions`),

//   // ---------- Reviews ----------

//   // Get all reviews for a submission
//   getReviews: (submissionId: string): Promise<any[]> =>
//     fetchWithAuth(`/api/reviews/${submissionId}`),

//   // Submit a new review
//   submitReview: (
//     submissionId: string,
//     reviewData: { phase: number; marks: number; comments: string }
//   ): Promise<any> =>
//     fetchWithAuth(`/api/reviews/${submissionId}`, {
//       method: "POST",
//       body: JSON.stringify(reviewData),
//     }),

//   // Update a review
//   updateReview: (
//     reviewId: string,
//     updatedReview: { marks?: number; comments?: string }
//   ): Promise<any> =>
//     fetchWithAuth(`/api/reviews/${reviewId}`, {
//       method: "PUT",
//       body: JSON.stringify(updatedReview),
//     }),

//   // Delete a review
//   deleteReview: (reviewId: string): Promise<any> =>
//     fetchWithAuth(`/api/reviews/${reviewId}`, {
//       method: "DELETE",
//     }),
// };

// // ---------- Auth API ----------
// export const authApi = {
//   // Login
//   login: (username: string, password: string): Promise<any> =>
//     fetch(`${API_URL}/api/login`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ username, password }),
//     }).then(async (response) => {
//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.message || "Login failed");
//       }
//       return data;
//     }),

//   // Register
//   register: (userData: UserData): Promise<any> =>
//     fetch(`${API_URL}/api/register`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(userData),
//     }).then(async (response) => {
//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.message || "Registration failed");
//       }
//       return data;
//     }),
// };

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
      // Extract detailed error message if available
      const errorMessage =
        data?.message ||
        data?.error ||
        `Error ${response.status} from ${endpoint}`;

      throw new Error(errorMessage);
    }

    return data as T;
  } catch (error) {
    console.error("Fetch error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network or server error. Please try again later.");
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
  firstDeadline: string; // ISO format date string
  finalDeadline: string; // ISO format date string
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
  phase: number;
  status: string;
  size: string;
}

// ---------- Projects API ----------
export const projectsApi = {
  // Teacher: Get all projects
  getTeacherProjects: (): Promise<any> =>
    fetchWithAuth("/api/teacher/projects"),

  getAllProjects: (): Promise<any> => fetchWithAuth("/api/all/projects"),

  // Student: Get accessible projects
  getStudentProjects: (): Promise<any> =>
    fetchWithAuth("/api/student/projects"),

  // Create project (Teacher)
  createProject: (projectData: ProjectData): Promise<any> => {
    console.log("Creating project with data:", projectData);

    // Validate date fields before sending
    try {
      // Make sure the date strings can be parsed
      const firstDate = new Date(projectData.firstDeadline);
      const finalDate = new Date(projectData.finalDeadline);

      if (isNaN(firstDate.getTime()) || isNaN(finalDate.getTime())) {
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

  // Get single project details
  getProject: (projectId: string): Promise<any> =>
    fetchWithAuth(`/api/projects/${projectId}`),

  getProjectOthers: (projectId: string): Promise<any> =>
    fetchWithAuth(`/api/projects/${projectId}/others`),

  // Upload project file (problem statement/dataset) with debug logs
  uploadProjectFile: (projectId: string, formData: FormData): Promise<any> => {
    const token = getToken();
    if (!token) throw new Error("Authentication required");

    console.log(`Uploading file to project: ${projectId}`);

    // Log file content for debugging
    const file = formData.get("file") as File;
    if (file) {
      console.log("File details:", {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(2)} KB`,
      });
    }

    return fetch(`${API_URL}/api/projects/${projectId}/files`, {
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

      console.log("File upload response:", data);

      if (!response.ok) {
        throw new Error(data.message || "File upload failed");
      }
      return data;
    });
  },

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

  // Legacy method for backward compatibility - delegates to appropriate phase method
  submitSolution: (
    projectId: string,
    formData: FormData,
    phase: "phase1" | "phase2" | number = 1
  ): Promise<any> => {
    // Handle both string and number phase formats
    if (phase === "phase1" || phase === 1) {
      return projectsApi.submitPhase1Solution(projectId, formData);
    } else if (phase === "phase2" || phase === 2) {
      return projectsApi.submitPhase2Solution(projectId, formData);
    } else {
      return Promise.reject(
        new Error(
          `Invalid phase: ${phase}. Must be "phase1", "phase2", 1, or 2.`
        )
      );
    }
  },

  // Get submissions for a project (Teacher, Academic Team, etc.)
  getSubmissions: (projectId: string, phase?: number): Promise<any[]> => {
    const query = phase ? `?phase=${phase}` : "";
    return fetchWithAuth(`/api/projects/${projectId}/submissions${query}`);
  },

  // Get complete submissions (across phases)
  getCompleteSubmissions: (projectId: string): Promise<any[]> =>
    fetchWithAuth(`/api/projects/${projectId}/complete-submissions`),

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
    updatedReview: { marks?: number; comments?: string }
  ): Promise<any> =>
    fetchWithAuth(`/api/reviews/${reviewId}`, {
      method: "PUT",
      body: JSON.stringify(updatedReview),
    }),

  // Delete a review
  deleteReview: (reviewId: string): Promise<any> =>
    fetchWithAuth(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    }),
};

// ---------- Auth API ----------
export const authApi = {
  // Login
  login: (username: string, password: string): Promise<any> =>
    fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
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
};
