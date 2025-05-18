// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useAuth } from '@/app/context/AuthContext';
// import { projectsApi } from '../api/api';
// import { useRouter, useSearchParams } from 'next/navigation';
// import Link from 'next/link';

// interface Review {
//     id: string;
//     reviewer_id: string;
//     reviewer_name: string;
//     reviewer_role: string;
//     rating: number;
//     comments: string;
//     created_at: string;
// }

// interface Submission {
//     id: string;
//     student_id: string;
//     username: string;
//     email: string;
//     phase1_submission_id: string;
//     phase1_file_url: string;
//     phase1_submitted_at: string;
//     phase2_submission_id: string;
//     phase2_file_url: string;
//     phase2_submitted_at: string;
//     status: string;
//     review_count: number;
//     has_reviews: boolean;
// }


// const ReviewDashboard = () => {
//     const { user } = useAuth();
//     const router = useRouter();
//     const searchParams = useSearchParams();

//     // Get projectId from URL
//     const projectId = searchParams.get('projectId');

//     const [submissions, setSubmissions] = useState<Submission[]>([]);
//     const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
//     const [reviews, setReviews] = useState<Review[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     // Form state for new reviews
//     const [rating, setRating] = useState<number>(7);
//     const [comments, setComments] = useState<string>('');
//     const [reviewSubmitting, setReviewSubmitting] = useState(false);
//     const [reviewError, setReviewError] = useState<string | null>(null);

//     // For editing reviews
//     const [editingReview, setEditingReview] = useState<string | null>(null);
//     const [editRating, setEditRating] = useState<number>(7);
//     const [editComments, setEditComments] = useState<string>('');

//     const canReview = user && ['teacher', 'evaluator', 'admin', 'coordinator', 'manager', 'academic_team'].includes(user.role);
//     const isStudent = user && user.role === 'student';

//     useEffect(() => {
//         if (!projectId || !user) return;

//         setLoading(true);
//         setError(null);

//         const fetchData = async () => {
//             try {
//                 if (isStudent) {
//                     const studentProjects = await projectsApi.getStudentProjects();
//                     const thisProject = studentProjects.projects.find((p: any) => p.id === projectId);

//                     if (thisProject?.phase2Submission) {
//                         // Convert all IDs to strings to match interface
//                         const submission = {
//                             id: thisProject.phase2Submission.id.toString(),
//                             student_id: user.id.toString(),
//                             username: user.username,
//                             email: user.email,
//                             phase1_submission_id: thisProject.phase1Submission?.id?.toString() || '',
//                             phase1_file_url: thisProject.phase1Submission?.file_url || '',
//                             phase1_submitted_at: thisProject.phase1Submission?.submitted_at || '',
//                             phase2_submission_id: thisProject.phase2Submission.id.toString(),
//                             phase2_file_url: thisProject.phase2Submission.file_url,
//                             phase2_submitted_at: thisProject.phase2Submission.submitted_at,
//                             status: thisProject.phase2Submission.status,
//                             review_count: thisProject.reviews?.length || 0,
//                             has_reviews: !!thisProject.reviews?.length
//                         };

//                         setSubmissions([submission]);
//                         setSelectedSubmission(submission);

//                         // Filter reviews to match current submission
//                         const filteredReviews = thisProject.reviews?.filter((r: any) =>
//                             r.submission_id.toString() === submission.phase2_submission_id
//                         ) || [];
//                         setReviews(filteredReviews);
//                     }
//                 } else {
//                     const response = await projectsApi.getCompleteSubmissions(projectId);
//                     setSubmissions(response.completeSubmissions || []);
//                 }
//             } catch (err) {
//                 setError(err instanceof Error ? err.message : 'Failed to load data');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [projectId, user, isStudent]);

//     // Function to load reviews for a submission
//     const loadReviews = async (submissionId: string) => {
//         try {
//             setLoading(true);
//             const response = await projectsApi.getSubmissionReviews(submissionId);
//             setReviews(response.reviews || []);
//         } catch (err) {
//             console.error('Error loading reviews:', err);
//             setError(err instanceof Error ? err.message : 'Failed to load reviews');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Handle submission selection
//     const handleSelectSubmission = async (submission: Submission) => {
//         setSelectedSubmission(submission);
//         // Only load reviews via API if user is not a student
//         if (!isStudent) {
//             await loadReviews(submission.phase2_submission_id);
//         }
//     };

//     // Handle review submission
//     const handleSubmitReview = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!selectedSubmission) return;

//         setReviewSubmitting(true);
//         setReviewError(null);

//         try {
//             const reviewData = { rating, comments };
//             await projectsApi.submitReview(selectedSubmission.phase2_submission_id, reviewData);

//             // Reload reviews
//             await loadReviews(selectedSubmission.phase2_submission_id);

//             // Reset form
//             setRating(7);
//             setComments('');

//             // Update the submission in our list to reflect the new review
//             setSubmissions(prev =>
//                 prev.map(sub =>
//                     sub.phase2_submission_id === selectedSubmission.phase2_submission_id
//                         ? { ...sub, review_count: sub.review_count + 1, has_reviews: true }
//                         : sub
//                 )
//             );
//         } catch (err) {
//             setReviewError(err instanceof Error ? err.message : 'Failed to submit review');
//             console.error('Error submitting review:', err);
//         } finally {
//             setReviewSubmitting(false);
//         }
//     };

//     // Start editing a review
//     const handleStartEdit = (review: Review) => {
//         setEditingReview(review.id);
//         setEditRating(review.rating);
//         setEditComments(review.comments);
//     };

//     // Cancel editing
//     const handleCancelEdit = () => {
//         setEditingReview(null);
//     };

//     // Save edited review
//     const handleSaveEdit = async (reviewId: string) => {
//         try {
//             setLoading(true);
//             await projectsApi.updateReview(reviewId, {
//                 marks: editRating,
//                 comments: editComments
//             });

//             // Reload reviews
//             if (selectedSubmission) {
//                 await loadReviews(selectedSubmission.phase2_submission_id);
//             }

//             setEditingReview(null);
//         } catch (err) {
//             console.error('Error updating review:', err);
//             setError(err instanceof Error ? err.message : 'Failed to update review');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Delete a review
//     const handleDeleteReview = async (reviewId: string) => {
//         if (!confirm('Are you sure you want to delete this review?')) return;

//         try {
//             setLoading(true);
//             await projectsApi.deleteReview(reviewId);

//             // Reload reviews
//             if (selectedSubmission) {
//                 await loadReviews(selectedSubmission.phase2_submission_id);

//                 // Update the submission in our list to reflect the deleted review
//                 setSubmissions(prev =>
//                     prev.map(sub =>
//                         sub.phase2_submission_id === selectedSubmission.phase2_submission_id
//                             ? {
//                                 ...sub,
//                                 review_count: Math.max(0, sub.review_count - 1),
//                                 has_reviews: sub.review_count - 1 > 0
//                             }
//                             : sub
//                     )
//                 );
//             }
//         } catch (err) {
//             console.error('Error deleting review:', err);
//             setError(err instanceof Error ? err.message : 'Failed to delete review');
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (!projectId) {
//         return (
//             <div className="flex justify-center items-center h-96">
//                 <div className="text-center">
//                     <h1 className="text-2xl mb-4">No Project Selected</h1>
//                     <Link href="/dashboard" className="text-blue-500 hover:text-blue-700">
//                         Return to Dashboard
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     if (loading && !selectedSubmission) {
//         return (
//             <div className="flex justify-center items-center h-96">
//                 <div className="text-center">
//                     <h1 className="text-2xl mb-4">Loading...</h1>
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <div className="flex justify-between items-center mb-6">
//                 <h1 className="text-3xl font-bold">Project Reviews</h1>
//                 <Link href={`/projects/${projectId}`} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
//                     Back to Project
//                 </Link>
//             </div>

//             {error && (
//                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//                     {error}
//                 </div>
//             )}

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {/* Left column: Submissions list */}
//                 <div className="md:col-span-1 bg-white rounded-lg shadow p-4">
//                     <h2 className="text-xl font-semibold mb-4">Submissions</h2>

//                     {submissions.length === 0 ? (
//                         <p className="text-gray-500">No submissions available for review.</p>
//                     ) : (
//                         <ul className="space-y-2">
//                             {submissions.map((submission) => (
//                                 <li
//                                     key={submission.phase2_submission_id}
//                                     className={`p-3 rounded-md cursor-pointer border ${selectedSubmission?.phase2_submission_id === submission.phase2_submission_id
//                                         ? 'bg-blue-100 border-blue-300'
//                                         : 'hover:bg-gray-100 border-gray-200'
//                                         }`}
//                                     onClick={() => handleSelectSubmission(submission)}
//                                 >
//                                     <div className="font-medium">{submission.username}</div>
//                                     <div className="text-sm text-gray-500">{submission.email}</div>
//                                     <div className="flex justify-between items-center mt-2">
//                                         <span className={`px-2 py-1 text-xs rounded ${submission.has_reviews ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                                             }`}>
//                                             {submission.has_reviews ? `${submission.review_count} Review(s)` : 'Not Reviewed'}
//                                         </span>
//                                         <span className="text-xs text-gray-500">
//                                             {new Date(submission.phase2_submitted_at).toLocaleDateString()}
//                                         </span>
//                                     </div>
//                                 </li>
//                             ))}
//                         </ul>
//                     )}
//                 </div>

//                 {/* Right column: Selected submission details and reviews */}
//                 <div className="md:col-span-2 bg-white rounded-lg shadow">
//                     {selectedSubmission ? (
//                         <div className="p-6">
//                             <div className="mb-6">
//                                 <h2 className="text-2xl font-semibold">{selectedSubmission.username}'s Submission</h2>
//                                 <p className="text-gray-600">{selectedSubmission.email}</p>

//                                 <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     <div className="border rounded-md p-3">
//                                         <h3 className="font-medium">Phase 1 Submission</h3>
//                                         <p className="text-sm text-gray-500">
//                                             {selectedSubmission.phase1_submitted_at ? (
//                                                 new Date(selectedSubmission.phase1_submitted_at).toLocaleString()
//                                             ) : (
//                                                 'Not submitted'
//                                             )}
//                                         </p>
//                                         {selectedSubmission.phase1_file_url && (
//                                             <a
//                                                 href={selectedSubmission.phase1_file_url}
//                                                 target="_blank"
//                                                 rel="noopener noreferrer"
//                                                 className="mt-2 inline-block text-blue-500 hover:text-blue-700"
//                                             >
//                                                 View File
//                                             </a>
//                                         )}
//                                     </div>

//                                     <div className="border rounded-md p-3">
//                                         <h3 className="font-medium">Phase 2 Submission</h3>
//                                         <p className="text-sm text-gray-500">
//                                             {new Date(selectedSubmission.phase2_submitted_at).toLocaleString()}
//                                         </p>
//                                         {selectedSubmission.phase2_file_url && (
//                                             <a
//                                                 href={selectedSubmission.phase2_file_url}
//                                                 target="_blank"
//                                                 rel="noopener noreferrer"
//                                                 className="mt-2 inline-block text-blue-500 hover:text-blue-700"
//                                             >
//                                                 View File
//                                             </a>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Reviews section */}
//                             <div className="mb-6">
//                                 <h3 className="text-xl font-semibold mb-4">Reviews ({reviews.length})</h3>

//                                 {reviews.length === 0 ? (
//                                     <p className="text-gray-500">No reviews yet.</p>
//                                 ) : (
//                                     <div className="space-y-4">
//                                         {reviews.map((review) => (
//                                             <div key={review.id} className="border rounded-lg p-4">
//                                                 {editingReview === review.id ? (
//                                                     // Edit mode
//                                                     <div>
//                                                         <div className="mb-4">
//                                                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                                 Rating (1-10)
//                                                             </label>
//                                                             <input
//                                                                 type="number"
//                                                                 min="1"
//                                                                 max="10"
//                                                                 value={editRating}
//                                                                 onChange={(e) => setEditRating(parseInt(e.target.value))}
//                                                                 className="w-full p-2 border rounded"
//                                                             />
//                                                         </div>

//                                                         <div className="mb-4">
//                                                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                                 Comments
//                                                             </label>
//                                                             <textarea
//                                                                 value={editComments}
//                                                                 onChange={(e) => setEditComments(e.target.value)}
//                                                                 className="w-full p-2 border rounded"
//                                                                 rows={4}
//                                                             ></textarea>
//                                                         </div>

//                                                         <div className="flex space-x-2">
//                                                             <button
//                                                                 onClick={() => handleSaveEdit(review.id)}
//                                                                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                                                             >
//                                                                 Save
//                                                             </button>
//                                                             <button
//                                                                 onClick={handleCancelEdit}
//                                                                 className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//                                                             >
//                                                                 Cancel
//                                                             </button>
//                                                         </div>
//                                                     </div>
//                                                 ) : (
//                                                     // View mode
//                                                     <div>
//                                                         <div className="flex justify-between">
//                                                             <div>
//                                                                 <h4 className="font-medium">{review.reviewer_name}</h4>
//                                                                 <p className="text-sm text-gray-500">{review.reviewer_role}</p>
//                                                             </div>
//                                                             <div className="text-right">
//                                                                 <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
//                                                                     Rating: {review.rating}/10
//                                                                 </div>
//                                                                 <p className="text-xs text-gray-500 mt-1">
//                                                                     {new Date(review.created_at).toLocaleString()}
//                                                                 </p>
//                                                             </div>
//                                                         </div>

//                                                         <div className="mt-4">
//                                                             <p className="whitespace-pre-wrap">{review.comments}</p>
//                                                         </div>

//                                                         {/* Only show edit/delete if this is the user's review OR they're an admin */}
//                                                         {(user?.id.toString() === review.reviewer_id || user?.role === 'admin') && (
//                                                             <div className="mt-4 flex space-x-2 justify-end">
//                                                                 <button
//                                                                     onClick={() => handleStartEdit(review)}
//                                                                     className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
//                                                                 >
//                                                                     Edit
//                                                                 </button>
//                                                                 <button
//                                                                     onClick={() => handleDeleteReview(review.id)}
//                                                                     className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
//                                                                 >
//                                                                     Delete
//                                                                 </button>
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Submit new review form - only visible for teachers, evaluators, etc. */}
//                             {canReview && (
//                                 <div className="mt-8 border-t pt-6">
//                                     <h3 className="text-xl font-semibold mb-4">Submit Review</h3>

//                                     {reviewError && (
//                                         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//                                             {reviewError}
//                                         </div>
//                                     )}

//                                     <form onSubmit={handleSubmitReview}>
//                                         <div className="mb-4">
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                 Rating (1-10)
//                                             </label>
//                                             <input
//                                                 type="number"
//                                                 min="1"
//                                                 max="10"
//                                                 value={rating}
//                                                 onChange={(e) => setRating(parseInt(e.target.value))}
//                                                 className="w-full p-2 border rounded"
//                                                 required
//                                             />
//                                         </div>

//                                         <div className="mb-4">
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                 Comments
//                                             </label>
//                                             <textarea
//                                                 value={comments}
//                                                 onChange={(e) => setComments(e.target.value)}
//                                                 className="w-full p-2 border rounded"
//                                                 rows={4}
//                                                 required
//                                             ></textarea>
//                                         </div>

//                                         <button
//                                             type="submit"
//                                             disabled={reviewSubmitting}
//                                             className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
//                                         >
//                                             {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
//                                         </button>
//                                     </form>
//                                 </div>
//                             )}
//                         </div>
//                     ) : (
//                         <div className="flex justify-center items-center h-64">
//                             <p className="text-gray-500">Select a submission to view details</p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ReviewDashboard;

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useAuth } from '@/app/context/AuthContext';
// import { projectsApi } from '../api/api';
// import { useRouter, useSearchParams } from 'next/navigation';
// import Link from 'next/link';

// interface Review {
//     id: string;
//     reviewer_id: string;
//     reviewer_name: string;
//     reviewer_role: string;
//     rating: number;
//     comments: string;
//     created_at: string;
//     submission_id?: string;
//     project_id?: string;
//     student_id?: string;
// }

// interface Submission {
//     id: string;
//     student_id: string;
//     username: string;
//     email: string;
//     phase1_submission_id: string;
//     phase1_file_url: string;
//     phase1_submitted_at: string;
//     phase2_submission_id: string;
//     phase2_file_url: string;
//     phase2_submitted_at: string;
//     status: string;
//     review_count: number;
//     has_reviews: boolean;
// }


// const ReviewDashboard = () => {
//     const { user } = useAuth();
//     const router = useRouter();
//     const searchParams = useSearchParams();

//     // Get projectId from URL
//     const projectId = searchParams.get('projectId');

//     const [submissions, setSubmissions] = useState<Submission[]>([]);
//     const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
//     const [reviews, setReviews] = useState<Review[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     // Form state for new reviews
//     const [rating, setRating] = useState<number>(7);
//     const [comments, setComments] = useState<string>('');
//     const [reviewSubmitting, setReviewSubmitting] = useState(false);
//     const [reviewError, setReviewError] = useState<string | null>(null);

//     // For editing reviews
//     const [editingReview, setEditingReview] = useState<string | null>(null);
//     const [editRating, setEditRating] = useState<number>(7);
//     const [editComments, setEditComments] = useState<string>('');

//     const canReview = user && ['teacher', 'evaluator', 'admin', 'coordinator', 'manager', 'academic_team'].includes(user.role);
//     const isStudent = user && user.role === 'student';

//     useEffect(() => {
//         if (!projectId || !user) return;

//         setLoading(true);
//         setError(null);

//         const fetchData = async () => {
//             try {
//                 if (isStudent) {
//                     const studentProjects = await projectsApi.getStudentProjects();
//                     const thisProject = studentProjects.projects.find((p: any) => p.id.toString() === projectId.toString());

//                     if (thisProject?.phase2Submission) {
//                         // Convert all IDs to strings to match interface
//                         const submission = {
//                             id: thisProject.phase2Submission.id.toString(),
//                             student_id: user.id.toString(),
//                             username: user.username,
//                             email: user.email,
//                             phase1_submission_id: thisProject.phase1Submission?.id?.toString() || '',
//                             phase1_file_url: thisProject.phase1Submission?.file_url || '',
//                             phase1_submitted_at: thisProject.phase1Submission?.submitted_at || '',
//                             phase2_submission_id: thisProject.phase2Submission.id.toString(),
//                             phase2_file_url: thisProject.phase2Submission.file_url,
//                             phase2_submitted_at: thisProject.phase2Submission.submitted_at,
//                             status: thisProject.phase2Submission.status,
//                             review_count: thisProject.reviews?.length || 0,
//                             has_reviews: !!thisProject.reviews?.length
//                         };

//                         setSubmissions([submission]);
//                         setSelectedSubmission(submission);

//                         // For students, populate reviews directly from the project data
//                         const projectReviews = thisProject.reviews || [];
//                         setReviews(projectReviews.map((review: any) => ({
//                             id: review.id.toString(),
//                             reviewer_id: review.reviewer_id.toString(),
//                             reviewer_name: review.reviewer_name,
//                             reviewer_role: review.reviewer_role,
//                             rating: review.rating,
//                             comments: review.comments,
//                             created_at: review.created_at,
//                             submission_id: review.submission_id?.toString(),
//                             project_id: review.project_id?.toString(),
//                             student_id: review.student_id?.toString()
//                         })));
//                     }
//                 } else {
//                     const response = await projectsApi.getCompleteSubmissions(projectId);
//                     setSubmissions(response.completeSubmissions || []);
//                 }
//             } catch (err) {
//                 setError(err instanceof Error ? err.message : 'Failed to load data');
//                 console.error("Error fetching data:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [projectId, user, isStudent]);

//     // Function to load reviews for a submission
//     const loadReviews = async (submissionId: string) => {
//         try {
//             setLoading(true);
//             const response = await projectsApi.getSubmissionReviews(submissionId);
//             setReviews(response.reviews || []);
//         } catch (err) {
//             console.error('Error loading reviews:', err);
//             setError(err instanceof Error ? err.message : 'Failed to load reviews');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Handle submission selection
//     const handleSelectSubmission = async (submission: Submission) => {
//         setSelectedSubmission(submission);
//         // Only load reviews via API if user is not a student
//         if (!isStudent) {
//             await loadReviews(submission.phase2_submission_id);
//         }
//     };

//     // Handle review submission
//     const handleSubmitReview = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!selectedSubmission) return;

//         setReviewSubmitting(true);
//         setReviewError(null);

//         try {
//             const reviewData = { rating, comments };
//             await projectsApi.submitReview(selectedSubmission.phase2_submission_id, reviewData);

//             // Reload reviews
//             await loadReviews(selectedSubmission.phase2_submission_id);

//             // Reset form
//             setRating(7);
//             setComments('');

//             // Update the submission in our list to reflect the new review
//             setSubmissions(prev =>
//                 prev.map(sub =>
//                     sub.phase2_submission_id === selectedSubmission.phase2_submission_id
//                         ? { ...sub, review_count: sub.review_count + 1, has_reviews: true }
//                         : sub
//                 )
//             );
//         } catch (err) {
//             setReviewError(err instanceof Error ? err.message : 'Failed to submit review');
//             console.error('Error submitting review:', err);
//         } finally {
//             setReviewSubmitting(false);
//         }
//     };

//     // Start editing a review
//     const handleStartEdit = (review: Review) => {
//         setEditingReview(review.id);
//         setEditRating(review.rating);
//         setEditComments(review.comments);
//     };

//     // Cancel editing
//     const handleCancelEdit = () => {
//         setEditingReview(null);
//     };

//     // Save edited review
//     const handleSaveEdit = async (reviewId: string) => {
//         try {
//             setLoading(true);
//             await projectsApi.updateReview(reviewId, {
//                 marks: editRating,
//                 comments: editComments
//             });

//             // Reload reviews
//             if (selectedSubmission) {
//                 await loadReviews(selectedSubmission.phase2_submission_id);
//             }

//             setEditingReview(null);
//         } catch (err) {
//             console.error('Error updating review:', err);
//             setError(err instanceof Error ? err.message : 'Failed to update review');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Delete a review
//     const handleDeleteReview = async (reviewId: string) => {
//         if (!confirm('Are you sure you want to delete this review?')) return;

//         try {
//             setLoading(true);
//             await projectsApi.deleteReview(reviewId);

//             // Reload reviews
//             if (selectedSubmission) {
//                 await loadReviews(selectedSubmission.phase2_submission_id);

//                 // Update the submission in our list to reflect the deleted review
//                 setSubmissions(prev =>
//                     prev.map(sub =>
//                         sub.phase2_submission_id === selectedSubmission.phase2_submission_id
//                             ? {
//                                 ...sub,
//                                 review_count: Math.max(0, sub.review_count - 1),
//                                 has_reviews: sub.review_count - 1 > 0
//                             }
//                             : sub
//                     )
//                 );
//             }
//         } catch (err) {
//             console.error('Error deleting review:', err);
//             setError(err instanceof Error ? err.message : 'Failed to delete review');
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (!projectId) {
//         return (
//             <div className="flex justify-center items-center h-96">
//                 <div className="text-center">
//                     <h1 className="text-2xl mb-4">No Project Selected</h1>
//                     <Link href="/dashboard" className="text-blue-500 hover:text-blue-700">
//                         Return to Dashboard
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     if (loading && !selectedSubmission) {
//         return (
//             <div className="flex justify-center items-center h-96">
//                 <div className="text-center">
//                     <h1 className="text-2xl mb-4">Loading...</h1>
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <div className="flex justify-between items-center mb-6">
//                 <h1 className="text-3xl font-bold">Project Reviews</h1>
//                 <Link href={`/projects/${projectId}`} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
//                     Back to Project
//                 </Link>
//             </div>

//             {error && (
//                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//                     {error}
//                 </div>
//             )}

//             <div className={`grid grid-cols-1 ${isStudent ? '' : 'md:grid-cols-3'} gap-6`}>
//                 {/* Left column: Submissions list - only shown to non-students */}
//                 {!isStudent && (
//                     <div className="md:col-span-1 bg-white rounded-lg shadow p-4">
//                         <h2 className="text-xl font-semibold mb-4">Submissions</h2>

//                         {submissions.length === 0 ? (
//                             <p className="text-gray-500">No submissions available for review.</p>
//                         ) : (
//                             <ul className="space-y-2">
//                                 {submissions.map((submission) => (
//                                     <li
//                                         key={submission.phase2_submission_id}
//                                         className={`p-3 rounded-md cursor-pointer border ${selectedSubmission?.phase2_submission_id === submission.phase2_submission_id
//                                             ? 'bg-blue-100 border-blue-300'
//                                             : 'hover:bg-gray-100 border-gray-200'
//                                             }`}
//                                         onClick={() => handleSelectSubmission(submission)}
//                                     >
//                                         <div className="font-medium">{submission.username}</div>
//                                         <div className="text-sm text-gray-500">{submission.email}</div>
//                                         <div className="flex justify-between items-center mt-2">
//                                             <span className={`px-2 py-1 text-xs rounded ${submission.has_reviews ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                                                 }`}>
//                                                 {submission.has_reviews ? `${submission.review_count} Review(s)` : 'Not Reviewed'}
//                                             </span>
//                                             <span className="text-xs text-gray-500">
//                                                 {new Date(submission.phase2_submitted_at).toLocaleDateString()}
//                                             </span>
//                                         </div>
//                                     </li>
//                                 ))}
//                             </ul>
//                         )}
//                     </div>
//                 )}

//                 {/* Right column: Selected submission details and reviews - full width for students */}
//                 <div className={`${isStudent ? 'col-span-1' : 'md:col-span-2'} bg-white rounded-lg shadow`}>
//                     {selectedSubmission ? (
//                         <div className="p-6">
//                             <div className="mb-6">
//                                 {!isStudent && (
//                                     <>
//                                         <h2 className="text-2xl font-semibold">{selectedSubmission.username}'s Submission</h2>
//                                         <p className="text-gray-600">{selectedSubmission.email}</p>
//                                     </>
//                                 )}
//                                 {isStudent && (
//                                     <h2 className="text-2xl font-semibold">Your Submission</h2>
//                                 )}

//                                 <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     <div className="border rounded-md p-3">
//                                         <h3 className="font-medium">Phase 1 Submission</h3>
//                                         <p className="text-sm text-gray-500">
//                                             {selectedSubmission.phase1_submitted_at ? (
//                                                 new Date(selectedSubmission.phase1_submitted_at).toLocaleString()
//                                             ) : (
//                                                 'Not submitted'
//                                             )}
//                                         </p>
//                                         {selectedSubmission.phase1_file_url && (
//                                             <a
//                                                 href={selectedSubmission.phase1_file_url}
//                                                 target="_blank"
//                                                 rel="noopener noreferrer"
//                                                 className="mt-2 inline-block text-blue-500 hover:text-blue-700"
//                                             >
//                                                 View File
//                                             </a>
//                                         )}
//                                     </div>

//                                     <div className="border rounded-md p-3">
//                                         <h3 className="font-medium">Phase 2 Submission</h3>
//                                         <p className="text-sm text-gray-500">
//                                             {new Date(selectedSubmission.phase2_submitted_at).toLocaleString()}
//                                         </p>
//                                         {selectedSubmission.phase2_file_url && (
//                                             <a
//                                                 href={selectedSubmission.phase2_file_url}
//                                                 target="_blank"
//                                                 rel="noopener noreferrer"
//                                                 className="mt-2 inline-block text-blue-500 hover:text-blue-700"
//                                             >
//                                                 View File
//                                             </a>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Reviews section */}
//                             <div className="mb-6">
//                                 <h3 className="text-xl font-semibold mb-4">Reviews ({reviews.length})</h3>

//                                 {reviews.length === 0 ? (
//                                     <p className="text-gray-500">No reviews yet.</p>
//                                 ) : (
//                                     <div className="space-y-4">
//                                         {reviews.map((review) => (
//                                             <div key={review.id} className="border rounded-lg p-4">
//                                                 {editingReview === review.id ? (
//                                                     // Edit mode
//                                                     <div>
//                                                         <div className="mb-4">
//                                                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                                 Rating (1-10)
//                                                             </label>
//                                                             <input
//                                                                 type="number"
//                                                                 min="1"
//                                                                 max="10"
//                                                                 value={editRating}
//                                                                 onChange={(e) => setEditRating(parseInt(e.target.value))}
//                                                                 className="w-full p-2 border rounded"
//                                                             />
//                                                         </div>

//                                                         <div className="mb-4">
//                                                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                                 Comments
//                                                             </label>
//                                                             <textarea
//                                                                 value={editComments}
//                                                                 onChange={(e) => setEditComments(e.target.value)}
//                                                                 className="w-full p-2 border rounded"
//                                                                 rows={4}
//                                                             ></textarea>
//                                                         </div>

//                                                         <div className="flex space-x-2">
//                                                             <button
//                                                                 onClick={() => handleSaveEdit(review.id)}
//                                                                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                                                             >
//                                                                 Save
//                                                             </button>
//                                                             <button
//                                                                 onClick={handleCancelEdit}
//                                                                 className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//                                                             >
//                                                                 Cancel
//                                                             </button>
//                                                         </div>
//                                                     </div>
//                                                 ) : (
//                                                     // View mode
//                                                     <div>
//                                                         <div className="flex justify-between">
//                                                             <div>
//                                                                 <h4 className="font-medium">{review.reviewer_name}</h4>
//                                                                 <p className="text-sm text-gray-500">{review.reviewer_role}</p>
//                                                             </div>
//                                                             <div className="text-right">
//                                                                 <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
//                                                                     Rating: {review.rating}/10
//                                                                 </div>
//                                                                 <p className="text-xs text-gray-500 mt-1">
//                                                                     {new Date(review.created_at).toLocaleString()}
//                                                                 </p>
//                                                             </div>
//                                                         </div>

//                                                         <div className="mt-4">
//                                                             <p className="whitespace-pre-wrap">{review.comments}</p>
//                                                         </div>

//                                                         {/* Only show edit/delete if this is the user's review OR they're an admin */}
//                                                         {(user?.id.toString() === review.reviewer_id || user?.role === 'admin') && (
//                                                             <div className="mt-4 flex space-x-2 justify-end">
//                                                                 <button
//                                                                     onClick={() => handleStartEdit(review)}
//                                                                     className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
//                                                                 >
//                                                                     Edit
//                                                                 </button>
//                                                                 <button
//                                                                     onClick={() => handleDeleteReview(review.id)}
//                                                                     className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
//                                                                 >
//                                                                     Delete
//                                                                 </button>
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Submit new review form - only visible for teachers, evaluators, etc. */}
//                             {canReview && (
//                                 <div className="mt-8 border-t pt-6">
//                                     <h3 className="text-xl font-semibold mb-4">Submit Review</h3>

//                                     {reviewError && (
//                                         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//                                             {reviewError}
//                                         </div>
//                                     )}

//                                     <form onSubmit={handleSubmitReview}>
//                                         <div className="mb-4">
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                 Rating (1-10)
//                                             </label>
//                                             <input
//                                                 type="number"
//                                                 min="1"
//                                                 max="10"
//                                                 value={rating}
//                                                 onChange={(e) => setRating(parseInt(e.target.value))}
//                                                 className="w-full p-2 border rounded"
//                                                 required
//                                             />
//                                         </div>

//                                         <div className="mb-4">
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                                 Comments
//                                             </label>
//                                             <textarea
//                                                 value={comments}
//                                                 onChange={(e) => setComments(e.target.value)}
//                                                 className="w-full p-2 border rounded"
//                                                 rows={4}
//                                                 required
//                                             ></textarea>
//                                         </div>

//                                         <button
//                                             type="submit"
//                                             disabled={reviewSubmitting}
//                                             className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
//                                         >
//                                             {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
//                                         </button>
//                                     </form>
//                                 </div>
//                             )}
//                         </div>
//                     ) : (
//                         <div className="flex justify-center items-center h-64">
//                             <p className="text-gray-500">Select a submission to view details</p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ReviewDashboard;

'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';

// Types
interface Review {
    id: string;
    reviewer_id: string;
    reviewer_name: string;
    reviewer_role: string;
    rating: number;
    comments: string;
    created_at: string;
    submission_id?: string;
    project_id?: string;
    student_id?: string;
}

interface Submission {
    id: string;
    student_id: string;
    username: string;
    email: string;
    phase1_submission_id: string;
    phase1_file_url: string;
    phase1_submitted_at: string;
    phase2_submission_id: string;
    phase2_file_url: string;
    phase2_submitted_at: string;
    status: string;
    review_count: number;
    has_reviews: boolean;
}

// Loading component for Suspense fallback
const ReviewDashboardLoading = () => {
    return (
        <div className="flex justify-center items-center h-96">
            <div className="text-center">
                <h1 className="text-2xl mb-4">Loading...</h1>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
        </div>
    );
};

// The component that uses useSearchParams inside Suspense
const ReviewDashboardContent = () => {
    const React = require('react');
    const { useState, useEffect } = React;
    const { useAuth } = require('@/app/context/AuthContext');
    const { projectsApi } = require('../api/api');
    const { useRouter, useSearchParams } = require('next/navigation');
    const Link = require('next/link').default;

    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get projectId from URL
    const projectId = searchParams.get('projectId');

    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state for new reviews
    const [rating, setRating] = useState<number>(7);
    const [comments, setComments] = useState<string>('');
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewError, setReviewError] = useState<string | null>(null);

    // For editing reviews
    const [editingReview, setEditingReview] = useState<string | null>(null);
    const [editRating, setEditRating] = useState<number>(7);
    const [editComments, setEditComments] = useState<string>('');

    const canReview = user && ['teacher', 'evaluator', 'admin', 'coordinator', 'manager', 'academic_team'].includes(user.role);
    const isStudent = user && user.role === 'student';

    useEffect(() => {
        if (!projectId || !user) return;

        setLoading(true);
        setError(null);

        const fetchData = async () => {
            try {
                if (isStudent) {
                    const studentProjects = await projectsApi.getStudentProjects();
                    const thisProject = studentProjects.projects.find((p: any) => p.id.toString() === projectId.toString());

                    if (thisProject?.phase2Submission) {
                        // Convert all IDs to strings to match interface
                        const submission = {
                            id: thisProject.phase2Submission.id.toString(),
                            student_id: user.id.toString(),
                            username: user.username,
                            email: user.email,
                            phase1_submission_id: thisProject.phase1Submission?.id?.toString() || '',
                            phase1_file_url: thisProject.phase1Submission?.file_url || '',
                            phase1_submitted_at: thisProject.phase1Submission?.submitted_at || '',
                            phase2_submission_id: thisProject.phase2Submission.id.toString(),
                            phase2_file_url: thisProject.phase2Submission.file_url,
                            phase2_submitted_at: thisProject.phase2Submission.submitted_at,
                            status: thisProject.phase2Submission.status,
                            review_count: thisProject.reviews?.length || 0,
                            has_reviews: !!thisProject.reviews?.length
                        };

                        setSubmissions([submission]);
                        setSelectedSubmission(submission);

                        // For students, populate reviews directly from the project data
                        const projectReviews = thisProject.reviews || [];
                        setReviews(projectReviews.map((review: any) => ({
                            id: review.id.toString(),
                            reviewer_id: review.reviewer_id.toString(),
                            reviewer_name: review.reviewer_name,
                            reviewer_role: review.reviewer_role,
                            rating: review.rating,
                            comments: review.comments,
                            created_at: review.created_at,
                            submission_id: review.submission_id?.toString(),
                            project_id: review.project_id?.toString(),
                            student_id: review.student_id?.toString()
                        })));
                    }
                } else {
                    const response = await projectsApi.getCompleteSubmissions(projectId);
                    setSubmissions(response.completeSubmissions || []);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load data');
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [projectId, user, isStudent]);

    // Function to load reviews for a submission
    const loadReviews = async (submissionId: string) => {
        try {
            setLoading(true);
            const response = await projectsApi.getSubmissionReviews(submissionId);
            setReviews(response.reviews || []);
        } catch (err) {
            console.error('Error loading reviews:', err);
            setError(err instanceof Error ? err.message : 'Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    // Handle submission selection
    const handleSelectSubmission = async (submission: Submission) => {
        setSelectedSubmission(submission);
        // Only load reviews via API if user is not a student
        if (!isStudent) {
            await loadReviews(submission.phase2_submission_id);
        }
    };

    // Handle review submission
    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSubmission) return;

        setReviewSubmitting(true);
        setReviewError(null);

        try {
            const reviewData = { rating, comments };
            await projectsApi.submitReview(selectedSubmission.phase2_submission_id, reviewData);

            // Reload reviews
            await loadReviews(selectedSubmission.phase2_submission_id);

            // Reset form
            setRating(7);
            setComments('');

            // Update the submission in our list to reflect the new review
            setSubmissions(prev =>
                prev.map(sub =>
                    sub.phase2_submission_id === selectedSubmission.phase2_submission_id
                        ? { ...sub, review_count: sub.review_count + 1, has_reviews: true }
                        : sub
                )
            );
        } catch (err) {
            setReviewError(err instanceof Error ? err.message : 'Failed to submit review');
            console.error('Error submitting review:', err);
        } finally {
            setReviewSubmitting(false);
        }
    };

    // Start editing a review
    const handleStartEdit = (review: Review) => {
        setEditingReview(review.id);
        setEditRating(review.rating);
        setEditComments(review.comments);
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingReview(null);
    };

    // Save edited review
    const handleSaveEdit = async (reviewId: string) => {
        try {
            setLoading(true);
            await projectsApi.updateReview(reviewId, {
                marks: editRating,
                comments: editComments
            });

            // Reload reviews
            if (selectedSubmission) {
                await loadReviews(selectedSubmission.phase2_submission_id);
            }

            setEditingReview(null);
        } catch (err) {
            console.error('Error updating review:', err);
            setError(err instanceof Error ? err.message : 'Failed to update review');
        } finally {
            setLoading(false);
        }
    };

    // Delete a review
    const handleDeleteReview = async (reviewId: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return;

        try {
            setLoading(true);
            await projectsApi.deleteReview(reviewId);

            // Reload reviews
            if (selectedSubmission) {
                await loadReviews(selectedSubmission.phase2_submission_id);

                // Update the submission in our list to reflect the deleted review
                setSubmissions(prev =>
                    prev.map(sub =>
                        sub.phase2_submission_id === selectedSubmission.phase2_submission_id
                            ? {
                                ...sub,
                                review_count: Math.max(0, sub.review_count - 1),
                                has_reviews: sub.review_count - 1 > 0
                            }
                            : sub
                    )
                );
            }
        } catch (err) {
            console.error('Error deleting review:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete review');
        } finally {
            setLoading(false);
        }
    };

    if (!projectId) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <h1 className="text-2xl mb-4">No Project Selected</h1>
                    <Link href="/dashboard" className="text-blue-500 hover:text-blue-700">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    if (loading && !selectedSubmission) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <h1 className="text-2xl mb-4">Loading...</h1>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Project Reviews</h1>
                <Link href={`/projects/${projectId}`} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                    Back to Project
                </Link>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className={`grid grid-cols-1 ${isStudent ? '' : 'md:grid-cols-3'} gap-6`}>
                {/* Left column: Submissions list - only shown to non-students */}
                {!isStudent && (
                    <div className="md:col-span-1 bg-white rounded-lg shadow p-4">
                        <h2 className="text-xl font-semibold mb-4">Submissions</h2>

                        {submissions.length === 0 ? (
                            <p className="text-gray-500">No submissions available for review.</p>
                        ) : (
                            <ul className="space-y-2">
                                {submissions.map((submission) => (
                                    <li
                                        key={submission.phase2_submission_id}
                                        className={`p-3 rounded-md cursor-pointer border ${selectedSubmission?.phase2_submission_id === submission.phase2_submission_id
                                            ? 'bg-blue-100 border-blue-300'
                                            : 'hover:bg-gray-100 border-gray-200'
                                            }`}
                                        onClick={() => handleSelectSubmission(submission)}
                                    >
                                        <div className="font-medium">{submission.username}</div>
                                        <div className="text-sm text-gray-500">{submission.email}</div>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className={`px-2 py-1 text-xs rounded ${submission.has_reviews ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {submission.has_reviews ? `${submission.review_count} Review(s)` : 'Not Reviewed'}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(submission.phase2_submitted_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {/* Right column: Selected submission details and reviews - full width for students */}
                <div className={`${isStudent ? 'col-span-1' : 'md:col-span-2'} bg-white rounded-lg shadow`}>
                    {selectedSubmission ? (
                        <div className="p-6">
                            <div className="mb-6">
                                {!isStudent && (
                                    <>
                                        <h2 className="text-2xl font-semibold">{selectedSubmission.username}'s Submission</h2>
                                        <p className="text-gray-600">{selectedSubmission.email}</p>
                                    </>
                                )}
                                {isStudent && (
                                    <h2 className="text-2xl font-semibold">Your Submission</h2>
                                )}

                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="border rounded-md p-3">
                                        <h3 className="font-medium">Phase 1 Submission</h3>
                                        <p className="text-sm text-gray-500">
                                            {selectedSubmission.phase1_submitted_at ? (
                                                new Date(selectedSubmission.phase1_submitted_at).toLocaleString()
                                            ) : (
                                                'Not submitted'
                                            )}
                                        </p>
                                        {selectedSubmission.phase1_file_url && (
                                            <a
                                                href={selectedSubmission.phase1_file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-2 inline-block text-blue-500 hover:text-blue-700"
                                            >
                                                View File
                                            </a>
                                        )}
                                    </div>

                                    <div className="border rounded-md p-3">
                                        <h3 className="font-medium">Phase 2 Submission</h3>
                                        <p className="text-sm text-gray-500">
                                            {new Date(selectedSubmission.phase2_submitted_at).toLocaleString()}
                                        </p>
                                        {selectedSubmission.phase2_file_url && (
                                            <a
                                                href={selectedSubmission.phase2_file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-2 inline-block text-blue-500 hover:text-blue-700"
                                            >
                                                View File
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Reviews section */}
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold mb-4">Reviews ({reviews.length})</h3>

                                {reviews.length === 0 ? (
                                    <p className="text-gray-500">No reviews yet.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {reviews.map((review) => (
                                            <div key={review.id} className="border rounded-lg p-4">
                                                {editingReview === review.id ? (
                                                    // Edit mode
                                                    <div>
                                                        <div className="mb-4">
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Rating (1-10)
                                                            </label>
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                max="10"
                                                                value={editRating}
                                                                onChange={(e) => setEditRating(parseInt(e.target.value))}
                                                                className="w-full p-2 border rounded"
                                                            />
                                                        </div>

                                                        <div className="mb-4">
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Comments
                                                            </label>
                                                            <textarea
                                                                value={editComments}
                                                                onChange={(e) => setEditComments(e.target.value)}
                                                                className="w-full p-2 border rounded"
                                                                rows={4}
                                                            ></textarea>
                                                        </div>

                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => handleSaveEdit(review.id)}
                                                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={handleCancelEdit}
                                                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    // View mode
                                                    <div>
                                                        <div className="flex justify-between">
                                                            <div>
                                                                <h4 className="font-medium">{review.reviewer_name}</h4>
                                                                <p className="text-sm text-gray-500">{review.reviewer_role}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                                                                    Rating: {review.rating}/10
                                                                </div>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    {new Date(review.created_at).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="mt-4">
                                                            <p className="whitespace-pre-wrap">{review.comments}</p>
                                                        </div>

                                                        {/* Only show edit/delete if this is the user's review OR they're an admin */}
                                                        {(user?.id.toString() === review.reviewer_id || user?.role === 'admin') && (
                                                            <div className="mt-4 flex space-x-2 justify-end">
                                                                <button
                                                                    onClick={() => handleStartEdit(review)}
                                                                    className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteReview(review.id)}
                                                                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Submit new review form - only visible for teachers, evaluators, etc. */}
                            {canReview && (
                                <div className="mt-8 border-t pt-6">
                                    <h3 className="text-xl font-semibold mb-4">Submit Review</h3>

                                    {reviewError && (
                                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                            {reviewError}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmitReview}>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Rating (1-10)
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="10"
                                                value={rating}
                                                onChange={(e) => setRating(parseInt(e.target.value))}
                                                className="w-full p-2 border rounded"
                                                required
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Comments
                                            </label>
                                            <textarea
                                                value={comments}
                                                onChange={(e) => setComments(e.target.value)}
                                                className="w-full p-2 border rounded"
                                                rows={4}
                                                required
                                            ></textarea>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={reviewSubmitting}
                                            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                                        >
                                            {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex justify-center items-center h-64">
                            <p className="text-gray-500">Select a submission to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Main Review Dashboard Component
const ReviewDashboard = () => {
    return (
        <Suspense fallback={<ReviewDashboardLoading />}>
            <ReviewDashboardContent />
        </Suspense>
    );
};

export default ReviewDashboard;