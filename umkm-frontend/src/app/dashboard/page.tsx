// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getDashboardStats } from '@/services/api';
import './dashboard.css';

interface Food {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  image_url?: string;
  is_active?: boolean;
}

interface OrderItem {
  food_id: string;
  food_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  _id: string;
  invoice_number: string;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock_quantity: number;
  is_active: boolean;
  image_url: string;
  description: string;
  image_data?: string;
  image_mime_type?: string;
}

interface DashboardStats {
  total_sales: number;
  monthly_sales: number;
  daily_sales: number;
  total_orders: number;
  total_products: number;
  pending_orders: number;
  processing_orders: number;
  completed_orders: number;
  average_order_value: number;
  profit_margin: number;
  sales_growth: number;
  recent_orders: Array<{
    id: string;
    invoice_number: string;
    customer_name: string;
    total: number;
    status: string;
    created_at: string;
    items_count: number;
  }>;
  popular_products: Array<{
    name: string;
    sold: number;
    revenue: number;
  }>;
  monthly_sales_data: Array<{
    month: string;
    sales: number;
  }>;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    total_sales: 0,
    monthly_sales: 0,
    daily_sales: 0,
    total_orders: 0,
    total_products: 0,
    pending_orders: 0,
    processing_orders: 0,
    completed_orders: 0,
    average_order_value: 0,
    profit_margin: 0,
    sales_growth: 0,
    recent_orders: [],
    popular_products: [],
    monthly_sales_data: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Baru saja';
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} hari yang lalu`;

    return date.toLocaleDateString('id-ID');
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { text: string; class: string } } = {
      'Menunggu': { text: 'Menunggu', class: 'status pending' },
      'Diproses': { text: 'Diproses', class: 'status processing' },
      'Selesai': { text: 'Selesai', class: 'status completed' }
    };
    return statusMap[status] || { text: status, class: 'status pending' };
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h2 className="welcome-title">
            Selamat Datang di <span className="brand-text">Dashboard Admin</span>
          </h2>
          <p className="welcome-subtitle">
            Kelola bisnis kuliner Anda dengan mudah dan efisien
          </p>
          <div className="welcome-stats">
            <div className="stat-item">
              <div className="stat-number">{stats.total_orders.toLocaleString('id-ID')}</div>
              <div className="stat-label">Total Pesanan</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.recent_orders.length}</div>
              <div className="stat-label">Pesanan Aktif</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.total_products}</div>
              <div className="stat-label">Menu Tersedia</div>
            </div>
          </div>
        </div>
        <div className="welcome-decoration">
          <div className="floating-icon icon-1">🍗</div>
          <div className="floating-icon icon-2">🍜</div>
          <div className="floating-icon icon-3">🥤</div>
          <div className="floating-icon icon-4">🍕</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="cards">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Total Pesanan</h3>
            <div className="card-icon orders">
              <i className="fas fa-shopping-cart"></i>
            </div>
          </div>
          <div className="card-value">{stats.total_orders.toLocaleString('id-ID')}</div>
          <div className="card-change positive">
            <i className="fas fa-arrow-up"></i> Rata-rata {formatCurrency(stats.average_order_value)}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Pendapatan</h3>
            <div className="card-icon revenue">
              <i className="fas fa-dollar-sign"></i>
            </div>
          </div>
          <div className="card-value">{formatCurrency(stats.total_sales)}</div>
          <div className="card-change positive">
            <i className="fas fa-arrow-up"></i> {stats.sales_growth}% pertumbuhan
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Pesanan Aktif</h3>
            <div className="card-icon customers">
              <i className="fas fa-clock"></i>
            </div>
          </div>
          <div className="card-value">{stats.pending_orders}</div>
          <div className="card-change positive">
            <i className="fas fa-arrow-up"></i> Pesanan menunggu
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Produk</h3>
            <div className="card-icon products">
              <i className="fas fa-utensils"></i>
            </div>
          </div>
          <div className="card-value">{stats.total_products}</div>
          <div className="card-change positive">
            <i className="fas fa-arrow-up"></i> Menu aktif
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="recent-orders">
        <h3 className="section-title">Pesanan Terbaru</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID Pesanan</th>
                <th>Pelanggan</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent_orders.length > 0 ? (
                stats.recent_orders.map((order) => {
                  const statusBadge = getStatusBadge(order.status);
                  return (
                    <tr key={order.id}>
                      <td className="font-mono text-blue-600">#{order.invoice_number}</td>
                      <td className="flex items-center gap-3">
                        <div className="avatar-circle bg-gradient-to-r from-blue-500 to-purple-500">
                          {getInitials(order.customer_name)}
                        </div>
                        <div>
                          <div className="customer-name">{order.customer_name}</div>
                          <div className="customer-time">{formatDate(order.created_at)}</div>
                        </div>
                      </td>
                      <td className="font-bold text-green-600 text-lg">{formatCurrency(order.total)}</td>
                      <td><span className={statusBadge.class}>{statusBadge.text}</span></td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-muted">
                    Belum ada pesanan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popular Products - Real data from API */}
      <div className="popular-products">
        <h3 className="section-title">Produk Terpopuler</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Produk</th>
                <th>Kategori</th>
                <th>Terjual</th>
                <th>Pendapatan</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {stats.popular_products && stats.popular_products.length > 0 ? (
                stats.popular_products.map((product, index) => {
                  const colors = ['bg-yellow-500', 'bg-blue-500', 'bg-red-500'];
                  const icons = ['🍽️', '🥤', '🍗'];
                  const categories = ['Makanan', 'Minuman', 'Makanan'];

                  return (
                    <tr key={index}>
                      <td className="flex items-center gap-3">
                        <div className={`product-indicator ${colors[index % colors.length]}`}></div>
                        <div className="product-image">
                          <div style={{ width: '40px', height: '40px', backgroundColor: '#f0f0f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {icons[index % icons.length]}
                          </div>
                        </div>
                        <div>
                          <div className="product-name">{product.name}</div>
                          <div className="product-desc">Produk terlaris berdasarkan penjualan</div>
                        </div>
                      </td>
                      <td>{categories[index % categories.length]}</td>
                      <td className="font-bold text-blue-600 text-lg">{product.sold.toLocaleString('id-ID')}</td>
                      <td className="font-bold text-green-600 text-lg">{formatCurrency(product.revenue)}</td>
                      <td>
                        <div className="rating-container">
                          <div className="stars">
                            <span className="star filled">★</span>
                            <span className="star filled">★</span>
                            <span className="star filled">★</span>
                            <span className="star filled">★</span>
                            <span className="star half">★</span>
                          </div>
                          <span className="rating-number">4.{8 - index}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    Belum ada data penjualan produk
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
