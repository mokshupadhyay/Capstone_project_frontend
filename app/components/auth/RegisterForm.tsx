// 'use client';

// import { useState } from 'react';
// import { useAuth } from '@/app/context/AuthContext';
// import Link from 'next/link';

// const RegisterForm = () => {
//     const { register, isLoading, error } = useAuth();
//     const [username, setUsername] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [role, setRole] = useState('student');
//     const [formError, setFormError] = useState('');

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setFormError('');

//         if (!username || !email || !password || !confirmPassword) {
//             setFormError('All fields are required');
//             return;
//         }

//         if (password !== confirmPassword) {
//             setFormError('Passwords do not match');
//             return;
//         }

//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) {
//             setFormError('Please enter a valid email address');
//             return;
//         }

//         try {
//             await register(username, password, email, role);
//         } catch (err) {
//             setFormError(err instanceof Error ? err.message : 'An error occurred');
//         }
//     };

//     return (
//         <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg overflow-hidden mt-12">
//             <div className="bg-black text-white py-5 px-8">
//                 <h2 className="text-2xl font-semibold">Sign Up</h2>
//                 <p className="text-sm text-gray-300 mt-1">Register to manage or submit capstone projects</p>
//             </div>

//             <form onSubmit={handleSubmit} className="px-8 py-10">
//                 {(error || formError) && (
//                     <div className="mb-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
//                         {error || formError}
//                     </div>
//                 )}

//                 <div className="mb-5">
//                     <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
//                         Username
//                     </label>
//                     <input
//                         id="username"
//                         type="text"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                         placeholder="Choose a username"
//                         className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
//                     />
//                 </div>

//                 <div className="mb-5">
//                     <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                         Email
//                     </label>
//                     <input
//                         id="email"
//                         type="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         placeholder="Enter your email"
//                         className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
//                     />
//                 </div>

//                 <div className="mb-5">
//                     <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                         Password
//                     </label>
//                     <input
//                         id="password"
//                         type="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         placeholder="Create a password"
//                         className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
//                     />
//                 </div>

//                 <div className="mb-5">
//                     <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                         Confirm Password
//                     </label>
//                     <input
//                         id="confirmPassword"
//                         type="password"
//                         value={confirmPassword}
//                         onChange={(e) => setConfirmPassword(e.target.value)}
//                         placeholder="Confirm your password"
//                         className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
//                     />
//                 </div>

//                 <div className="mb-6">
//                     <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
//                         Role
//                     </label>
//                     <select
//                         id="role"
//                         value={role}
//                         onChange={(e) => setRole(e.target.value)}
//                         className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
//                     >
//                         <option value="student">Student</option>
//                         <option value="teacher">Teacher</option>
//                         <option value="academic_team">Academic Team</option>
//                         <option value="evaluator">Evaluator</option>
//                         <option value="manager">Manager</option>
//                         <option value="coordinator">Coordinator</option>
//                     </select>
//                 </div>

//                 <button
//                     type="submit"
//                     disabled={isLoading}
//                     className="w-full bg-black hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-md transition duration-300"
//                 >
//                     {isLoading ? 'Creating Account...' : 'Register'}
//                 </button>

//                 <p className="text-center text-sm text-gray-600 mt-6">
//                     Already have an account?{' '}
//                     <Link href="/login" className="text-black font-medium hover:underline">
//                         Login here
//                     </Link>
//                 </p>
//             </form>
//         </div>
//     );
// };

// export default RegisterForm;



// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuth } from '@/app/context/AuthContext';
// import Link from 'next/link';

// const RegisterForm = () => {
//     const { register, isLoading, error } = useAuth();

//     // Form fields
//     const [username, setUsername] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [role, setRole] = useState('student');
//     const [formError, setFormError] = useState('');

//     // OTP related states
//     const [otp, setOtp] = useState('');
//     const [userEnteredOtp, setUserEnteredOtp] = useState('');
//     const [otpSent, setOtpSent] = useState(false);
//     const [otpVerified, setOtpVerified] = useState(false);
//     const [otpError, setOtpError] = useState('');
//     const [countdown, setCountdown] = useState(0);
//     const [emailSubmitted, setEmailSubmitted] = useState(false);

//     // Timer for OTP resend cooldown
//     useEffect(() => {
//         if (countdown > 0) {
//             const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//             return () => clearTimeout(timer);
//         }
//     }, [countdown]);

//     // Generate OTP
//     const generateOtp = () => {
//         return Math.floor(100000 + Math.random() * 900000).toString();
//     };

//     // Send OTP to email
//     const handleSendOtp = async (e) => {
//         e.preventDefault();
//         setOtpError('');

//         // Email validation
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) {
//             setOtpError('Please enter a valid email address');
//             return;
//         }

//         // In a real application, you would send an API request to your backend
//         // to send an email with the OTP
//         const generatedOtp = generateOtp();
//         setOtp(generatedOtp);
//         setOtpSent(true);
//         setEmailSubmitted(true);
//         setCountdown(60); // 60 seconds cooldown

//         // For demo purposes, show OTP in console
//         console.log(`OTP for ${email}: ${generatedOtp}`);

//         // Mock API call for sending OTP
//         alert(`For demo purposes: Your OTP is ${generatedOtp}`);
//     };

//     // Verify OTP
//     const handleVerifyOtp = (e) => {
//         e.preventDefault();
//         setOtpError('');

//         if (!userEnteredOtp) {
//             setOtpError('Please enter the OTP');
//             return;
//         }

//         if (userEnteredOtp === otp) {
//             setOtpVerified(true);
//             setOtpError('');
//         } else {
//             setOtpError('Invalid OTP. Please try again.');
//         }
//     };

//     // Resend OTP
//     const handleResendOtp = () => {
//         if (countdown > 0) return;

//         const generatedOtp = generateOtp();
//         setOtp(generatedOtp);
//         setCountdown(60); // 60 seconds cooldown

//         // For demo purposes, show OTP in console
//         console.log(`OTP for ${email} (resent): ${generatedOtp}`);

//         // Mock API call for sending OTP
//         alert(`For demo purposes: Your new OTP is ${generatedOtp}`);
//     };

//     // Handle registration form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setFormError('');

//         if (!username || !email || !password || !confirmPassword) {
//             setFormError('All fields are required');
//             return;
//         }

//         if (password !== confirmPassword) {
//             setFormError('Passwords do not match');
//             return;
//         }

//         try {
//             await register(username, password, email, role);
//         } catch (err) {
//             setFormError(err instanceof Error ? err.message : 'An error occurred');
//         }
//     };

//     // Edit email button
//     const handleEditEmail = () => {
//         setEmailSubmitted(false);
//         setOtpSent(false);
//         setOtpVerified(false);
//         setOtp('');
//         setUserEnteredOtp('');
//     };

//     return (
//         <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg overflow-hidden mt-12">
//             <div className="bg-black text-white py-5 px-8">
//                 <h2 className="text-2xl font-semibold">Sign Up</h2>
//                 <p className="text-sm text-gray-300 mt-1">Register to manage or submit capstone projects</p>
//             </div>

//             {/* Email and OTP Verification Step */}
//             {!otpVerified && (
//                 <div className="px-8 py-10">
//                     <div className="mb-5">
//                         <h3 className="text-lg font-medium text-gray-800 mb-3">Step 1: Verify Your Email</h3>
//                         <p className="text-sm text-gray-600 mb-4">We'll send a verification code to your email address.</p>
//                     </div>

//                     {otpError && (
//                         <div className="mb-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm">
//                             {otpError}
//                         </div>
//                     )}

//                     <div className="mb-5">
//                         <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                             Email
//                         </label>
//                         <div className="flex gap-2">
//                             <input
//                                 id="email"
//                                 type="email"
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 placeholder="Enter your email"
//                                 disabled={emailSubmitted}
//                                 className={`flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none ${emailSubmitted ? 'bg-gray-100' : ''}`}
//                             />
//                             {emailSubmitted && (
//                                 <button
//                                     onClick={handleEditEmail}
//                                     className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
//                                 >
//                                     Edit
//                                 </button>
//                             )}
//                         </div>
//                     </div>

//                     {!emailSubmitted && (
//                         <button
//                             onClick={handleSendOtp}
//                             disabled={!email || countdown > 0}
//                             className="w-full bg-black hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-400"
//                         >
//                             {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Send OTP'}
//                         </button>
//                     )}

//                     {otpSent && (
//                         <>
//                             <div className="mb-5 mt-6">
//                                 <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Enter Verification Code
//                                 </label>
//                                 <div className="flex gap-2">
//                                     <input
//                                         id="otp"
//                                         type="text"
//                                         value={userEnteredOtp}
//                                         onChange={(e) => setUserEnteredOtp(e.target.value)}
//                                         placeholder="Enter 6-digit OTP"
//                                         maxLength={6}
//                                         className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
//                                     />
//                                 </div>
//                                 <div className="mt-2 text-right">
//                                     <button
//                                         onClick={handleResendOtp}
//                                         disabled={countdown > 0}
//                                         className="text-sm text-gray-600 hover:text-black"
//                                     >
//                                         {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
//                                     </button>
//                                 </div>
//                             </div>

//                             <button
//                                 onClick={handleVerifyOtp}
//                                 disabled={!userEnteredOtp}
//                                 className="w-full bg-black hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-400"
//                             >
//                                 Verify Email
//                             </button>
//                         </>
//                     )}
//                 </div>
//             )}

//             {/* Registration Form Step */}
//             {otpVerified && (
//                 <form onSubmit={handleSubmit} className="px-8 py-10">
//                     <div className="mb-5">
//                         <h3 className="text-lg font-medium text-gray-800 mb-3">Step 2: Complete Your Registration</h3>
//                         <p className="text-sm text-gray-600 mb-4">Email verified successfully. Please complete your registration.</p>
//                     </div>

//                     {(error || formError) && (
//                         <div className="mb-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm">
//                             {error || formError}
//                         </div>
//                     )}

//                     <div className="mb-5">
//                         <label htmlFor="verifiedEmail" className="block text-sm font-medium text-gray-700 mb-1">
//                             Email
//                         </label>
//                         <div className="flex items-center gap-2">
//                             <input
//                                 id="verifiedEmail"
//                                 type="email"
//                                 value={email}
//                                 disabled
//                                 className="w-full px-4 py-2 border rounded-md bg-gray-100"
//                             />
//                             <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                                 </svg>
//                                 Verified
//                             </div>
//                         </div>
//                     </div>

//                     <div className="mb-5">
//                         <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
//                             Username
//                         </label>
//                         <input
//                             id="username"
//                             type="text"
//                             value={username}
//                             onChange={(e) => setUsername(e.target.value)}
//                             placeholder="Choose a username"
//                             className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
//                         />
//                     </div>

//                     <div className="mb-5">
//                         <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                             Password
//                         </label>
//                         <input
//                             id="password"
//                             type="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             placeholder="Create a password"
//                             className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
//                         />
//                     </div>

//                     <div className="mb-5">
//                         <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                             Confirm Password
//                         </label>
//                         <input
//                             id="confirmPassword"
//                             type="password"
//                             value={confirmPassword}
//                             onChange={(e) => setConfirmPassword(e.target.value)}
//                             placeholder="Confirm your password"
//                             className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
//                         />
//                     </div>

//                     <div className="mb-6">
//                         <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
//                             Role
//                         </label>
//                         <select
//                             id="role"
//                             value={role}
//                             onChange={(e) => setRole(e.target.value)}
//                             className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
//                         >
//                             <option value="student">Student</option>
//                             <option value="teacher">Teacher</option>
//                             <option value="academic_team">Academic Team</option>
//                             <option value="evaluator">Evaluator</option>
//                             <option value="manager">Manager</option>
//                             <option value="coordinator">Coordinator</option>
//                         </select>
//                     </div>

//                     <button
//                         type="submit"
//                         disabled={isLoading}
//                         className="w-full bg-black hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-400"
//                     >
//                         {isLoading ? 'Creating Account...' : 'Complete Registration'}
//                     </button>
//                 </form>
//             )}

//             <div className="px-8 pb-8">
//                 <p className="text-center text-sm text-gray-600">
//                     Already have an account?{' '}
//                     <Link href="/login" className="text-black font-medium hover:underline">
//                         Login here
//                     </Link>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default RegisterForm;

// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuth } from '@/app/context/AuthContext';
// import Link from 'next/link';
// // Note: You'll need to install EmailJS via:
// // npm install @emailjs/browser
// import emailjs from '@emailjs/browser';

// const RegisterForm = () => {
//     const { register, isLoading, error } = useAuth();

//     // Form fields
//     const [username, setUsername] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [role, setRole] = useState('student');
//     const [formError, setFormError] = useState('');

//     // OTP related states
//     const [otp, setOtp] = useState('');
//     const [userEnteredOtp, setUserEnteredOtp] = useState('');
//     const [otpSent, setOtpSent] = useState(false);
//     const [otpVerified, setOtpVerified] = useState(false);
//     const [otpError, setOtpError] = useState('');
//     const [countdown, setCountdown] = useState(0);
//     const [emailSubmitted, setEmailSubmitted] = useState(false);

//     // Timer for OTP resend cooldown
//     useEffect(() => {
//         if (countdown > 0) {
//             const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//             return () => clearTimeout(timer);
//         }
//     }, [countdown]);

//     // Generate OTP
//     const generateOtp = () => {
//         return Math.floor(100000 + Math.random() * 900000).toString();
//     };

//     useEffect(() => {
//         // This is your PUBLIC KEY from Account > API Keys
//         emailjs.init("3xgvLzd-Dckj6IpLD");

//     }, []);

//     // Send OTP to email
//     const handleSendOtp = async (e) => {
//         e.preventDefault();
//         setOtpError('');

//         // Email validation
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) {
//             setOtpError('Please enter a valid email address');
//             return;
//         }

//         // In a real application, you would send an API request to your backend
//         // to send an email with the OTP
//         const generatedOtp = generateOtp();
//         setOtp(generatedOtp);
//         setOtpSent(true);
//         setEmailSubmitted(true);
//         setCountdown(60); // 60 seconds cooldown

//         // For demo purposes, show OTP in console
//         console.log(`OTP for ${email}: ${generatedOtp}`);

//         // Mock API call for sending OTP
//         alert(`For demo purposes: Your OTP is ${generatedOtp}`);
//     };

//     // Verify OTP
//     const handleVerifyOtp = (e) => {
//         e.preventDefault();
//         setOtpError('');

//         if (!userEnteredOtp) {
//             setOtpError('Please enter the OTP');
//             return;
//         }

//         if (userEnteredOtp === otp) {
//             setOtpVerified(true);
//             setOtpError('');
//         } else {
//             setOtpError('Invalid OTP. Please try again.');
//         }
//     };

//     // Resend OTP
//     const handleResendOtp = async () => {
//         if (countdown > 0) return;

//         const generatedOtp = generateOtp();
//         setOtp(generatedOtp);

//         // In a real application, you would send an API request to your backend
//         // to send an email with the OTP
//         const templateParams = {
//             otp: generatedOtp,
//             email: email,
//         };
//         await emailjs.send(
//             'service_e9n1859',  // Service ID from Email Services
//             '__ejs-test-mail-service__', // Template ID from Email Templates
//             templateParams
//         );
//         setCountdown(60); // 60 seconds cooldown

//         // // For demo purposes, show OTP in console
//         // console.log(`OTP for ${email} (resent): ${generatedOtp}`);

//         // // Mock API call for sending OTP
//         // alert(`For demo purposes: Your new OTP is ${generatedOtp}`);
//     };

//     // Handle registration form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setFormError('');

//         if (!username || !email || !password || !confirmPassword) {
//             setFormError('All fields are required');
//             return;
//         }

//         if (password !== confirmPassword) {
//             setFormError('Passwords do not match');
//             return;
//         }

//         try {
//             await register(username, password, email, role);
//         } catch (err) {
//             setFormError(err instanceof Error ? err.message : 'An error occurred');
//         }
//     };

//     // Edit email button
//     const handleEditEmail = () => {
//         setEmailSubmitted(false);
//         setOtpSent(false);
//         setOtpVerified(false);
//         setOtp('');
//         setUserEnteredOtp('');
//     };

//     return (
//         <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg overflow-hidden mt-12">
//             <div className="bg-black text-white py-5 px-8">
//                 <h2 className="text-2xl font-semibold">Sign Up</h2>
//                 <p className="text-sm text-gray-300 mt-1">Register to manage or submit capstone projects</p>
//             </div>

//             {/* Email and OTP Verification Step */}
//             {!otpVerified && (
//                 <div className="px-8 py-10">
//                     <div className="mb-5">
//                         <h3 className="text-lg font-medium text-gray-800 mb-3">Step 1: Verify Your Email</h3>
//                         <p className="text-sm text-gray-600 mb-4">We'll send a verification code to your email address.</p>
//                     </div>

//                     {otpError && (
//                         <div className="mb-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm">
//                             {otpError}
//                         </div>
//                     )}

//                     <div className="mb-5">
//                         <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                             Email
//                         </label>
//                         <div className="flex gap-2">
//                             <input
//                                 id="email"
//                                 type="email"
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 placeholder="Enter your email"
//                                 disabled={emailSubmitted}
//                                 className={`flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none ${emailSubmitted ? 'bg-gray-100' : ''}`}
//                             />
//                             {emailSubmitted && (
//                                 <button
//                                     onClick={handleEditEmail}
//                                     className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
//                                 >
//                                     Edit
//                                 </button>
//                             )}
//                         </div>
//                     </div>

//                     {!emailSubmitted && (
//                         <button
//                             onClick={handleSendOtp}
//                             disabled={!email || countdown > 0}
//                             className="w-full bg-black hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-400"
//                         >
//                             {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Send OTP'}
//                         </button>
//                     )}

//                     {otpSent && (
//                         <>
//                             <div className="mb-5 mt-6">
//                                 <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Enter Verification Code
//                                 </label>
//                                 <div className="flex gap-2">
//                                     <input
//                                         id="otp"
//                                         type="text"
//                                         value={userEnteredOtp}
//                                         onChange={(e) => setUserEnteredOtp(e.target.value)}
//                                         placeholder="Enter 6-digit OTP"
//                                         maxLength={6}
//                                         className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
//                                     />
//                                 </div>
//                                 <div className="mt-2 text-right">
//                                     <button
//                                         onClick={handleResendOtp}
//                                         disabled={countdown > 0}
//                                         className="text-sm text-gray-600 hover:text-black"
//                                     >
//                                         {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
//                                     </button>
//                                 </div>
//                             </div>

//                             <button
//                                 onClick={handleVerifyOtp}
//                                 disabled={!userEnteredOtp}
//                                 className="w-full bg-black hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-400"
//                             >
//                                 Verify Email
//                             </button>
//                         </>
//                     )}
//                 </div>
//             )}

//             {/* Registration Form Step */}
//             {otpVerified && (
//                 <form onSubmit={handleSubmit} className="px-8 py-10">
//                     <div className="mb-5">
//                         <h3 className="text-lg font-medium text-gray-800 mb-3">Step 2: Complete Your Registration</h3>
//                         <p className="text-sm text-gray-600 mb-4">Email verified successfully. Please complete your registration.</p>
//                     </div>

//                     {(error || formError) && (
//                         <div className="mb-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm">
//                             {error || formError}
//                         </div>
//                     )}

//                     <div className="mb-5">
//                         <label htmlFor="verifiedEmail" className="block text-sm font-medium text-gray-700 mb-1">
//                             Email
//                         </label>
//                         <div className="flex items-center gap-2">
//                             <input
//                                 id="verifiedEmail"
//                                 type="email"
//                                 value={email}
//                                 disabled
//                                 className="w-full px-4 py-2 border rounded-md bg-gray-100"
//                             />
//                             <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                                 </svg>
//                                 Verified
//                             </div>
//                         </div>
//                     </div>

//                     <div className="mb-5">
//                         <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
//                             Username
//                         </label>
//                         <input
//                             id="username"
//                             type="text"
//                             value={username}
//                             onChange={(e) => setUsername(e.target.value)}
//                             placeholder="Choose a username"
//                             className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
//                         />
//                     </div>

//                     <div className="mb-5">
//                         <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                             Password
//                         </label>
//                         <input
//                             id="password"
//                             type="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             placeholder="Create a password"
//                             className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
//                         />
//                     </div>

//                     <div className="mb-5">
//                         <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                             Confirm Password
//                         </label>
//                         <input
//                             id="confirmPassword"
//                             type="password"
//                             value={confirmPassword}
//                             onChange={(e) => setConfirmPassword(e.target.value)}
//                             placeholder="Confirm your password"
//                             className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
//                         />
//                     </div>

//                     <div className="mb-6">
//                         <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
//                             Role
//                         </label>
//                         <select
//                             id="role"
//                             value={role}
//                             onChange={(e) => setRole(e.target.value)}
//                             className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
//                         >
//                             <option value="student">Student</option>
//                             <option value="teacher">Teacher</option>
//                             <option value="academic_team">Academic Team</option>
//                             <option value="evaluator">Evaluator</option>
//                             <option value="manager">Manager</option>
//                             <option value="coordinator">Coordinator</option>
//                             <option value="admin">Admin</option>
//                         </select>
//                     </div>

//                     <button
//                         type="submit"
//                         disabled={isLoading}
//                         className="w-full bg-black hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-400"
//                     >
//                         {isLoading ? 'Creating Account...' : 'Complete Registration'}
//                     </button>
//                 </form>
//             )}

//             <div className="px-8 pb-8">
//                 <p className="text-center text-sm text-gray-600">
//                     Already have an account?{' '}
//                     <Link href="/login" className="text-black font-medium hover:underline">
//                         Login here
//                     </Link>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default RegisterForm;



// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuth } from '@/app/context/AuthContext';
// import Link from 'next/link';
// // Note: You'll need to install EmailJS via:
// // npm install @emailjs/browser
// import emailjs from '@emailjs/browser';

// const RegisterForm = () => {
//     const { register, isLoading, error } = useAuth();

//     // Form fields
//     const [username, setUsername] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [role, setRole] = useState('student');
//     const [formError, setFormError] = useState('');

//     // OTP related states
//     const [otp, setOtp] = useState('');
//     const [userEnteredOtp, setUserEnteredOtp] = useState('');
//     const [otpSent, setOtpSent] = useState(false);
//     const [otpVerified, setOtpVerified] = useState(false);
//     const [otpError, setOtpError] = useState('');
//     const [countdown, setCountdown] = useState(0);
//     const [emailSubmitted, setEmailSubmitted] = useState(false);
//     const [sendingEmail, setSendingEmail] = useState(false);

//     // EmailJS configuration
//     const SERVICE_ID = 'service_e9n1859';  // Replace with your Service ID
//     const TEMPLATE_ID = 'template_5w0rjkk';    // Replace with your Template ID
//     const PUBLIC_KEY = '3xgvLzd-Dckj6IpLD'; // Your PUBLIC KEY

//     // Timer for OTP resend cooldown
//     useEffect(() => {
//         if (countdown > 0) {
//             const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//             return () => clearTimeout(timer);
//         }
//     }, [countdown]);

//     // Generate OTP
//     const generateOtp = () => {
//         return Math.floor(100000 + Math.random() * 900000).toString();
//     };

//     useEffect(() => {
//         // Initialize EmailJS with your public key
//         emailjs.init(PUBLIC_KEY);
//     }, []);

//     // Send OTP to email
//     const handleSendOtp = async (e) => {
//         e.preventDefault();
//         setOtpError('');
//         setSendingEmail(true);

//         // Email validation
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) {
//             setOtpError('Please enter a valid email address');
//             setSendingEmail(false);
//             return;
//         }

//         // Generate OTP
//         const generatedOtp = generateOtp();
//         setOtp(generatedOtp);

//         // Prepare email template parameters
//         const templateParams = {
//             to_email: email,
//             otp: generatedOtp,
//             user_email: email,
//             // Add any other parameters your template might need
//         };

//         try {
//             // Send email with OTP
//             await emailjs.send(
//                 SERVICE_ID,
//                 TEMPLATE_ID,
//                 templateParams
//             );

//             setOtpSent(true);
//             setEmailSubmitted(true);
//             setCountdown(60); // 60 seconds cooldown

//             // For development purposes only, log to console
//             if (process.env.NODE_ENV === 'development') {
//                 console.log(`DEV MODE: OTP for ${email}: ${generatedOtp}`);
//             }
//         } catch (error) {
//             console.error('Failed to send OTP email:', error);
//             setOtpError('Failed to send verification code. Please try again later.');
//         } finally {
//             setSendingEmail(false);
//         }
//     };

//     // Verify OTP
//     const handleVerifyOtp = (e) => {
//         e.preventDefault();
//         setOtpError('');

//         if (!userEnteredOtp) {
//             setOtpError('Please enter the OTP');
//             return;
//         }

//         if (userEnteredOtp === otp) {
//             setOtpVerified(true);
//             setOtpError('');
//         } else {
//             setOtpError('Invalid OTP. Please try again.');
//         }
//     };

//     // Resend OTP
//     const handleResendOtp = async () => {
//         if (countdown > 0) return;
//         setSendingEmail(true);

//         // Generate new OTP
//         const generatedOtp = generateOtp();
//         setOtp(generatedOtp);

//         // Prepare email template parameters
//         const templateParams = {
//             to_email: email,
//             otp: generatedOtp,
//             user_email: email,
//             // Add any other parameters your template might need
//         };

//         try {
//             // Send email with OTP
//             await emailjs.send(
//                 SERVICE_ID,
//                 TEMPLATE_ID,
//                 templateParams
//             );

//             setCountdown(60); // 60 seconds cooldown

//             // For development purposes only, log to console
//             if (process.env.NODE_ENV === 'development') {
//                 console.log(`DEV MODE: OTP for ${email} (resent): ${generatedOtp}`);
//             }
//         } catch (error) {
//             console.error('Failed to resend OTP email:', error);
//             setOtpError('Failed to resend verification code. Please try again later.');
//         } finally {
//             setSendingEmail(false);
//         }
//     };

//     // Handle registration form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setFormError('');

//         if (!username || !email || !password || !confirmPassword) {
//             setFormError('All fields are required');
//             return;
//         }

//         if (password !== confirmPassword) {
//             setFormError('Passwords do not match');
//             return;
//         }

//         try {
//             await register(username, password, email, role);
//         } catch (err) {
//             setFormError(err instanceof Error ? err.message : 'An error occurred');
//         }
//     };

//     // Edit email button
//     const handleEditEmail = () => {
//         setEmailSubmitted(false);
//         setOtpSent(false);
//         setOtpVerified(false);
//         setOtp('');
//         setUserEnteredOtp('');
//     };

//     return (
//         <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg overflow-hidden mt-12">
//             <div className="bg-black text-white py-5 px-8">
//                 <h2 className="text-2xl font-semibold">Sign Up</h2>
//                 <p className="text-sm text-gray-300 mt-1">Register to manage or submit capstone projects</p>
//             </div>

//             {/* Email and OTP Verification Step */}
//             {!otpVerified && (
//                 <div className="px-8 py-10">
//                     <div className="mb-5">
//                         <h3 className="text-lg font-medium text-gray-800 mb-3">Step 1: Verify Your Email</h3>
//                         <p className="text-sm text-gray-600 mb-4">We'll send a verification code to your email address.</p>
//                     </div>

//                     {otpError && (
//                         <div className="mb-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm">
//                             {otpError}
//                         </div>
//                     )}

//                     <div className="mb-5">
//                         <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                             Email
//                         </label>
//                         <div className="flex gap-2">
//                             <input
//                                 id="email"
//                                 type="email"
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 placeholder="Enter your email"
//                                 disabled={emailSubmitted}
//                                 className={`flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none ${emailSubmitted ? 'bg-gray-100' : ''}`}
//                             />
//                             {emailSubmitted && (
//                                 <button
//                                     onClick={handleEditEmail}
//                                     className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
//                                 >
//                                     Edit
//                                 </button>
//                             )}
//                         </div>
//                     </div>

//                     {!emailSubmitted && (
//                         <button
//                             onClick={handleSendOtp}
//                             disabled={!email || countdown > 0 || sendingEmail}
//                             className="w-full bg-black hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-400"
//                         >
//                             {sendingEmail ? 'Sending...' :
//                                 countdown > 0 ? `Resend OTP in ${countdown}s` : 'Send OTP'}
//                         </button>
//                     )}

//                     {otpSent && (
//                         <>
//                             <div className="mb-5 mt-6">
//                                 <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Enter Verification Code
//                                 </label>
//                                 <div className="flex gap-2">
//                                     <input
//                                         id="otp"
//                                         type="text"
//                                         value={userEnteredOtp}
//                                         onChange={(e) => setUserEnteredOtp(e.target.value)}
//                                         placeholder="Enter 6-digit OTP"
//                                         maxLength={6}
//                                         className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
//                                     />
//                                 </div>
//                                 <div className="mt-2 text-right">
//                                     <button
//                                         onClick={handleResendOtp}
//                                         disabled={countdown > 0 || sendingEmail}
//                                         className="text-sm text-gray-600 hover:text-black disabled:text-gray-400"
//                                     >
//                                         {sendingEmail ? 'Sending...' :
//                                             countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
//                                     </button>
//                                 </div>
//                             </div>

//                             <button
//                                 onClick={handleVerifyOtp}
//                                 disabled={!userEnteredOtp}
//                                 className="w-full bg-black hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-400"
//                             >
//                                 Verify Email
//                             </button>
//                         </>
//                     )}
//                 </div>
//             )}

//             {/* Registration Form Step */}
//             {otpVerified && (
//                 <form onSubmit={handleSubmit} className="px-8 py-10">
//                     <div className="mb-5">
//                         <h3 className="text-lg font-medium text-gray-800 mb-3">Step 2: Complete Your Registration</h3>
//                         <p className="text-sm text-gray-600 mb-4">Email verified successfully. Please complete your registration.</p>
//                     </div>

//                     {(error || formError) && (
//                         <div className="mb-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm">
//                             {error || formError}
//                         </div>
//                     )}

//                     <div className="mb-5">
//                         <label htmlFor="verifiedEmail" className="block text-sm font-medium text-gray-700 mb-1">
//                             Email
//                         </label>
//                         <div className="flex items-center gap-2">
//                             <input
//                                 id="verifiedEmail"
//                                 type="email"
//                                 value={email}
//                                 disabled
//                                 className="w-full px-4 py-2 border rounded-md bg-gray-100"
//                             />
//                             <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                                 </svg>
//                                 Verified
//                             </div>
//                         </div>
//                     </div>

//                     <div className="mb-5">
//                         <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
//                             Username
//                         </label>
//                         <input
//                             id="username"
//                             type="text"
//                             value={username}
//                             onChange={(e) => setUsername(e.target.value)}
//                             placeholder="Choose a username"
//                             className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
//                         />
//                     </div>

//                     <div className="mb-5">
//                         <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                             Password
//                         </label>
//                         <input
//                             id="password"
//                             type="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             placeholder="Create a password"
//                             className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
//                         />
//                     </div>

//                     <div className="mb-5">
//                         <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                             Confirm Password
//                         </label>
//                         <input
//                             id="confirmPassword"
//                             type="password"
//                             value={confirmPassword}
//                             onChange={(e) => setConfirmPassword(e.target.value)}
//                             placeholder="Confirm your password"
//                             className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
//                         />
//                     </div>

//                     <div className="mb-6">
//                         <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
//                             Role
//                         </label>
//                         <select
//                             id="role"
//                             value={role}
//                             onChange={(e) => setRole(e.target.value)}
//                             className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
//                         >
//                             <option value="student">Student</option>
//                             <option value="teacher">Teacher</option>
//                             <option value="academic_team">Academic Team</option>
//                             <option value="evaluator">Evaluator</option>
//                             <option value="manager">Manager</option>
//                             <option value="coordinator">Coordinator</option>
//                             <option value="admin">Admin</option>
//                         </select>
//                     </div>

//                     <button
//                         type="submit"
//                         disabled={isLoading}
//                         className="w-full bg-black hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-400"
//                     >
//                         {isLoading ? 'Creating Account...' : 'Complete Registration'}
//                     </button>
//                 </form>
//             )}

//             <div className="px-8 pb-8">
//                 <p className="text-center text-sm text-gray-600">
//                     Already have an account?{' '}
//                     <Link href="/login" className="text-black font-medium hover:underline">
//                         Login here
//                     </Link>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default RegisterForm;


// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuth } from '@/app/context/AuthContext';
// import Link from 'next/link';
// // Note: You'll need to install EmailJS via:
// // npm install @emailjs/browser
// import emailjs from '@emailjs/browser';

// const RegisterForm = () => {
//     const { register, isLoading, error } = useAuth();
//     //     // EmailJS configuration
//     const SERVICE_ID = 'service_e9n1859';  // Replace with your Service ID
//     const TEMPLATE_ID = 'template_5w0rjkk';    // Replace with your Template ID
//     const PUBLIC_KEY = '3xgvLzd-Dckj6IpLD'; // Your PUBLIC KEY

//     // Form fields
//     const [username, setUsername] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [role, setRole] = useState('student');
//     const [formError, setFormError] = useState('');

//     // OTP related states
//     const [otp, setOtp] = useState('');
//     const [userEnteredOtp, setUserEnteredOtp] = useState('');
//     const [otpSent, setOtpSent] = useState(false);
//     const [otpVerified, setOtpVerified] = useState(false);
//     const [otpError, setOtpError] = useState('');
//     const [countdown, setCountdown] = useState(0);
//     const [emailSubmitted, setEmailSubmitted] = useState(false);

//     // Timer for OTP resend cooldown
//     useEffect(() => {
//         if (countdown > 0) {
//             const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//             return () => clearTimeout(timer);
//         }
//     }, [countdown]);

//     // Generate OTP
//     const generateOtp = () => {
//         return Math.floor(100000 + Math.random() * 900000).toString();
//     };

//     // Send OTP to email
//     const handleSendOtp = async (e: { preventDefault: () => void; }) => {
//         e.preventDefault();
//         setOtpError('');

//         // Email validation
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) {
//             setOtpError('Please enter a valid email address');
//             return;
//         }


//         // In a real application, you would send an API request to your backend
//         // to send an email with the OTP
//         const generatedOtp = generateOtp();
//         setOtp(generatedOtp);
//         setOtpSent(true);
//         setEmailSubmitted(true);
//         await emailjs.send(
//             SERVICE_ID,
//             TEMPLATE_ID,
//             {
//                 to_name: name,
//                 otp: generatedOtp,
//                 message: `Your OTP is ${generatedOtp}`,
//             },
//             PUBLIC_KEY,
//             {
//                 to_email: email,
//             }
//         );
//         setCountdown(60); // 60 seconds cooldown

//         // For demo purposes, show OTP in console
//         console.log(`OTP for ${email}: ${generatedOtp}`);

//         // Mock API call for sending OTP
//         alert(`For demo purposes: Your OTP is ${generatedOtp}`);
//     };

//     // Verify OTP
//     const handleVerifyOtp = (e: { preventDefault: () => void; }) => {
//         e.preventDefault();
//         setOtpError('');

//         if (!userEnteredOtp) {
//             setOtpError('Please enter the OTP');
//             return;
//         }

//         if (userEnteredOtp === otp) {
//             setOtpVerified(true);
//             setOtpError('');
//         } else {
//             setOtpError('Invalid OTP. Please try again.');
//         }
//     };

//     // Resend OTP
//     const handleResendOtp = () => {
//         if (countdown > 0) return;

//         const generatedOtp = generateOtp();
//         setOtp(generatedOtp);
//         setCountdown(60); // 60 seconds cooldown

//         // For demo purposes, show OTP in console
//         console.log(`OTP for ${email} (resent): ${generatedOtp}`);

//         // Mock API call for sending OTP
//         alert(`For demo purposes: Your new OTP is ${generatedOtp}`);
//     };

//     // Handle registration form submission
//     const handleSubmit = async (e: { preventDefault: () => void; }) => {
//         e.preventDefault();
//         setFormError('');

//         if (!username || !email || !password || !confirmPassword) {
//             setFormError('All fields are required');
//             return;
//         }

//         if (password !== confirmPassword) {
//             setFormError('Passwords do not match');
//             return;
//         }

//         try {
//             await register(username, password, email, role);
//         } catch (err) {
//             setFormError(err instanceof Error ? err.message : 'An error occurred');
//         }
//     };

//     // Edit email button
//     const handleEditEmail = () => {
//         setEmailSubmitted(false);
//         setOtpSent(false);
//         setOtpVerified(false);
//         setOtp('');
//         setUserEnteredOtp('');
//     };

//     return (
//         <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg overflow-hidden mt-12">
//             <div className="bg-black text-white py-5 px-8">
//                 <h2 className="text-2xl font-semibold">Sign Up</h2>
//                 <p className="text-sm text-gray-300 mt-1">Register to manage or submit capstone projects</p>
//             </div>

//             {/* Email and OTP Verification Step */}
//             {!otpVerified && (
//                 <div className="px-8 py-10">
//                     <div className="mb-5">
//                         <h3 className="text-lg font-medium text-gray-800 mb-3">Step 1: Verify Your Email</h3>
//                         <p className="text-sm text-gray-600 mb-4">We'll send a verification code to your email address.</p>
//                     </div>

//                     {otpError && (
//                         <div className="mb-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm">
//                             {otpError}
//                         </div>
//                     )}

//                     <div className="mb-5">
//                         <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                             Email
//                         </label>
//                         <div className="flex gap-2">
//                             <input
//                                 id="email"
//                                 type="email"
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 placeholder="Enter your email"
//                                 disabled={emailSubmitted}
//                                 className={`flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none ${emailSubmitted ? 'bg-gray-100' : ''}`}
//                             />
//                             {emailSubmitted && (
//                                 <button
//                                     onClick={handleEditEmail}
//                                     className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
//                                 >
//                                     Edit
//                                 </button>
//                             )}
//                         </div>
//                     </div>

//                     {!emailSubmitted && (
//                         <button
//                             onClick={handleSendOtp}
//                             disabled={!email || countdown > 0}
//                             className="w-full bg-black hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-400"
//                         >
//                             {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Send OTP'}
//                         </button>
//                     )}

//                     {otpSent && (
//                         <>
//                             <div className="mb-5 mt-6">
//                                 <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Enter Verification Code
//                                 </label>
//                                 <div className="flex gap-2">
//                                     <input
//                                         id="otp"
//                                         type="text"
//                                         value={userEnteredOtp}
//                                         onChange={(e) => setUserEnteredOtp(e.target.value)}
//                                         placeholder="Enter 6-digit OTP"
//                                         maxLength={6}
//                                         className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
//                                     />
//                                 </div>
//                                 <div className="mt-2 text-right">
//                                     <button
//                                         onClick={handleResendOtp}
//                                         disabled={countdown > 0}
//                                         className="text-sm text-gray-600 hover:text-black"
//                                     >
//                                         {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
//                                     </button>
//                                 </div>
//                             </div>

//                             <button
//                                 onClick={handleVerifyOtp}
//                                 disabled={!userEnteredOtp}
//                                 className="w-full bg-black hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-400"
//                             >
//                                 Verify Email
//                             </button>
//                         </>
//                     )}
//                 </div>
//             )}

//             {/* Registration Form Step */}
//             {otpVerified && (
//                 <form onSubmit={handleSubmit} className="px-8 py-10">
//                     <div className="mb-5">
//                         <h3 className="text-lg font-medium text-gray-800 mb-3">Step 2: Complete Your Registration</h3>
//                         <p className="text-sm text-gray-600 mb-4">Email verified successfully. Please complete your registration.</p>
//                     </div>

//                     {(error || formError) && (
//                         <div className="mb-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm">
//                             {error || formError}
//                         </div>
//                     )}

//                     <div className="mb-5">
//                         <label htmlFor="verifiedEmail" className="block text-sm font-medium text-gray-700 mb-1">
//                             Email
//                         </label>
//                         <div className="flex items-center gap-2">
//                             <input
//                                 id="verifiedEmail"
//                                 type="email"
//                                 value={email}
//                                 disabled
//                                 className="w-full px-4 py-2 border rounded-md bg-gray-100"
//                             />
//                             <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                                 </svg>
//                                 Verified
//                             </div>
//                         </div>
//                     </div>

//                     <div className="mb-5">
//                         <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
//                             Username
//                         </label>
//                         <input
//                             id="username"
//                             type="text"
//                             value={username}
//                             onChange={(e) => setUsername(e.target.value)}
//                             placeholder="Choose a username"
//                             className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
//                         />
//                     </div>

//                     <div className="mb-5">
//                         <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                             Password
//                         </label>
//                         <input
//                             id="password"
//                             type="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             placeholder="Create a password"
//                             className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
//                         />
//                     </div>

//                     <div className="mb-5">
//                         <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                             Confirm Password
//                         </label>
//                         <input
//                             id="confirmPassword"
//                             type="password"
//                             value={confirmPassword}
//                             onChange={(e) => setConfirmPassword(e.target.value)}
//                             placeholder="Confirm your password"
//                             className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
//                         />
//                     </div>

//                     <div className="mb-6">
//                         <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
//                             Role
//                         </label>
//                         <select
//                             id="role"
//                             value={role}
//                             onChange={(e) => setRole(e.target.value)}
//                             className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
//                         >
//                             <option value="student">Student</option>
//                             <option value="teacher">Teacher</option>
//                             <option value="academic_team">Academic Team</option>
//                             <option value="evaluator">Evaluator</option>
//                             <option value="manager">Manager</option>
//                             <option value="coordinator">Coordinator</option>
//                         </select>
//                     </div>

//                     <button
//                         type="submit"
//                         disabled={isLoading}
//                         className="w-full bg-black hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-400"
//                     >
//                         {isLoading ? 'Creating Account...' : 'Complete Registration'}
//                     </button>
//                 </form>
//             )}

//             <div className="px-8 pb-8">
//                 <p className="text-center text-sm text-gray-600">
//                     Already have an account?{' '}
//                     <Link href="/login" className="text-black font-medium hover:underline">
//                         Login here
//                     </Link>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default RegisterForm;


'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import emailjs from '@emailjs/browser';

const RegisterForm = () => {
    const { register, isLoading, error } = useAuth();

    // EmailJS configuration
    const SERVICE_ID = 'service_e9n1859';  // Replace with your Service ID
    const TEMPLATE_ID = 'template_5w0rjkk';    // Replace with your Template ID
    const PUBLIC_KEY = '3xgvLzd-Dckj6IpLD'; // Your PUBLIC KEY

    // Initialize EmailJS when component mounts
    useEffect(() => {
        // emailjs.init(PUBLIC_KEY);
        emailjs.init({
            publicKey: PUBLIC_KEY,
            // Do not allow headless browsers
            blockHeadless: true,
            blockList: {
                // Block the suspended email
                // The variable contains the email address
                watchVariable: 'userEmail',
            },
            limitRate: {
                // Set the limit rate for the application
                id: 'app',
                // Allow 1 request per 10s
                throttle: 10000,
            },
        });
    }, []);

    // Form fields
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('student');
    const [formError, setFormError] = useState('');

    // OTP related states
    const [otp, setOtp] = useState('');
    const [userEnteredOtp, setUserEnteredOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otpError, setOtpError] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [emailSubmitted, setEmailSubmitted] = useState(false);

    // Timer for OTP resend cooldown
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // Generate OTP
    const generateOtp = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    // Send OTP to email
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setOtpError('');

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setOtpError('Please enter a valid email address');
            return;
        }

        try {
            // Generate OTP
            const generatedOtp = generateOtp();
            setOtp(generatedOtp);

            const otpExpiryIST = new Date(Date.now() + 15 * 60 * 1000) // Add 15 minutes
                .toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                });

            // Final templateParams with IST time
            const templateParams = {
                email: email,
                name: username || email.split('@')[0],
                passcode: generatedOtp,
                time: otpExpiryIST,
            };

            // Send email using EmailJS
            emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);


            // Update UI states
            setOtpSent(true);
            setEmailSubmitted(true);
            setCountdown(60); // 60 seconds cooldown

            // For development purposes only - remove in production
            console.log(`OTP for ${email}: ${generatedOtp}`);

        } catch (error) {
            console.error('Error sending OTP:', error);
            setOtpError('Failed to send verification code. Please try again.');
        }
    };

    // Verify OTP
    const handleVerifyOtp = (e) => {
        e.preventDefault();
        setOtpError('');

        if (!userEnteredOtp) {
            setOtpError('Please enter the OTP');
            return;
        }

        if (userEnteredOtp === otp) {
            setOtpVerified(true);
            setOtpError('');
        } else {
            setOtpError('Invalid OTP. Please try again.');
        }
    };

    // Resend OTP
    const handleResendOtp = async () => {
        if (countdown > 0) return;

        try {
            const generatedOtp = generateOtp();
            setOtp(generatedOtp);

            // Prepare email template parameters
            const otpExpiryIST = new Date(Date.now() + 15 * 60 * 1000) // Add 15 minutes
                .toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                });

            // Final templateParams with IST time
            const templateParams = {
                email: email,
                name: username || email.split('@')[0],
                passcode: generatedOtp,
                time: otpExpiryIST,
            };

            // Send email using EmailJS
            emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
            // Update UI states
            setCountdown(60); // 60 seconds cooldown

            // For development purposes only - remove in production
            console.log(`OTP for ${email} (resent): ${generatedOtp}`);

        } catch (error) {
            console.error('Error resending OTP:', error);
            setOtpError('Failed to send verification code. Please try again.');
        }
    };

    // Handle registration form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!username || !email || !password || !confirmPassword) {
            setFormError('All fields are required');
            return;
        }

        if (password !== confirmPassword) {
            setFormError('Passwords do not match');
            return;
        }

        try {
            await register(username, password, email, role);

            // Optional: Send welcome email after successful registration
            const welcomeTemplateParams = {
                to_email: email,
                to_name: username,
                recipient: email,
                subject: 'Welcome to Our Platform',
                message: `Thank you for registering with us, ${username}! Your account has been created successfully.`
            };

            // You can use a different template ID for welcome emails
            await emailjs.send(
                SERVICE_ID,
                TEMPLATE_ID, // Consider using a different template for welcome emails
                welcomeTemplateParams
            );

        } catch (err) {
            setFormError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    // Edit email button
    const handleEditEmail = () => {
        setEmailSubmitted(false);
        setOtpSent(false);
        setOtpVerified(false);
        setOtp('');
        setUserEnteredOtp('');
    };

    return (
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg overflow-hidden mt-12">
            <div className="bg-black text-white py-5 px-8">
                <h2 className="text-2xl font-semibold">Sign Up</h2>
                <p className="text-sm text-gray-300 mt-1">Register to manage or submit capstone projects</p>
            </div>

            {/* Email and OTP Verification Step */}
            {!otpVerified && (
                <div className="px-8 py-10">
                    <div className="mb-5">
                        <h3 className="text-lg font-medium text-gray-800 mb-3">Step 1: Verify Your Email</h3>
                        <p className="text-sm text-gray-600 mb-4">We'll send a verification code to your email address.</p>
                    </div>

                    {otpError && (
                        <div className="mb-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm">
                            {otpError}
                        </div>
                    )}

                    <div className="mb-5">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <div className="flex gap-2">
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                disabled={emailSubmitted}
                                className={`flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none ${emailSubmitted ? 'bg-gray-100' : ''}`}
                            />
                            {emailSubmitted && (
                                <button
                                    onClick={handleEditEmail}
                                    className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                    </div>

                    {!emailSubmitted && (
                        <button
                            onClick={handleSendOtp}
                            disabled={!email || countdown > 0}
                            className="w-full bg-black hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-400"
                        >
                            {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Send OTP'}
                        </button>
                    )}

                    {otpSent && (
                        <>
                            <div className="mb-5 mt-6">
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                                    Enter Verification Code
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        id="otp"
                                        type="text"
                                        value={userEnteredOtp}
                                        onChange={(e) => setUserEnteredOtp(e.target.value)}
                                        placeholder="Enter 6-digit OTP"
                                        maxLength={6}
                                        className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
                                    />
                                </div>
                                <div className="mt-2 text-right">
                                    <button
                                        onClick={handleResendOtp}
                                        disabled={countdown > 0}
                                        className="text-sm text-gray-600 hover:text-black"
                                    >
                                        {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleVerifyOtp}
                                disabled={!userEnteredOtp}
                                className="w-full bg-black hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-400"
                            >
                                Verify Email
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Registration Form Step */}
            {otpVerified && (
                <form onSubmit={handleSubmit} className="px-8 py-10">
                    <div className="mb-5">
                        <h3 className="text-lg font-medium text-gray-800 mb-3">Step 2: Complete Your Registration</h3>
                        <p className="text-sm text-gray-600 mb-4">Email verified successfully. Please complete your registration.</p>
                    </div>

                    {(error || formError) && (
                        <div className="mb-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm">
                            {error || formError}
                        </div>
                    )}

                    <div className="mb-5">
                        <label htmlFor="verifiedEmail" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                id="verifiedEmail"
                                type="email"
                                value={email}
                                disabled
                                className="w-full px-4 py-2 border rounded-md bg-gray-100"
                            />
                            <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Verified
                            </div>
                        </div>
                    </div>

                    <div className="mb-5">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Choose a username"
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
                        />
                    </div>

                    <div className="mb-5">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a password"
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
                        />
                    </div>

                    <div className="mb-5">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                        </label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-black focus:outline-none"
                        >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                            <option value="academic_team">Academic Team</option>
                            <option value="evaluator">Evaluator</option>
                            <option value="manager">Manager</option>
                            <option value="coordinator">Coordinator</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-400"
                    >
                        {isLoading ? 'Creating Account...' : 'Complete Registration'}
                    </button>
                </form>
            )}

            <div className="px-8 pb-8">
                <p className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-black font-medium hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterForm;