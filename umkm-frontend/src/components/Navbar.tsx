'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 0);

      // Calculate active section on home page
      if (pathname === '/') {
        const menuElement = document.getElementById('menu');
        const contactElement = document.getElementById('contact');

        const menuOffset = menuElement ? menuElement.offsetTop - 100 : 0;
        const contactOffset = contactElement ? contactElement.offsetTop - 100 : 0;

        if (scrollY >= contactOffset) {
          setActiveSection('contact');
        } else if (scrollY >= menuOffset) {
          setActiveSection('menu');
        } else {
          setActiveSection('home');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const isHomeActive = pathname === '/' && activeSection === 'home';
  const isMenuActive = pathname === '/' && activeSection === 'menu';
  const isContactActive = pathname === '/' && activeSection === 'contact';
  const isAboutActive = pathname === '/about';
  const isDashboardActive = pathname === '/dashboard';

  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1030,
        background: isScrolled ? 'red' : 'rgba(255, 255, 255, 0.5)',
        backdropFilter: isScrolled ? 'none' : 'blur(10px)',
        transition: 'background 0.3s ease, backdrop-filter 0.3s ease',
        color: isScrolled ? 'white' : 'black',
        padding: '0.75rem 0'
      }}
    >
      <div className="container">
        <Link className="navbar-brand fw-bold" href="/" style={{ color: isScrolled ? 'white' : 'red', fontSize: '1.1rem' }}>
          Sabana
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto" style={{ fontSize: '1.1rem' }}>
            <li className="nav-item">
              <Link
                className={`nav-link ${isHomeActive ? 'active' : ''}`}
                href="/"
                aria-current={isHomeActive ? 'page' : undefined}
                style={{
                  color: (isHomeActive && isScrolled) ? 'yellow' : (isScrolled ? 'white' : (isHomeActive ? 'black' : 'red'))
                }}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isMenuActive ? 'active' : ''}`}
                href="/#menu"
                aria-current={isMenuActive ? 'page' : undefined}
                style={{
                  color: (isMenuActive && isScrolled) ? 'yellow' : (isScrolled ? 'white' : (isMenuActive ? 'black' : 'red'))
                }}
              >
                Menu
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isContactActive ? 'active' : ''}`}
                href="/#contact"
                aria-current={isContactActive ? 'page' : undefined}
                style={{
                  color: (isContactActive && isScrolled) ? 'yellow' : (isScrolled ? 'white' : (isContactActive ? 'black' : 'red'))
                }}
              >
                Kontak
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isAboutActive ? 'active' : ''}`}
                href="/about"
                aria-current={isAboutActive ? 'page' : undefined}
                style={{
                  color: (isAboutActive && isScrolled) ? 'yellow' : (isScrolled ? 'white' : (isAboutActive ? 'black' : 'red'))
                }}
              >
                Tentang Kami
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isDashboardActive ? 'active' : ''}`}
                href="/dashboard"
                aria-current={isDashboardActive ? 'page' : undefined}
                style={{
                  color: (isDashboardActive && isScrolled) ? 'yellow' : (isScrolled ? 'white' : (isDashboardActive ? 'black' : 'red'))
                }}
              >
                Admin Dashboard
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
