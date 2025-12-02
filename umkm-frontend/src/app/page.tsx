'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import api from '@/services/api';
import Image from 'next/image';


// Dynamic import LeafletMap untuk menghindari SSR error
const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div
      className="d-flex align-items-center justify-content-center bg-light rounded"
      style={{ height: '400px' }}
    >
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading map...</span>
      </div>
    </div>
  ),
});

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  // Buat optional agar lebih aman jika backend tidak mengirimnya
  created_at?: string;
  updated_at?: string;
  image_url?: string; 
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [displayText, setDisplayText] = useState('');
  // Stronger, benefit-focused headline for the hero
  const fullText = 'Sabana Fried Chicken';

  // Order modal state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Product | null>(null);
  const [orderForm, setOrderForm] = useState({
    customer_name: '',
    customer_phone: '',
    quantity: 1
  });
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState('');
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
  }, 100); // Adjust speed here (faster typing)

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/foods');
      setProducts(response.data.data);
    } catch (err) {
      setError('Gagal memuat data menu. Silakan refresh halaman.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ PERBAIKAN 1: Jangan mengubah struktur object di sini. Cukup slice saja.
  // Ini menjaga agar object tetap sesuai dengan Interface Product
  const featuredFoods = products.slice(0, 14);

  const handleWhatsAppOrder = (productName: string) => {
    const message = `Halo, saya ingin memesan ${productName}. Bisa info lebih lanjut?`;
    const phoneNumber = '6281234567890';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleOrder = (food: Product) => {
    setSelectedFood(food);
    setShowOrderModal(true);
    setOrderForm({
      customer_name: '',
      customer_phone: '',
      quantity: 1
    });
    setOrderSuccess('');
    setOrderError('');
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFood) return;

    setOrderLoading(true);
    setOrderError('');
    setOrderSuccess('');

    try {
      const response = await api.post('/orders', {
        customer_name: orderForm.customer_name,
        customer_phone: orderForm.customer_phone,
        food_id: selectedFood.id,
        quantity: orderForm.quantity
      });

      if (response.data.success) {
        setOrderSuccess('Pesanan berhasil dibuat! Kami akan segera menghubungi Anda.');
        setTimeout(() => {
          setShowOrderModal(false);
        }, 3000);
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setOrderError(error.response?.data?.message || 'Terjadi kesalahan saat membuat pesanan.');
    } finally {
      setOrderLoading(false);
    }
  };

  const closeModal = () => {
    setShowOrderModal(false);
    setSelectedFood(null);
  };

  // Helper untuk format harga (Rupiah)
  const formatRupiah = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="hero-section text-white d-flex align-items-center justify-content-center position-relative overflow-hidden" style={{ minHeight: '90vh' }}>
        {/* Animated Background */}
        <div className="hero-bg">
          <div className="bg-layer bg-layer-1"></div>
          <div className="bg-layer bg-layer-2"></div>
          <div className="bg-layer bg-layer-3"></div>
        </div>

        {/* Floating Elements */}
        <div className="floating-elements">
          <div className="floating-item item-1">🍗</div>
          <div className="floating-item item-2">🌶️</div>
          <div className="floating-item item-3">🥔</div>
          <div className="floating-item item-4">⭐</div>
        </div>

        <div className="container position-relative z-index-2">
          <div className="row align-items-center">
            <div className="col-lg-6 slide-in-left mt-n4">
              <div className="hero-content mt-n3">
                <div className="hero-badge mb-4">
                  <span className="badge bg-warning text-white px-3 py-2 rounded-pill fs-6">
                    #1 Fried Chicken di Jakarta
                  </span>
                </div>

                <h1 className="display-4 fw-bold mb-2 mt-2 gradient-text">
                  {displayText}
                  <span className="typing-cursor">|</span>
                </h1>

                <p className="lead mb-4 fs-5 text-light lh-base">
                  Rasakan kelezatan ayam goreng dengan <strong>bumbu rahasia turun temurun</strong>.
                  Dibuat fresh setiap hari dengan standar kehalalan dan kualitas terbaik.
                </p>

                <div className="hero-actions d-flex gap-3 flex-wrap">
                  <Link href="#menu" className="btn btn-warning btn-xl px-4 py-3 fw-bold text-white shadow-lg hover-scale">
                    <span className="me-2"></span>
                    Jelajahi Menu
                  </Link>
                  <a
                    href="https://wa.me/6281234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success btn-xl px-4 py-3 fw-bold shadow-lg pulse-btn"
                  >
                    <span className="me-2"></span>
                    Pesan Sekarang
                  </a>
                </div>

                <div className="hero-rating mt-4">
                  <div className="d-flex align-items-center">
                    <div className="stars me-2">
                      ⭐⭐⭐⭐⭐
                    </div>
                    <span className="text-warning fw-bold">4.9/5</span>
                    <span className="text-light ms-2">• 2,500+ ulasan</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 mt-5 mt-lg-0 slide-in-right">
              <div className="hero-image-wrapper position-relative">
                <div className="hero-image-main">
                  <Image
                    src="/images/GambarSabana7.png"
                    alt="Sabana Fried Chicken"
                    width={1200}
                    height={800}
                    className="hero-main-image"
                    style={{ objectFit: "contain" }}
                    priority
                  />
                </div>

                {/* Floating Cards */}


                {/* Quick Stats */}
                <div className="hero-quick-stats">
                  <div className="stats-grid">
                    <div className="stat-item">
                      <div className="stat-number">1500+</div>
                      <div className="stat-label">Happy Customers</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">60+</div>
                      <div className="stat-label">Menu Items</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">4.9★</div>
                      <div className="stat-label">Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section id="menu" className="menu-section py-5 position-relative">
        <div className="menu-bg-decoration"></div>
        <div className="container position-relative">
          <div className="text-center mb-5" style={{ marginTop: '4rem' }}>
            <div className="section-badge mb-3">
              <span className="badge bg-primary text-white px-4 py-2 rounded-pill">
                Menu Andalan
              </span>
            </div>
            <h2 className="fw-bold display-4 mb-3 gradient-text-secondary">Menu Terfavorit</h2>
            <p className="text-muted lead fs-5">Pilihan menu terbaik yang selalu dinantikan pelanggan kami</p>
          </div>

          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Sedang memuat menu...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-warning text-center mx-auto" style={{ maxWidth: '500px' }}>
              <div className="fs-4">⚠️</div>
              <h5>Terjadi Kesalahan</h5>
              <p className="mb-3">{error}</p>
              <button
                onClick={fetchProducts}
                className="btn btn-primary btn-sm"
              >
                🔄 Coba Lagi
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="menu-cards-container">
                <div className="row g-4">
                  {featuredFoods.map((food, index) => (
                    <div key={food.id} className="col-md-6 col-lg-4">
                      <div className={`card h-100 shadow-sm border-0 product-card animate-card delay-${index % 3}`}>
                        <div
                          className="card-image-wrapper position-relative overflow-hidden"
                          style={{
                            height: '250px',
                            borderRadius: '15px 15px 0 0'
                          }}
                        >
                          <Image
                            // ✅ PERBAIKAN 2: Fallback Image langsung di JSX
                            src={food.image_url || '/images/placeholder-food.jpg'}
                            alt={food.name}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="(max-width: 400px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="card-image"
                          />
                          <div className="position-absolute top-0 end-0 m-3">
                            <span className="badge bg-success fs-6 px-3 py-2">{food.category}</span>
                          </div>
                          <div className="card-overlay">
                            <button
                              className="btn btn-primary btn-lg rounded-circle shadow-lg"
                              onClick={() => handleOrder(food)}
                            >
                              <span className="fs-4">🛒</span>
                            </button>
                          </div>
                        </div>
                        <div className="card-body d-flex flex-column p-4">
                          <h5 className="card-title fw-bold text-dark mb-2">{food.name}</h5>
                          <p className="card-text text-muted flex-grow-1 small">{food.description}</p>
                          <div className="d-flex justify-content-between align-items-center mt-3">
                            {/* ✅ PERBAIKAN 3: Format Harga di JSX */}
                            <span className="h4 mb-0 text-primary fw-bold">{formatRupiah(food.price)}</span>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-outline-primary btn-sm px-3"
                                onClick={() => handleOrder(food)}
                              >
                                <span className="me-1">📱</span>
                                Pesan
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {products.length === 0 && !loading && (
                <div className="text-center py-5">
                  <div className="fs-1 text-muted mb-3">📭</div>
                  <h5 className="text-muted">Menu sedang tidak tersedia</h5>
                  <p className="text-muted">Silakan hubungi kami untuk informasi menu terbaru</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5 position-relative">
        <div className="features-bg-pattern"></div>
        <div className="container position-relative">
          <div className="text-center mb-5">
            <div className="section-badge mb-3">
              <span className="badge bg-white px-4 py-2 rounded-pill shadow" style={{ color: '#d88c00ff' }}>
                Kenapa Memilih Kami?
              </span>
            </div>
            <h3 className="fw-bold display-5 mb-3 text-white">Keunggulan Sabana</h3>
            <p className="text-light lead fs-5 opacity-90">Komitmen kami untuk memberikan yang terbaik bagi pelanggan</p>
          </div>
          <div className="row g-4 mt-2">
            <div className="col-md-4">
              <div className="feature-card text-center h-100 hover-scale animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="feature-icon bg-white text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-4 shadow-lg pulse-glow"
                      style={{ width: '120px', height: '120px' }}>
                  <span className="fs-1">💳</span>
                </div>
                <h5 className="fw-bold text-white mb-3">Pembayaran Mudah</h5>
                <p className="text-light opacity-90 fs-6">Nikmati kemudahan transaksi dengan berbagai metode pembayaran digital dan tunai yang tersedia 24/7 untuk kenyamanan Anda</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card text-center h-100 hover-scale animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="feature-icon bg-white text-secondary rounded-circle d-inline-flex align-items-center justify-content-center mb-4 shadow-lg pulse-glow"
                      style={{ width: '120px', height: '120px' }}>
                  <span className="fs-1">⭐</span>
                </div>
                <h5 className="fw-bold text-white mb-3">Terpercaya</h5>
                <p className="text-light opacity-90 fs-6">Lebih dari 1500+ pelanggan puas dengan layanan kami yang selalu tepat waktu dan berkualitas tinggi</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card text-center h-100 hover-scale animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <div className="feature-icon bg-white text-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-4 shadow-lg pulse-glow"
                      style={{ width: '120px', height: '120px' }}>
                  <span className="fs-1">🏆</span>
                </div>
                <h5 className="fw-bold text-white mb-3">Kualitas Terbaik</h5>
                <p className="text-light opacity-90 fs-6">Setiap hidangan dibuat dengan bahan premium dan resep rahasia turun temurun yang telah teruji selama bertahun-tahun</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5 position-relative">
        <div className="stats-bg-animation"></div>
        <div className="container position-relative">
          <div className="row text-center">
            <div className="col-md-3 col-6 mb-4">
              <div className="stat-item">
                <div className="stat-number display-4 fw-bold text-white mb-2">1500+</div>
                <div className="stat-label text-light opacity-75 fs-5">Pelanggan Puas</div>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="stat-item">
                <div className="stat-number display-4 fw-bold text-white mb-2">60+</div>
                <div className="stat-label text-light opacity-75 fs-5">Menu Variasi</div>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="stat-item">
                <div className="stat-number display-4 fw-bold text-white mb-2">3+</div>
                <div className="stat-label text-light opacity-75 fs-5">Tahun Pengalaman</div>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="stat-item">
                <div className="stat-number display-4 fw-bold text-white mb-2">24/7</div>
                <div className="stat-label text-light opacity-75 fs-5">Layanan</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section with Leaflet Map */}
      <section id="contact" className="contact-section py-5 position-relative">
        <div className="contact-bg-pattern"></div>
        <div className="container position-relative">
          <div className="text-center mb-5">
            <div className="section-badge mb-3">
              <span className="badge bg-primary text-white px-4 py-2 rounded-pill">
                Lokasi & Kontak
              </span>
            </div>
            <h3 className="fw-bold display-5 mb-3 gradient-text-secondary">Kunjungi Kami</h3>
            <p className="text-muted lead fs-5">Kunjungi toko kami atau hubungi untuk pemesanan</p>
          </div>

          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="contact-card h-100">
                <h4 className="fw-bold mb-4 gradient-text-secondary">Hubungi Kami</h4>
                <div className="contact-info">
                  <div className="d-flex align-items-start mb-3 p-3 bg-light rounded-3 contact-item">
                    <span className="fs-2 me-3 text-primary">📍</span>
                    <div>
                      <strong className="d-block mb-1 text-dark">Alamat:</strong>
                      <p className="mb-0 text-muted">
                        Jl. Contoh No. 123, Jakarta Pusat, DKI Jakarta 10110
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start mb-3 p-3 bg-light rounded-3 contact-item">
                    <span className="fs-2 me-3 text-primary">📞</span>
                    <div>
                      <strong className="d-block mb-1 text-dark">Telepon:</strong>
                      <p className="mb-0 text-muted">
                        <a href="tel:+622112345678" className="text-decoration-none text-primary fw-bold">
                          (021) 1234-5678
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start mb-3 p-3 bg-light rounded-3 contact-item">
                    <span className="fs-2 me-3 text-success">📱</span>
                    <div>
                      <strong className="d-block mb-1 text-dark">WhatsApp:</strong>
                      <p className="mb-0 text-muted">
                        <a
                          href="https://wa.me/6281234567890"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none text-success fw-bold"
                        >
                          +62 812-3456-7890
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start mb-4 p-3 bg-light rounded-3 contact-item">
                    <span className="fs-2 me-3 text-warning"></span>
                    <div>
                      <strong className="d-block mb-1 text-dark">Jam Operasional:</strong>
                      <p className="mb-0 text-muted">
                        Senin - Jumat: 08:00 - 22:00 WIB<br />
                        Sabtu - Minggu: 09:00 - 23:00 WIB<br />
                        <span className="badge bg-success mt-1">Pesan Antar 24 Jam</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="map-container rounded-4 overflow-hidden shadow-lg">
                {/* Leaflet Map Component */}
                <LeafletMap
                  location={{
                    lat: -6.1705566665495395,               // Ganti dengan koordinat real Anda
                    lng: 106.7863817134934,             // Ganti dengan koordinat real Anda
                    title: 'Sabana Fried Chicken',
                    address: 'Jl. Contoh No. 123, Jakarta Pusat, DKI Jakarta 10110',
                    phone: '+62 812-3456-7890',
                    description: 'Toko kami buka setiap hari. Pesan antar tersedia 24 jam!'
                  }}
                  height="450px"
                  zoom={16}
                  enableScrollZoom={true}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Order Modal */}
      {showOrderModal && selectedFood && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Pesan {selectedFood.name}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <Image
                    // ✅ PERBAIKAN 4: Fallback Image di Modal
                    src={selectedFood.image_url || '/images/placeholder-food.jpg'}
                    alt={selectedFood.name}
                    width={200}
                    height={150}
                    className="img-fluid rounded"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <p className="text-muted">{selectedFood.description}</p>
                {/* ✅ PERBAIKAN 5: Format Harga di Modal */}
                <p className="h5 text-primary fw-bold">{formatRupiah(selectedFood.price)}</p>

                {orderSuccess && (
                  <div className="alert alert-success">{orderSuccess}</div>
                )}

                {orderError && (
                  <div className="alert alert-danger">{orderError}</div>
                )}

                <form onSubmit={handleSubmitOrder}>
                  <div className="mb-3">
                    <label htmlFor="customer_name" className="form-label">Nama Lengkap</label>
                    <input
                      type="text"
                      className="form-control"
                      id="customer_name"
                      value={orderForm.customer_name}
                      onChange={(e) => setOrderForm({...orderForm, customer_name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="customer_phone" className="form-label">Nomor Telepon</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="customer_phone"
                      value={orderForm.customer_phone}
                      onChange={(e) => setOrderForm({...orderForm, customer_phone: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="quantity" className="form-label">Jumlah</label>
                    <input
                      type="number"
                      className="form-control"
                      id="quantity"
                      min="1"
                      value={orderForm.quantity}
                      onChange={(e) => setOrderForm({
                        ...orderForm, 
                        quantity: parseInt(e.target.value) || 1 
                      })}
                      required
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary" disabled={orderLoading}>
                      {orderLoading ? 'Memproses...' : 'Pesan Sekarang'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}