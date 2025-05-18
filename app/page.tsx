// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//       <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
//           <li className="mb-2 tracking-[-.01em]">
//             Get started by editing{" "}
//             <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
//               app/page.tsx
//             </code>
//             .
//           </li>
//           <li className="tracking-[-.01em]">
//             Save and see your changes instantly.
//           </li>
//         </ol>

//         <div className="flex gap-4 items-center flex-col sm:flex-row">
//           <a
//             className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Read our docs
//           </a>
//         </div>
//       </main>
//       <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/file.svg"
//             alt="File icon"
//             width={16}
//             height={16}
//           />
//           Learn
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/globe.svg"
//             alt="Globe icon"
//             width={16}
//             height={16}
//           />
//           Go to nextjs.org →
//         </a>
//       </footer>
//     </div>
//   );
// }
'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import Review from '../public/review.jpg';
import Teacher from '../public/teacher.jpg';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="py-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Text Content */}
          <div className="text-center md:text-left max-w-xl">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Capstone Project Portal
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10">
              Streamline your capstone journey with tools for submission, review, and project management.
            </p>

            {user ? (
              <Link
                href="/dashboard"
                className="inline-block bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-md text-lg transition duration-300"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  href="/login"
                  className="inline-block bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-md text-lg transition duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="inline-block border border-black text-black hover:bg-gray-100 font-medium py-3 px-6 rounded-md text-lg transition duration-300"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Teacher Image */}
          <div className="w-full md:w-1/2">
            <Image
              src={Teacher}
              alt="Teacher working on capstone projects"
              className="rounded-xl shadow-lg"
              placeholder="blur"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 rounded-2xl">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900">Key Features</h2>
          <p className="text-gray-600 mt-2">Everything you need for seamless capstone management</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Project Management',
              desc: 'Teachers can create and manage capstone projects with ease',
              iconPath:
                'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
            },
            {
              title: 'File Submissions',
              desc: 'Students can submit their work in PDF format with smart compression',
              iconPath:
                'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12',
            },
            {
              title: 'Role-Based Access',
              desc: 'Customizable permissions for different user roles',
              iconPath:
                'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
            },
          ].map((feature, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-black mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.iconPath} />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-center text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <p className="text-gray-600 mt-2">A simple 3-step workflow for everyone</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Steps */}
          <div className="space-y-8">
            {[
              {
                step: '1',
                title: 'Create Projects',
                desc: 'Teachers create projects and upload datasets or problem statements.',
              },
              {
                step: '2',
                title: 'Submit Solutions',
                desc: 'Students submit their project files in PDF format via the platform.',
              },
              {
                step: '3',
                title: 'Review & Evaluate',
                desc: 'Teachers and evaluators assess submissions and provide feedback.',
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white text-lg">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Review Image */}
          <div className="hidden md:block">
            <Image
              src={Review}
              alt="Review and feedback process"
              className="rounded-xl shadow-md"
              placeholder="blur"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
