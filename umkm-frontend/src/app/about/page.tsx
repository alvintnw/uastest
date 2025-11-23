'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function About() {
  const [displayText, setDisplayText] = useState('');
  const fullText = 'Tentang Sabana Fried Chicken';
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 100); // Kecepatan ketik

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fade-in">
      {/* Bagian Hero */}
      <section
        className="about-hero-section text-white d-flex align-items-center justify-content-center position-relative overflow-hidden"
        style={{
          minHeight: '75vh',
          background: 'linear-gradient(135deg, #ffcc00 0%, #ff6600 100%)',
        }}
      >
        <div className="container text-center">
          <h1 className="display-3 fw-bold mb-3 gradient-text">
            {displayText}
            {isTyping && <span className="cursor">|</span>}
          </h1>
          <p className="lead text-white fs-4 mx-auto" style={{ maxWidth: '800px' }}>
            <strong>Sabana Fried Chicken</strong> — ayam goreng halal dan renyah, dibuat dengan bumbu khas Indonesia,
            disajikan penuh kehangatan sejak pertama kali hadir di tengah keluarga Indonesia.
          </p>
        </div>

        {/* Emoji dekoratif / ikon mengambang */}
        <div className="position-absolute w-100 h-100 top-0 start-0 overflow-hidden">
          <div
            className="position-absolute text-warning floating-emoji"
            style={{ top: '15%', left: '10%', fontSize: '3rem', opacity: 0.3 }}
          >
            🍗
          </div>
          <div
            className="position-absolute text-danger floating-emoji-delay"
            style={{ bottom: '20%', right: '15%', fontSize: '3rem', opacity: 0.3 }}
          >
            ⭐
          </div>
        </div>
      </section>

      {/* Sejarah Sabana Section */}
      <section className="about-story-section py-5 bg-light position-relative overflow-hidden">
        <div className="container">
          <div className="row align-items-center g-5">
            {/* Gambar Mitra / Restoran */}
            <div className="col-lg-6 text-center slide-in-left">
              <div className="story-image-wrapper position-relative">
                <Image
                  src="/images/mitra-photo.png"
                  alt="Mitra Sabana Fried Chicken"
                  width={600}
                  height={400}
                  className="rounded-4 shadow-lg hover-scale"
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: 'auto',
                    border: '5px solid #fff',
                  }}
                />
              </div>
              <p className="text-muted mt-3 small">Mitra Sabana Fried Chicken di berbagai daerah Indonesia</p>
            </div>

            {/* Teks Sejarah */}
            <div className="col-lg-6 slide-in-right">
              <h2 className="fw-bold display-5 mb-4 gradient-text-secondary">Sejarah Sabana Fried Chicken</h2>
              <p className="text-muted fs-5 lh-base mb-3">
                Didirikan pada tahun <strong>2006</strong>, Sabana Fried Chicken lahir dari semangat untuk menghadirkan
                ayam goreng yang <strong>lezat, halal, dan terjangkau</strong> bagi seluruh masyarakat Indonesia.
              </p>
              <p className="text-muted fs-5 lh-base mb-3">
                Berawal dari sebuah usaha kecil rumahan, Sabana kini telah tumbuh menjadi jaringan ayam goreng lokal
                terbesar yang tersebar di berbagai daerah. Dengan racikan bumbu khas, bahan berkualitas, dan pelayanan
                yang ramah, Sabana berhasil merebut hati pelanggan di seluruh Indonesia.
              </p>
              <p className="text-muted fs-5 lh-base">
                Melalui program kemitraan, Sabana juga membuka peluang usaha bagi ribuan mitra untuk berkembang
                bersama. Hingga kini, Sabana Fried Chicken menjadi simbol cita rasa lokal yang membanggakan —
                <em>“Ayam Gorengnya Orang Indonesia.”</em>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filosofi Singkat */}
      <section
        className="py-5 text-center text-dark position-relative"
        style={{
          background: 'linear-gradient(135deg, #fff7e6 0%, #fff 100%)',
        }}
      >
        <div className="container">
          <div className="section-badge mb-4">
            <span className="badge bg-warning text-dark px-4 py-2 rounded-pill fs-6 shadow-sm pulse-badge">
              Filosofi Sabana
            </span>
          </div>

          <h2 className="fw-bold mb-4 display-5">Komitmen Kami</h2>
          <p className="text-muted fs-5 lh-base mx-auto" style={{ maxWidth: '800px' }}>
            Sabana Fried Chicken berpegang pada prinsip{' '}
            <strong>“Bersih, Halal, dan Terjangkau.”</strong>
            Kami percaya bahwa setiap potongan ayam yang kami sajikan tidak hanya sekadar makanan — tapi juga simbol
            kebahagiaan, kehangatan, dan kebersamaan keluarga Indonesia.
          </p>


        </div>
      </section>

      {/* Visi dan Misi */}
      <section className="py-5 bg-white position-relative overflow-hidden">
        <div className="container">
          <div className="row g-5">
            {/* Visi */}
            <div className="col-lg-6 slide-in-left">
              <div className="text-start mb-4">
                <div className="section-badge mb-3">
                  <span className="badge bg-primary text-white px-4 py-2 rounded-pill fs-6 shadow-sm pulse-badge">
                    Visi
                  </span>
                </div>
                <h3 className="fw-bold mb-3 gradient-text-secondary">Menjadi Pemimpin Ayam Goreng Halal di Indonesia</h3>
                <p className="text-muted fs-5 lh-base">
                  Sabana Fried Chicken berkomitmen untuk menjadi brand ayam goreng halal terdepan di Indonesia,
                  dengan fokus pada inovasi rasa, kualitas bahan, dan kepuasan pelanggan yang tak tertandingi.
                </p>
              </div>
            </div>

            {/* Misi */}
            <div className="col-lg-6 slide-in-right">
              <div className="text-center mb-4">
                <div className="section-badge mb-3">
                  <span className="badge bg-success text-white px-4 py-2 rounded-pill fs-6 shadow-sm pulse-badge">
                    Misi
                  </span>
                </div>
                <h3 className="fw-bold mb-3 gradient-text-secondary">Menyediakan Pengalaman Kuliner Berkesan</h3>
                <ul className="text-muted fs-5 lh-base text-start">
                  <li>Menyajikan ayam goreng dengan bahan berkualitas tinggi dan resep tradisional Indonesia.</li>
                  <li>Mendukung pertumbuhan mitra melalui program kemitraan yang saling menguntungkan.</li>
                  <li>Menjaga standar kehalalan dan kebersihan di setiap gerai.</li>
                  <li>Meningkatkan kepuasan pelanggan melalui pelayanan prima dan inovasi produk.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CSS Animasi Inline */}
      <style jsx>{`
        .fade-in {
          animation: fadeIn 1s ease-in-out;
        }
        .hover-scale:hover {
          transform: scale(1.03);
          transition: transform 0.3s ease;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        .slide-in-left {
          animation: slideInLeft 1s ease;
        }
        .slide-in-right {
          animation: slideInRight 1s ease;
        }
        .gradient-text-secondary {
          background: linear-gradient(90deg, #ff6600, #ffcc00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .animated-gradient-text {
          background: linear-gradient(90deg, #ff6600, #ffcc00, #ff6600);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientShift 3s ease-in-out infinite;
        }
        .cursor {
          animation: blink 1s infinite;
        }
        .floating-emoji {
          animation: float 3s ease-in-out infinite;
        }
        .floating-emoji-delay {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
        .pulse-badge {
          animation: pulse 2s infinite;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-50px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(50px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.7);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(255, 193, 7, 0);
          }
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes blink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
