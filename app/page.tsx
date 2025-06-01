'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import Review from '../public/review.jpg';
import Teacher from '../public/teacher.jpg';
import instructor from '../public/instructor.jpg';
import problem from '../public/problem.jpg';
import uplaodDocument from '../public/uploadingdocumentsThreeStudentsiilustration.jpg';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16">
          {/* Text Content */}
          <div className="text-center md:text-left max-w-xl w-full">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 md:mb-6 tracking-tight leading-tight">
              Transform Your Academic Journey
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600 mt-2">
                With Capstone Portal
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 md:mb-10 leading-relaxed">
              Elevate your capstone experience with our comprehensive platform. Seamlessly manage submissions, collaborate with peers, and achieve academic excellence.
            </p>

            {user ? (
              <Link
                href="/dashboard"
                className="inline-block bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-medium py-3 px-8 rounded-lg text-lg transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex flex-row gap-4 justify-center md:justify-start">
                <Link
                  href="/login"
                  className="inline-block bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-medium py-3 px-8 rounded-lg text-lg transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Get Started
                </Link>
                <Link
                  href="/register"
                  className="inline-block border-2 border-teal-600 text-teal-600 hover:bg-teal-50 font-medium py-3 px-8 rounded-lg text-lg transition duration-300 transform hover:scale-105"
                >
                  Learn More
                </Link>
              </div>
            )}
          </div>

          {/* Hero Image */}
          <div className="w-full md:w-1/2 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-2xl transform rotate-3"></div>
            <Image
              src={Teacher}
              alt="Teacher working on capstone projects"
              className="rounded-2xl shadow-xl w-full h-auto relative transform -rotate-3 transition-transform duration-300 hover:rotate-0"
              placeholder="blur"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white rounded-3xl my-12 md:my-20">
        <div className="text-center mb-12 md:mb-16 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Your Success
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage, submit, and excel in your capstone projects
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 px-4">
          {[
            {
              title: 'Smart Project Management',
              desc: 'Intuitive tools for creating, tracking, and managing capstone projects with real-time updates and progress monitoring.',
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              ),
              image: problem
            },
            {
              title: 'Seamless Submissions',
              desc: 'Advanced file handling with smart compression, version control, and automatic formatting for professional documentation.',
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              ),
              image: uplaodDocument
            },
            {
              title: 'Secure Role Management',
              desc: 'Comprehensive access control system with specialized features for students, teachers, and evaluators.',
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ),
              image: instructor
            },
          ].map((feature, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="relative h-48 mb-6 rounded-xl overflow-hidden">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  className="object-cover w-full h-full transform hover:scale-110 transition-transform duration-300"
                  width={400}
                  height={300}
                />
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center text-white shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-900 to-gray-800 rounded-3xl text-white">
        <div className="text-center mb-12 md:mb-16 px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple & Effective Workflow</h2>
          <p className="text-gray-300 text-lg">Three easy steps to capstone success</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center px-4">
          {/* Steps */}
          <div className="space-y-8">
            {[
              {
                step: '01',
                title: 'Project Creation & Assignment',
                desc: 'Teachers easily create and customize projects, set guidelines, and assign teams with our intuitive interface.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )
              },
              {
                step: '02',
                title: 'Collaborative Development',
                desc: 'Students work together, share resources, and submit their work through our streamlined submission system.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                )
              },
              {
                step: '03',
                title: 'Review & Certification',
                desc: 'Faculty provides comprehensive feedback and issues digital certifications upon successful completion.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-6 group">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-teal-300 transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Process Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 rounded-2xl transform rotate-3"></div>
            <Image
              src={Review}
              alt="Review and feedback process"
              className="rounded-2xl shadow-2xl w-full h-auto relative transform -rotate-3 transition-transform duration-300 hover:rotate-0"
              placeholder="blur"
            />
          </div>
        </div>
      </section>
    </div>
  );
}