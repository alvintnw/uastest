// src/app/dashboard/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import './dashboard.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authChecked, setAuthChecked] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const authToken = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');

    if (pathname === '/dashboard/login') {
      if (authToken && userData) {
        router.push('/dashboard');
        return;
      }
      setAuthChecked(true);
      return;
    }

    if (!authToken || !userData) {
      router.push('/dashboard/login');
      return;
    }

    setAuthChecked(true);
  }, [router, pathname]);

  if (!authChecked) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  if (pathname === '/dashboard/login') {
    return <>{children}</>;
  }

  return (
    <DashboardAuthenticatedLayout 
      mobileMenuOpen={mobileMenuOpen} 
      setMobileMenuOpen={setMobileMenuOpen}
    >
      {children}
    </DashboardAuthenticatedLayout>
  );
}

function DashboardAuthenticatedLayout({ 
  children, 
  mobileMenuOpen, 
  setMobileMenuOpen 
}: { 
  children: React.ReactNode;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}) {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.push('/dashboard/login');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="dashboard-container">
      {/* Navbar from homepage */}
      <Navbar />

      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <i className="fas fa-bars"></i>
      </button>

      {/* Sidebar - FIXED POSITION */}
      <div className={`sidebar ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="logo">
          <h2>Delicious <span>Admin</span></h2>
        </div>
        <ul className="nav-links">
          <li className={isActive('/dashboard') ? 'active' : ''}>
            <a href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <i className="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </a>
          </li>
          <li className={isActive('/dashboard/products') ? 'active' : ''}>
            <a href="/dashboard/products" onClick={() => setMobileMenuOpen(false)}>
              <i className="fas fa-utensils"></i>
              <span>Menu</span>
            </a>
          </li>
          <li className={isActive('/dashboard/invoices') ? 'active' : ''}>
            <a href="/dashboard/invoices" onClick={() => setMobileMenuOpen(false)}>
              <i className="fas fa-shopping-cart"></i>
              <span>Pesanan</span>
            </a>
          </li>
          {/* Settings menu dihapus */}
          <li>
            <button onClick={handleLogout} className="logout-btn">
              <i className="fas fa-sign-out-alt"></i>
              <span>Keluar</span>
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <div className="header-left">
            <h1>
              {pathname === '/dashboard' ? 'Dashboard' :
               pathname === '/dashboard/products' ? 'Manajemen Menu' :
               pathname === '/dashboard/invoices' ? 'Manajemen Pesanan' :
               'Dashboard Admin'}
            </h1>
          </div>
          <div className="user-info">
            <img
              src={`https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=0D8ABC&color=fff`}
              alt="Admin"
            />
            <div>
              <h4>{user?.name || 'Admin User'}</h4>
              <p>Administrator</p>
            </div>
          </div>
        </div>
        {children}
      </div>

      <style jsx>{`
        .mobile-menu-btn {
          display: none;
        }

        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block;
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1001;
            background: #e74c3c;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 10px;
            font-size: 1.2rem;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          }
        }
      `}</style>
    </div>
  );
}
