'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Hide footer in dashboard pages
  if (pathname.startsWith('/dashboard')) {
    return null;
  }

  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4 mb-lg-0">
            <h5 className="fw-bold mb-3">Sabana Fried Chicken</h5>
            <p className="text-light opacity-75">
              Sabana Fried Chicken hadir untuk memenuhi kebutuhan masyarakat Indonesia dengan produk Fried Chicken yang Halal, Lezat dan Berkualitas.
            </p>
            <div className="social-links">
              <a href="#" className="text-light me-3 opacity-75 hover-opacity-100 text-decoration-none">
                Facebook
              </a>
              <a href="#" className="text-light me-3 opacity-75 hover-opacity-100 text-decoration-none">
                Instagram
              </a>
              <a href="#" className="text-light opacity-75 hover-opacity-100 text-decoration-none">
                TikTok
              </a>
            </div>
          </div>

          <div className="col-lg-2 col-6 mb-4 mb-lg-0">
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link href="/" className="text-light opacity-75 text-decoration-none hover-opacity-100">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/about" className="text-light opacity-75 text-decoration-none hover-opacity-100">
                  Tentang Kami
                </Link>
              </li>
              <li className="mb-2">
                <a href="#menu" className="text-light opacity-75 text-decoration-none hover-opacity-100">
                  Menu
                </a>
              </li>
              <li className="mb-2">
                <a href="#contact" className="text-light opacity-75 text-decoration-none hover-opacity-100">
                  Kontak
                </a>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-6 mb-4 mb-lg-0">
            <h6 className="fw-bold mb-3">Kontak Kami</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <span className="text-light opacity-75">
                  📍 Jl. Contoh No. 123, Jakarta
                </span>
              </li>
              <li className="mb-2">
                <a
                  href="tel:+622112345678"
                  className="text-light opacity-75 text-decoration-none hover-opacity-100"
                >
                  📞 (021) 1234-5678
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light opacity-75 text-decoration-none hover-opacity-100"
                >
                  📱 +62 812-3456-7890
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="mailto:info@sabanafc.com"
                  className="text-light opacity-75 text-decoration-none hover-opacity-100"
                >
                  ✉️ info@sabanafc.com
                </a>
              </li>
            </ul>
          </div>

          <div className="col-lg-3">
            <h6 className="fw-bold mb-3">Jam Operasional</h6>
            <ul className="list-unstyled text-light opacity-75">
              <li className="mb-2">Senin - Jumat: 08:00 - 22:00</li>
              <li className="mb-2">Sabtu - Minggu: 09:00 - 23:00</li>
              <li className="mb-2">Pesan Antar 24 Jam</li>
            </ul>
          </div>
        </div>

        <hr className="my-4 opacity-25" />

        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0 text-light opacity-75">
              &copy; {currentYear} Sabana Fried Chicken. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <p className="mb-0 text-light opacity-75">
              Developed by <Link href="/about" className="text-light text-decoration-none">Developer Team</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
