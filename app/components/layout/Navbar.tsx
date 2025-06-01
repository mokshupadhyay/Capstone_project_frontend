'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const router = useRouter();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
    const handleNavClick = () => setMobileMenuOpen(false);

    const handleLogout = async () => {
        if (isLoggingOut) return;
        try {
            setIsLoggingOut(true);
            await new Promise(resolve => setTimeout(resolve, 500));
            logout();
            setMobileMenuOpen(false);
            await router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const getNavLinks = () => {
        if (!user) {
            return [
                { href: '/', label: 'Home' },
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
            case 'academic_team':
                return [
                    { href: '/', label: 'Home' },
                    { href: '/dashboard', label: 'Dashboard' },
                    { href: '/projects/create', label: 'Create Projects' },
                    { href: '/reviews', label: 'Reviews' },
                ]
            default:
                return [{ href: '/', label: 'Home' }];
        }
    };

    const navLinks = getNavLinks();

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-lg' : 'bg-white'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center group">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                                <span className="text-white font-bold text-lg">CP</span>
                            </div>
                            <div className="transform transition-transform duration-300 group-hover:translate-x-1">
                                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Capstone Portal</h1>
                                <p className="text-xs text-slate-500 -mt-1">Academic Excellence</p>
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="relative px-4 py-2.5 text-slate-700 hover:text-slate-900 rounded-lg transition-all duration-200 font-medium group overflow-hidden"
                            >
                                <span className="relative z-10">{link.label}</span>
                                <div className="absolute inset-0 bg-slate-50 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
                                <div className="absolute bottom-1.5 left-4 right-4 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 group-hover:shadow-[0_0_8px_rgba(45,212,191,0.4)]"></div>
                            </Link>
                        ))}

                        {user ? (
                            <div className="flex items-center ml-6 pl-6 border-l border-slate-200">
                                <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                        <div className="text-sm font-semibold text-slate-900">{user.username}</div>
                                        <div className="text-xs text-slate-500 capitalize">{user.role}</div>
                                    </div>
                                    <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center shadow-md transform hover:scale-105 transition-transform duration-200">
                                        <span className="text-white font-semibold text-sm">
                                            {user.username.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        disabled={isLoggingOut}
                                        className="relative bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg disabled:bg-slate-700 disabled:cursor-not-allowed group overflow-hidden"
                                    >
                                        <div className={`flex items-center justify-center ${isLoggingOut ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
                                            <svg className="w-5 h-5 mr-2 transform group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Logout
                                        </div>
                                        {isLoggingOut && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                                                <div className="h-5 w-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3 ml-6">
                                <Link
                                    href="/login"
                                    className="relative text-slate-700 hover:text-slate-900 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover:bg-slate-50 group"
                                >
                                    <span className="relative z-10">Login</span>
                                    <div className="absolute bottom-1.5 left-4 right-4 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 group-hover:shadow-[0_0_8px_rgba(45,212,191,0.4)]"></div>
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <button
                            onClick={toggleMobileMenu}
                            className="text-slate-700 hover:text-slate-900 p-2.5 rounded-lg hover:bg-slate-50 transition-all duration-200"
                            aria-label="Toggle mobile menu"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 transform transition-transform duration-300"
                                style={{ transform: mobileMenuOpen ? 'rotate(180deg)' : 'rotate(0)' }}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl z-50 transform transition-transform duration-300">
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto py-4">
                                <div className="px-4 space-y-2">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={handleNavClick}
                                            className="relative block px-4 py-3 text-gray-800 hover:text-gray-900 rounded-lg transition-all duration-200 group"
                                        >
                                            <span className="relative z-10">{link.label}</span>
                                            <div className="absolute inset-0 bg-slate-50 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
                                            <div className="border-b-1 border-gray-300"></div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {user && (
                                <div className="p-4 border-t border-gray-100">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-lg">
                                                {user.username.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">{user.username}</div>
                                            <div className="text-sm text-gray-500 capitalize">{user.role}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        disabled={isLoggingOut}
                                        className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-medium transition-all duration-200 relative overflow-hidden group"
                                    >
                                        <div className={`flex items-center justify-center ${isLoggingOut ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
                                            <svg className="w-5 h-5 mr-2 transform group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Logout
                                        </div>
                                        {isLoggingOut && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                                                <div className="h-5 w-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
};

export default Navbar;
