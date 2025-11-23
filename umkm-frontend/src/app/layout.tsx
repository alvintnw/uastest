// src/app/layout.tsx
import 'bootstrap/dist/css/bootstrap.css';
import './globals.css';
import { Inter } from 'next/font/google';
import BootstrapClient from '@/components/BootstrapClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import type { Metadata } from 'next';
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Sabana Fried Chicken - Makanan Enak & Berkualitas',
    template: '%s | Sabana Fried Chicken'
  },
  description: 'Website UMKM makanan dengan berbagai menu lezat dan fresh. Menyediakan nasi goreng, mie ayam, sate, dan berbagai makanan tradisional Indonesia.',
  keywords: ['UMKM', 'makanan', 'kuliner', 'nasi goreng', 'mie ayam', 'makanan tradisional', 'fried chicken'],
  authors: [{ name: 'Sabana Fried Chicken Team' }],
  creator: 'Sabana Fried Chicken',
  publisher: 'Sabana Fried Chicken',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="id" className="h-100">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0d6efd" />
      </head>
      <body className={`${inter.className} d-flex flex-column h-100`}>
        {/* Navigation Header */}
        <header>
          <Navbar />
        </header>

        {/* Main Content */}
        <main className="flex-grow-1">
          {children}
        </main>

        {/* Footer */}
        <Footer />

        {/* WhatsApp Floating Button */}
        <WhatsAppButton />

        {/* Bootstrap JavaScript */}
        <BootstrapClient />
      </body>
    </html>
  );
}
