'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    return (
        <nav className="bg-white shadow-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <Link href="/" className="text-xl font-bold text-gray-900 flex items-center">
                        <span className="inline-block">Capstone Portal</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link href="/" className="text-gray-700 hover:text-black transition">
                            Home
                        </Link>

                        {user ? (
                            <>
                                <Link href="/dashboard" className="text-gray-700 hover:text-black transition">
                                    Dashboard
                                </Link>

                                {user.role === 'student' ? (
                                    <Link href="/my_submissions" className="text-gray-700 hover:text-black transition">
                                        My Submissions
                                    </Link>
                                ) : (
                                    <Link href="/projects/create" className="text-gray-700 hover:text-black transition">
                                        Create Projects
                                    </Link>
                                )}

                                <Link href="/reviews" className="text-gray-700 hover:text-black transition">
                                    {user.role === 'student' ? 'See Reviews' : 'Review Submissions'}
                                </Link>

                                {user.role === 'student' && (
                                    <Link href="/certifications" className="text-gray-700 hover:text-black transition">
                                        Certifications
                                    </Link>
                                )}

                                <div className="flex items-center space-x-4 ml-4">
                                    <span className="text-sm text-gray-600">
                                        {user.username} ({user.role})
                                    </span>
                                    <button
                                        onClick={logout}
                                        className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="border border-black px-4 py-2 rounded-md hover:bg-gray-100 text-black transition"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={toggleMobileMenu} className="text-gray-700 hover:text-black p-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Refined Mobile Menu with Overlay */}
            {mobileMenuOpen && (
                <>
                    {/* Blurred backdrop overlay */}
                    <div
                        className="fixed inset-0 backdrop-blur-sm bg-black/30 z-40"
                        onClick={() => setMobileMenuOpen(false)}
                    ></div>

                    {/* Side menu panel */}
                    <div className="md:hidden fixed inset-y-0 right-0 w-72 bg-white z-50 shadow-xl transform transition-all duration-300 ease-in-out">
                        <div className="flex flex-col h-full">
                            <div className="px-4 py-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="font-bold text-xl text-gray-900">Menu</h2>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-gray-500 hover:text-black p-1"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto py-4">
                                <div className="px-4 flex flex-col space-y-4">
                                    <Link
                                        href="/"
                                        onClick={handleNavClick}
                                        className="text-gray-800 hover:text-black border-b border-gray-100 pb-2"
                                    >
                                        Home
                                    </Link>

                                    {user ? (
                                        <>
                                            <Link
                                                href="/dashboard"
                                                onClick={handleNavClick}
                                                className="text-gray-800 hover:text-black border-b border-gray-100 pb-2"
                                            >
                                                Dashboard
                                            </Link>

                                            {user.role === 'student' ? (
                                                <Link
                                                    href="/my_submissions"
                                                    onClick={handleNavClick}
                                                    className="text-gray-800 hover:text-black border-b border-gray-100 pb-2"
                                                >
                                                    My Submissions
                                                </Link>
                                            ) : (
                                                <Link
                                                    href="/projects/create"
                                                    onClick={handleNavClick}
                                                    className="text-gray-800 hover:text-black border-b border-gray-100 pb-2"
                                                >
                                                    Create Projects
                                                </Link>
                                            )}

                                            <Link
                                                href="/reviews"
                                                onClick={handleNavClick}
                                                className="text-gray-800 hover:text-black border-b border-gray-100 pb-2"
                                            >
                                                {user.role === 'student' ? 'See Reviews' : 'Review Submissions'}
                                            </Link>

                                            {user.role === 'student' && (
                                                <Link
                                                    href="/certifications"
                                                    onClick={handleNavClick}
                                                    className="text-gray-800 hover:text-black border-b border-gray-100 pb-2"
                                                >
                                                    Certifications
                                                </Link>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                href="/login"
                                                onClick={handleNavClick}
                                                className="text-gray-800 hover:text-black border-b border-gray-100 pb-2"
                                            >
                                                Login
                                            </Link>

                                            <Link
                                                href="/register"
                                                onClick={handleNavClick}
                                                className="text-gray-800 hover:text-black border-b border-gray-100 pb-2"
                                            >
                                                Register
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>

                            {user && (
                                <div className="px-4 py-4 bg-gray-50 border-t border-gray-100">
                                    <div className="mb-3">
                                        <span className="font-medium text-gray-900">{user.username}</span>
                                        <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                                            {user.role}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="bg-black text-white w-full py-2 rounded-md hover:bg-gray-800 transition flex justify-center items-center"
                                    >
                                        <span>Logout</span>
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