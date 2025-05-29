// 'use client';

// import { useRouter } from 'next/navigation';
// import { useAuth } from './context/AuthContext';
// import Image from 'next/image';
// import Link from 'next/link';
// import Review from '../public/review.jpg';
// import Teacher from '../public/teacher.jpg';

// export default function HomePage() {
//   const router = useRouter();
//   const { user } = useAuth();

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//       {/* Hero Section */}
//       <section className="py-12 md:py-20">
//         <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10">
//           {/* Text Content */}
//           <div className="text-center md:text-left max-w-xl w-full">
//             <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 md:mb-6 tracking-tight">
//               Capstone Project Portal
//             </h1>
//             <p className="text-lg text-gray-600 mb-8 md:mb-10 px-4 sm:px-0">
//               Streamline your capstone journey with powerful tools for submission, review, and certification.
//             </p>

//             {user ? (
//               <Link
//                 href="/dashboard"
//                 className="inline-block bg-black hover:bg-gray-800 text-white font-medium py-3 px-8 rounded-md text-lg transition duration-300 shadow-sm"
//               >
//                 Go to Dashboard
//               </Link>
//             ) : (
//               <div className="flex flex-row gap-4 justify-center md:justify-start">
//                 <Link
//                   href="/login"
//                   className="inline-block bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-md text-base sm:text-lg transition duration-300 shadow-sm"
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   href="/register"
//                   className="inline-block border-2 border-black text-black hover:bg-gray-100 font-medium py-3 px-6 rounded-md text-base sm:text-lg transition duration-300"
//                 >
//                   Register
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Teacher Image */}
//           <div className="w-full md:w-1/2 mt-8 md:mt-0">
//             <Image
//               src={Teacher}
//               alt="Teacher working on capstone projects"
//               className="rounded-xl shadow-lg w-full h-auto"
//               placeholder="blur"
//               priority
//             />
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-16 md:py-20 bg-gray-50 rounded-2xl my-8 md:my-12">
//         <div className="text-center mb-10 md:mb-14 px-4">
//           <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Key Features</h2>
//           <p className="text-gray-600 mt-2">Everything you need for seamless capstone management</p>
//         </div>

//         <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 px-4">
//           {[
//             {
//               title: 'Project Management',
//               desc: 'Create, assign and track progress of capstone projects with intuitive dashboard tools',
//               icon: (
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                 </svg>
//               )
//             },
//             {
//               title: 'File Submissions',
//               desc: 'Students submit work with smart PDF compression and built-in certificate generation',
//               icon: (
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
//                 </svg>
//               )
//             },
//             {
//               title: 'Role-Based Access',
//               desc: 'Customizable permissions for teachers, students, and evaluators with secure certification system',
//               icon: (
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                 </svg>
//               )
//             },
//           ].map((feature, i) => (
//             <div key={i} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
//               <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-black mb-5 mx-auto border-2 border-gray-50 shadow-sm">
//                 <div className="text-black">
//                   {feature.icon}
//                 </div>
//               </div>
//               <h3 className="text-xl font-semibold text-center text-gray-900 mb-3">{feature.title}</h3>
//               <p className="text-center text-gray-600">{feature.desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* How It Works Section */}
//       <section className="py-16 md:py-20">
//         <div className="text-center mb-10 md:mb-14 px-4">
//           <h2 className="text-2xl md:text-3xl font-bold text-gray-900">How It Works</h2>
//           <p className="text-gray-600 mt-2">A simple 3-step workflow for everyone</p>
//         </div>

//         <div className="grid md:grid-cols-2 gap-10 items-center">
//           {/* Steps */}
//           <div className="space-y-6 md:space-y-8 px-4 md:px-0">
//             {[
//               {
//                 step: '1',
//                 title: 'Create Projects',
//                 desc: 'Teachers create projects, upload resources, and assign students to capstone teams.',
//                 icon: (
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="white">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                   </svg>
//                 )
//               },
//               {
//                 step: '2',
//                 title: 'Submit Solutions',
//                 desc: 'Students collaborate, develop solutions, and submit finalized project documentation.',
//                 icon: (
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="white">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
//                   </svg>
//                 )
//               },
//               {
//                 step: '3',
//                 title: 'Review & Certify',
//                 desc: 'Faculty evaluates submissions, provides feedback, and issues official certifications.',
//                 icon: (
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="white">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
//                   </svg>
//                 )
//               },
//             ].map((item, i) => (
//               <div key={i} className="flex items-start gap-4">
//                 <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white text-lg flex-shrink-0 shadow-md">
//                   {item.icon}
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
//                   <p className="text-gray-600">{item.desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Review Image - Now visible on mobile but optimized */}
//           <div className="mt-8 md:mt-0 px-4 md:px-0">
//             <Image
//               src={Review}
//               alt="Review and feedback process"
//               className="rounded-xl shadow-lg w-full h-auto"
//               placeholder="blur"
//             />
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }