'use client';

import { usePathname } from 'next/navigation';

export default function WhatsAppButton() {
  const pathname = usePathname();

  // Hide WhatsApp button in dashboard
  const isInDashboard = pathname?.startsWith('/dashboard');

  if (isInDashboard) {
    return null;
  }

  return (
    <div className="position-fixed bottom-0 end-0 m-4 z-3">
      <a
        href="https://wa.me/6281234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-success rounded-pill shadow-lg d-flex align-items-center"
        style={{
          padding: '12px 20px',
          animation: 'pulse 2s infinite'
        }}
      >
        <span className="fs-5 me-2">✆</span>
        <div className="d-flex flex-column text-start">
          <small className="opacity-75" style={{ fontSize: '0.7rem', lineHeight: '1' }}>Pesan Sekarang</small>
          <strong style={{ fontSize: '0.8rem', lineHeight: '1' }}>WhatsApp</strong>
        </div>
      </a>
    </div>
  );
}
