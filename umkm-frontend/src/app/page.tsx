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

  // FIXED: price = number, added price_text for UI
  const featuredFoods = products.slice(0, 14).map(product => ({
    id: product.id,
    name: product.name,
    price: product.price,
    price_text: `Rp ${product.price.toLocaleString('id-ID')}`,
    image_url: product.image_url || '/images/placeholder-food.jpg',
    description: product.description,
    category: product.category,
    created_at: product.created_at,
    updated_at: product.updated_at
  }));

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

  return (
    <div className="fade-in">

      {/* Hero Section */}
      <section className="hero-section text-white d-flex align-items-center justify-content-center position-relative overflow-hidden" style={{ minHeight: '90vh' }}>
        <div className="hero-bg">
          <div className="bg-layer bg-layer-1"></div>
          <div className="bg-layer bg-layer-2"></div>
          <div className="bg-layer bg-layer-3"></div>
        </div>

        <div className="container position-relative z-index-2">
          <div className="row align-items-center">
            <div className="col-lg-6 slide-in-left mt-n4">
              <div className="hero-content mt-n3">
                <h1 className="display-4 fw-bold mb-2 mt-2 gradient-text">
                  {displayText}
                  <span className="typing-cursor">|</span>
                </h1>
                <p className="lead mb-4 fs-5 text-light lh-base">
                  Rasakan kelezatan ayam goreng dengan <strong>bumbu rahasia turun temurun</strong>.
                </p>
                <div className="hero-actions d-flex gap-3 flex-wrap">
                  <Link href="#menu" className="btn btn-warning btn-xl px-4 py-3 fw-bold text-white shadow-lg hover-scale">
                    Jelajahi Menu
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-6 mt-5 mt-lg-0 slide-in-right">
              <div className="hero-image-wrapper position-relative">
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
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu */}
      <section id="menu" className="menu-section py-5 position-relative">
        <div className="container position-relative">

          {!loading && !error && (
            <div className="menu-cards-container">
              <div className="row g-4">
                {featuredFoods.map((food, index) => (
                  <div key={food.id} className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm border-0 product-card">
                      <div className="card-image-wrapper position-relative overflow-hidden" style={{ height: '250px', borderRadius: '15px 15px 0 0' }}>
                        <Image
                          src={food.image_url}
                          alt={food.name}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="(max-width: 400px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="card-image"
                        />
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

                        {/* FIXED: Harga pakai price_text */}
                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <span className="h4 mb-0 text-primary fw-bold">{food.price_text}</span>

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
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* --- Modal Pemesanan --- */}
      {showOrderModal && selectedFood && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Pesan {selectedFood.name}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>

              <div className="modal-body">
                <Image
                  src={selectedFood.image_url}
                  alt={selectedFood.name}
                  width={200}
                  height={150}
                  className="img-fluid rounded mb-3"
                  style={{ objectFit: 'cover' }}
                />

                <p className="text-muted">{selectedFood.description}</p>
                <p className="h5 text-primary fw-bold">{selectedFood.price_text}</p>

                {orderSuccess && <div className="alert alert-success">{orderSuccess}</div>}
                {orderError && <div className="alert alert-danger">{orderError}</div>}

                <form onSubmit={handleSubmitOrder}>
                  <div className="mb-3">
                    <label className="form-label">Nama Lengkap</label>
                    <input
                      type="text"
                      className="form-control"
                      value={orderForm.customer_name}
                      onChange={(e) => setOrderForm({ ...orderForm, customer_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Nomor Telepon</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={orderForm.customer_phone}
                      onChange={(e) => setOrderForm({ ...orderForm, customer_phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Jumlah</label>
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      value={orderForm.quantity}
                      onChange={(e) => setOrderForm({ ...orderForm, quantity: Number(e.target.value) })}
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
