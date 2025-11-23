// ==============================
// FULL FIXED VERSION page.tsx
// ==============================

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
  image_url: string;
  created_at?: string;
  updated_at?: string;
  price_text?: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [displayText, setDisplayText] = useState('');
  const fullText = 'Sabana Fried Chicken';

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

  // typing animation
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // fetch menu
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/foods');
      setProducts(response.data.data || []);
    } catch (err) {
      setError('Gagal memuat data menu.');
    } finally {
      setLoading(false);
    }
  };

  // create featured foods properly
  const featuredFoods = products.map(product => ({
    id: product.id,
    name: product.name,
    price: product.price,
    price_text: `Rp ${product.price.toLocaleString('id-ID')}`,
    image_url: product.image_url || '/images/placeholder-food.jpg',
    description: product.description,
    category: product.category,
  }));

  const handleOrder = (food: Product) => {
    setSelectedFood(food);
    setShowOrderModal(true);
    setOrderSuccess('');
    setOrderError('');
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFood) return;

    setOrderLoading(true);
    setOrderSuccess('');
    setOrderError('');

    try {
      const response = await api.post('/orders', {
        customer_name: orderForm.customer_name,
        customer_phone: orderForm.customer_phone,
        food_id: selectedFood.id,
        quantity: orderForm.quantity
      });

      if (response.data.success) {
        setOrderSuccess('Pesanan berhasil dibuat!');
        setTimeout(() => setShowOrderModal(false), 2000);
      }
    } catch (err) {
      setOrderError('Terjadi kesalahan saat membuat pesanan.');
    } finally {
      setOrderLoading(false);
    }
  };

  const closeModal = () => {
    setShowOrderModal(false);
    setSelectedFood(null);
  };

  return (
    <div className="fade-in">

      {/* ======================== HERO SECTION ======================== */}
      <section className="hero-section text-white d-flex align-items-center justify-content-center position-relative overflow-hidden" style={{ minHeight: '90vh' }}>

        <div className="container position-relative z-index-2">
          <div className="row align-items-center">
            <div className="col-lg-6 slide-in-left">
              <h1 className="display-4 fw-bold gradient-text">{displayText}<span className="typing-cursor">|</span></h1>
              <p className="lead text-light">Rasakan ayam goreng terbaik dengan bumbu spesial.</p>

              <Link href="#menu" className="btn btn-warning btn-lg shadow-lg mt-3">Jelajahi Menu</Link>
            </div>

            <div className="col-lg-6 slide-in-right">
              <Image src="/images/GambarSabana7.png" alt="Sabana" width={1200} height={800} priority />
            </div>
          </div>
        </div>
      </section>

      {/* ======================== MENU TERFAVORIT ======================== */}
      <section id="menu" className="menu-section py-5">

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
            <p className="mt-3 text-muted">Memuat menu...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-warning text-center mx-auto" style={{ maxWidth: '600px' }}>
            <div className="fw-bold mb-2">Gagal Memuat Data</div>
            <p>{error}</p>
            <button onClick={fetchProducts} className="btn btn-primary btn-sm">Coba Lagi</button>
          </div>
        )}

        {/* SECTION SELALU MUNCUL meskipun error */}
        {!loading && (
          <>
            <div className="text-center mb-5">
              <span className="badge bg-primary px-4 py-2 rounded-pill">Menu Andalan</span>
              <h2 className="fw-bold display-5 mt-3">Menu Terfavorit</h2>
              <p className="text-muted">Pilihan menu terbaik dari pelanggan kami</p>
            </div>

            <div className="container">
              <div className="row g-4">
                {featuredFoods.length > 0 ? (
                  featuredFoods.map(food => (
                    <div key={food.id} className="col-md-6 col-lg-4">
                      <div className="card h-100 shadow border-0">
                        <div className="position-relative" style={{ height: '250px' }}>
                          <Image src={food.image_url} alt={food.name} fill className="object-cover rounded-top" />
                          <div className="card-overlay">
                            <button className="btn btn-primary rounded-circle" onClick={() => handleOrder(food)}>🛒</button>
                          </div>
                        </div>
                        <div className="card-body">
                          <h5>{food.name}</h5>
                          <p className="text-muted small">{food.description}</p>
                          <div className="d-flex justify-content-between">
                            <span className="h5 text-primary">{food.price_text}</span>
                            <button className="btn btn-outline-primary btn-sm" onClick={() => handleOrder(food)}>Pesan</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5 text-muted">Tidak ada menu tersedia.</div>
                )}
              </div>
            </div>
          </>
        )}
      </section>

      {/* ======================== KEUNGGULAN SABANA ======================== */}
      <section className="features-section py-5 bg-orange">
        <div className="container text-center">
          <h2 className="fw-bold display-5 text-white">Keunggulan Sabana</h2>
          <p className="text-light mb-5">Komitmen terbaik untuk pelanggan kami</p>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card">💳 Pembayaran Mudah</div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">⭐ Terpercaya</div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">🏆 Kualitas Terbaik</div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== KUNJUNGI KAMI ======================== */}
      <section id="contact" className="contact-section py-5">
        <div className="container text-center">
          <span className="badge bg-primary px-4 py-2 rounded-pill">Lokasi & Kontak</span>
          <h2 className="fw-bold display-5 mt-3">Kunjungi Kami</h2>

          <div className="row mt-4">
            <div className="col-lg-6">
              <div className="p-4 bg-light rounded shadow">
                <h4>Hubungi Kami</h4>
                <p><strong>Alamat:</strong> Jl. Contoh No. 123, Jakarta Pusat</p>
                <p><strong>Telepon:</strong> (021) 1234-5678</p>
                <p><strong>WhatsApp:</strong> 0812-3456-7890</p>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="rounded overflow-hidden shadow">
                <LeafletMap
                  location={{
                    lat: -6.1705566,
                    lng: 106.7863817,
                    title: 'Sabana Fried Chicken',
                    address: 'Jl. Contoh No. 123, Jakarta Pusat',
                    phone: '+62 812-3456-7890',
                    description: 'Buka setiap hari'
                  }}
                  height="450px"
                  zoom={16}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== MODAL PESAN ======================== */}
      {showOrderModal && selectedFood && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Pesan {selectedFood.name}</h5>
                <button className="btn-close" onClick={closeModal}></button>
              </div>

              <div className="modal-body">
                <Image src={selectedFood.image_url} alt={selectedFood.name} width={200} height={150} className="rounded" />
                <p className="mt-2">{selectedFood.description}</p>
                <p className="h5 text-primary">{selectedFood.price_text}</p>

                {orderSuccess && <div className="alert alert-success">{orderSuccess}</div>}
                {orderError && <div className="alert alert-danger">{orderError}</div>}

                <form onSubmit={handleSubmitOrder}>
                  <input className="form-control mb-2" placeholder="Nama" required
                    onChange={(e) => setOrderForm({...orderForm, customer_name: e.target.value})} />

                  <input className="form-control mb-2" placeholder="Telepon" required
                    onChange={(e) => setOrderForm({...orderForm, customer_phone: e.target.value})} />

                  <input type="number" min="1" className="form-control mb-3" placeholder="Jumlah" required
                    onChange={(e) => setOrderForm({...orderForm, quantity: Number(e.target.value)})} />

                  <button className="btn btn-primary" disabled={orderLoading}>
                    {orderLoading ? 'Memproses...' : 'Pesan Sekarang'}
                  </button>
                  <button type="button" className="btn btn-secondary ms-2" onClick={closeModal}>Batal</button>
                </form>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
