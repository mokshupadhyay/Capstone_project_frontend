'use client';

import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import Image from 'next/image';

const Footer = () => {
    const { user } = useAuth();
    const currentYear = new Date().getFullYear();

    const getFooterLinks = () => {
        if (!user) {
            return [
                { href: '/', label: 'Home' },
                { href: '/login', label: 'Login' },
                { href: '/register', label: 'Register' },
            ];
        }

        switch (user.role) {
            case 'admin':
            case 'manager':
                return [
                    { href: '/', label: 'Home' },
                    { href: '/dashboard', label: 'Dashboard' },
                ];
            case 'teacher':
                return [
                    { href: '/', label: 'Home' },
                    { href: '/dashboard', label: 'Dashboard' },
                    { href: '/projects/create', label: 'Create Projects' },
                    { href: '/reviews', label: 'Review Submissions' },
                ];
            case 'coordinator':
                return [
                    { href: '/', label: 'Home' },
                    { href: '/dashboard', label: 'Dashboard' },
                    { href: '/projects/create', label: 'Create Projects' },
                    { href: '/reviews', label: 'Review Submissions' },
                ];
            case 'student':
                return [
                    { href: '/', label: 'Home' },
                    { href: '/dashboard', label: 'Dashboard' },
                    { href: '/my_submissions', label: 'My Submissions' },
                    { href: '/reviews', label: 'Reviews' },
                    { href: '/certifications', label: 'Certifications' },
                ];
            default:
                return [{ href: '/', label: 'Home' }];
        }
    };

    const footerLinks = getFooterLinks();

    return (
        <footer className="bg-black text-white py-12 mt-20 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-8">
                    {/* Column 1 - About */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 group">
                            <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                                <span className="text-white font-bold text-xl">CP</span>
                            </div>
                            <div className="transform transition-transform duration-300 group-hover:translate-x-1">
                                <h4 className="text-2xl font-bold text-teal-400">Capstone Portal</h4>
                                <p className="text-sm text-gray-400">Academic Excellence</p>
                            </div>
                        </div>
                        <p className="text-gray-300 leading-relaxed">
                            A comprehensive platform dedicated to the management, submission, and peer review of academic capstone projects.
                            Empowering students to showcase their work while facilitating collaboration between students, faculty, and industry professionals.
                        </p>

                        {/* Project Features */}
                        <div className="mt-6 pt-6 border-t border-gray-800">
                            <h5 className="text-lg font-semibold text-teal-300 mb-3">Project Features</h5>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-300">
                                <li className="flex items-center group">
                                    <div className="mr-2 transform transition-transform duration-200 group-hover:scale-110">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="group-hover:text-teal-400 transition-colors duration-200">Project Submission</span>
                                </li>
                                <li className="flex items-center group">
                                    <div className="mr-2 transform transition-transform duration-200 group-hover:scale-110">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="group-hover:text-teal-400 transition-colors duration-200">Peer Review System</span>
                                </li>
                                <li className="flex items-center group">
                                    <div className="mr-2 transform transition-transform duration-200 group-hover:scale-110">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="group-hover:text-teal-400 transition-colors duration-200">Faculty Feedback</span>
                                </li>
                                <li className="flex items-center group">
                                    <div className="mr-2 transform transition-transform duration-200 group-hover:scale-110">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="group-hover:text-teal-400 transition-colors duration-200">Project Showcasing</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Column 2 - Developer */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50 shadow-lg">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="w-full md:w-2/3 space-y-4">
                                <h4 className="text-xl font-semibold text-teal-300">Created By Moksh Upadhyay</h4>

                                <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-teal-900/30 ring-1 ring-teal-500/40 backdrop-blur-sm group hover:bg-teal-900/40 transition-all duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-teal-400 group-hover:rotate-180 transition-transform duration-500">
                                        <polyline points="16 18 22 12 16 6"></polyline>
                                        <polyline points="8 6 2 12 8 18"></polyline>
                                    </svg>
                                    <span className="text-sm font-medium uppercase tracking-wide text-teal-300 group-hover:text-teal-200">Software Engineer</span>
                                </div>

                                <p className="text-gray-200 leading-relaxed border-l-2 border-teal-500 pl-4 italic">
                                    Passionate software engineer with a focus on creating impactful user experiences.
                                </p>

                                <div className="flex flex-wrap gap-3 mt-4">
                                    <a
                                        href="https://github.com/mokshupadhyay"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-3 py-1.5 bg-gray-700/50 text-gray-200 hover:bg-gray-700 rounded-md text-sm transition-all ring-1 ring-gray-600 hover:ring-teal-500 group"
                                    >
                                        <svg className="w-4 h-4 mr-1.5 text-teal-400 group-hover:rotate-[-360deg] transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                        </svg>
                                        GitHub
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/in/moksh-upadhyay-4b5a61257/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-3 py-1.5 bg-gray-700/50 text-gray-200 hover:bg-gray-700 rounded-md text-sm transition-all ring-1 ring-gray-600 hover:ring-teal-500 group"
                                    >
                                        <svg className="w-4 h-4 mr-1.5 text-teal-400 group-hover:rotate-[-360deg] transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                            <rect x="2" y="9" width="4" height="12"></rect>
                                            <circle cx="4" cy="4" r="2"></circle>
                                        </svg>
                                        LinkedIn
                                    </a>
                                </div>

                                <a
                                    href="https://mokshdev.vercel.app/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 rounded-md text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group"
                                >
                                    <svg className="w-4 h-4 mr-2 group-hover:rotate-[-360deg] transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                    </svg>
                                    View Portfolio
                                </a>
                            </div>

                            <div className="w-full md:w-1/3 flex items-center justify-center">
                                <div className="relative h-32 w-32 rounded-full overflow-hidden p-1 bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500 shadow-xl animate-pulse">
                                    <Image
                                        src="https://media.licdn.com/dms/image/v2/D5603AQEg5HxGZJm07w/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1731651844420?e=1750291200&v=beta&t=L7f3Y_AXIToUiG6MmWHuMJEiM_dHbqeSTy7qAofDd0Q"
                                        alt="Profile"
                                        width={128}
                                        height={128}
                                        className="w-full h-full object-cover rounded-full transform hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation & Copyright */}
                <div className="border-t border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        {/* Quick Links */}
                        <nav>
                            <ul className="flex flex-wrap gap-x-6 gap-y-2">
                                {footerLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-300 hover:text-teal-400 transition-colors duration-200 group relative"
                                        >
                                            <span>{link.label}</span>
                                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Copyright */}
                        <p className="text-gray-400 text-sm">
                            &copy; {currentYear} Capstone Project Portal. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;