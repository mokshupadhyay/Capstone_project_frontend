import { Geist } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';
import ClientLayout from './components/layout/ClientLayout';

// Initialize fonts
const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Capstone Project Portal',
  description: 'A comprehensive platform for managing and showcasing academic capstone projects. Features include project submission, peer review, and collaboration between students and faculty.',
  keywords: 'capstone, academic projects, student portal, project management, education platform',
  authors: [{ name: 'Moksh Upadhyay', url: 'https://mokshdev.vercel.app/' }],
  creator: 'Moksh Upadhyay',
  applicationName: 'Capstone Project Portal',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Capstone Project Portal',
    description: 'Academic excellence through project collaboration',
    url: 'https://capstone-project-portal.vercel.app/',
    siteName: 'Capstone Project Portal',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Capstone Portal',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geist.className}>
      <body className="bg-gray-50">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}