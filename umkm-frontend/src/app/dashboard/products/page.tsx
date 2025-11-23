// src/app/dashboard/products/page.tsx
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { getAdminFoods, createAdminFood, updateAdminFood, deleteAdminFood } from '../../../services/api';

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


export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [formData, setFormData] = useState({
    name: '',
    category: 'Makanan',
    price: '',
    stock: '',
    description: '',
    image: null as File | null
  });

  const categories = ['Semua', 'Makanan', 'Minuman', 'Snack', 'Dessert'];

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getAdminFoods();
      setProducts(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(lower) ||
                           product.description.toLowerCase().includes(lower);
      const matchesCategory = selectedCategory === 'Semua' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('stock_quantity', formData.stock);
      formDataToSend.append('is_active', '1');

      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await createAdminFood(formDataToSend);

      setProducts([...products, response.data.data]);
      setFormData({ name: '', category: 'Makanan', price: '', stock: '', description: '', image: null });
      setShowForm(false);
    } catch (err) {
      console.error('Error adding product:', err);
      alert('Failed to add product');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditProduct = useCallback((product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock_quantity.toString(),
      description: product.description,
      image: null
    });
    setShowForm(true);
  }, []);

  // Utility: normalize id from various shapes returned by backend (MongoDB _id or id)
  const getProductId = (product: unknown): string | null => {
    if (!product) return null;
    const obj = product as Record<string, unknown>;
    // id
    if ('id' in obj && obj['id']) return String(obj['id']);
    // _id as string
    if ('_id' in obj && typeof obj['_id'] === 'string') return String(obj['_id']);
    // _id as object (MongoDB with $oid)
    if ('_id' in obj && obj['_id'] && typeof obj['_id'] === 'object') {
      const maybeOid = (obj['_id'] as Record<string, unknown>)['$oid'];
      if (maybeOid) return String(maybeOid);
      return String(obj['_id']);
    }
    return null;
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const editingId = getProductId(editingProduct);
    if (!editingId) {
      alert('ID produk tidak valid');
      return;
    }
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('stock_quantity', formData.stock);
      formDataToSend.append('is_active', editingProduct.is_active ? '1' : '0');

      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await updateAdminFood(editingId, formDataToSend);

      const updated = response.data?.data ?? null;
      // replace product in list using normalized id
      setProducts(products.map(p => {
        const pid = getProductId(p);
        if (pid === editingId) return updated || {...p, ...formData};
        return p;
      }));
      setFormData({ name: '', category: 'Makanan', price: '', stock: '', description: '', image: null });
      setEditingProduct(null);
      setShowForm(false);
      alert('Menu berhasil diupdate!');
    } catch (err) {
      console.error('Error updating product:', err);
      alert('Gagal mengupdate menu. Silakan coba lagi.');
    }
  };

  const handleDeleteProduct = useCallback(async (product: unknown) => {
    if (!confirm('Apakah Anda yakin ingin menghapus menu ini?')) return;

    try {
      const normalizedId = getProductId(product);
      if (!normalizedId) {
        alert('ID produk tidak valid');
        return;
      }

      await deleteAdminFood(normalizedId);
      // update state immutably
      setProducts(prev => prev.filter(p => getProductId(p) !== normalizedId));
      alert('Menu berhasil dihapus!');
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Gagal menghapus menu. Silakan coba lagi.');
    }
  }, []);

  // Prefer the stored public URL (smaller), fallback to base64 data only if URL missing
  const getProductImage = (product: Product) => {
    if (product.image_url) return product.image_url;
    if (product.image_data && product.image_mime_type) {
      return `data:${product.image_mime_type};base64,${product.image_data}`;
    }
    return '/images/default-food.jpg';
  };

  // Small memoized row to avoid re-rendering whole table on unrelated state changes
  const ProductRow = ({ product }: { product: Product }) => {
    const status = product.is_active && product.stock_quantity > 0 ? 'Tersedia' : 'Habis';
    const pid = String(getProductId(product) ?? '');
    return (
      <tr key={pid}>
        <td className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getProductImage(product)}
            alt={product.name}
            width={48}
            height={48}
            loading="lazy"
            decoding="async"
            className="w-12 h-12 rounded-md object-cover"
          />
          <div className="product-id">#{pid?.slice(-3)}</div>
          <div className="font-bold text-gray-900">{product.name}</div>
        </td>
        <td>
          <span className={`category-badge ${product.category.toLowerCase()}`}>
            <span className="badge-dot"></span>
            {product.category}
          </span>
        </td>
        <td>
          <div className="price-text">Rp {product.price.toLocaleString('id-ID')}</div>
          <div className="price-label">per porsi</div>
        </td>
        <td>
          <div className="flex items-center gap-2">
            <div className={`stock-circle ${product.stock_quantity > 10 ? 'high' : product.stock_quantity > 5 ? 'medium' : 'low'}`}>
              {product.stock_quantity}
            </div>
            <div className="stock-label">unit</div>
          </div>
        </td>
        <td>
          <span className={`status-badge ${status === 'Tersedia' ? 'available' : 'unavailable'}`}>
            <div className={`status-dot ${status === 'Tersedia' ? 'available' : 'unavailable'}`}></div>
            {status}
          </span>
        </td>
        <td>
          <div className="action-buttons">
            <button
              onClick={() => handleEditProduct(product)}
              className="edit-button"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => handleDeleteProduct(product)}
              className="delete-button"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Hapus
            </button>
          </div>
        </td>
      </tr>
    );
  };

  const totalProducts = products.length;
  const availableProducts = products.filter(p => p.is_active && p.stock_quantity > 0).length;
  const outOfStockProducts = products.filter(p => p.stock_quantity === 0).length;

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h2 className="welcome-title">
            Manajemen <span className="brand-text">Menu</span>
          </h2>
          <p className="welcome-subtitle">
            Kelola menu restoran Anda dengan mudah dan efisien
          </p>
          <div className="welcome-stats">
            <div className="stat-item">
              <div className="stat-number">{totalProducts}</div>
              <div className="stat-label">Total Menu</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{availableProducts}</div>
              <div className="stat-label">Tersedia</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{outOfStockProducts}</div>
              <div className="stat-label">Habis</div>
            </div>
          </div>
        </div>
        <div className="welcome-decoration">
          <div className="floating-icon icon-1">🍽️</div>
          <div className="floating-icon icon-2">🥗</div>
          <div className="floating-icon icon-3">🥤</div>
          <div className="floating-icon icon-4">🍰</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="cards">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Total Menu</h3>
            <div className="card-icon orders">
              <i className="fas fa-utensils"></i>
            </div>
          </div>
          <div className="card-value">{totalProducts}</div>
          <div className="card-change positive">
            <i className="fas fa-arrow-up"></i> Menu aktif
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Menu Tersedia</h3>
            <div className="card-icon revenue">
              <i className="fas fa-check-circle"></i>
            </div>
          </div>
          <div className="card-value">{availableProducts}</div>
          <div className="card-change positive">
            <i className="fas fa-arrow-up"></i> {Math.round((availableProducts/totalProducts)*100)}% tersedia
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Menu Habis</h3>
            <div className="card-icon customers">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
          </div>
          <div className="card-value">{outOfStockProducts}</div>
          <div className="card-change negative">
            <i className="fas fa-arrow-down"></i> Perlu restock
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Kategori</h3>
            <div className="card-icon products">
              <i className="fas fa-tags"></i>
            </div>
          </div>
          <div className="card-value">{categories.length - 1}</div>
          <div className="card-change positive">
            <i className="fas fa-arrow-up"></i> Kategori menu
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-4 text-gray-600">Memuat data menu...</div>
      )}

      {error && (
        <div className="text-center py-2 text-red-500">{error}</div>
      )}

      {/* Search and Filter Section */}
      <div className="products-search">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari menu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <div className="search-icon">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <button
              className="add-button"
              onClick={() => {
                setEditingProduct(null);
                setFormData({ name: '', category: 'Makanan', price: '', stock: '', description: '', image: null });
                setShowForm(true);
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Tambah Menu
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl border border-orange-200 animate-slideIn">
            <div className="p-8 border-b border-orange-200 bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 rounded-t-3xl">
              <h3 className="text-2xl font-bold text-white">{editingProduct ? 'Edit Menu' : 'Tambah Menu Baru'}</h3>
              <p className="text-orange-100 text-sm mt-2">Kelola informasi menu dengan lengkap</p>
            </div>
            <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-3">Nama Menu</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 transition-all duration-300 text-base"
                    required
                    placeholder="Masukkan nama menu"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-3">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 transition-all duration-300 text-base"
                  >
                    <option value="Makanan">🍽️ Makanan</option>
                    <option value="Minuman">🥤 Minuman</option>
                    <option value="Snack">🍿 Snack</option>
                    <option value="Dessert">🍰 Dessert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Harga</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 transition-all duration-300 text-base"
                    required
                    min="0"
                    placeholder="Rp"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Stok</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 transition-all duration-300 text-base"
                    required
                    min="0"
                    placeholder="Jumlah"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-3">Deskripsi</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 transition-all duration-300 resize-none text-base"
                    rows={4}
                    placeholder="Deskripsikan menu ini..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-3">Upload Gambar</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({...formData, image: e.target.files?.[0] || null})}
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 transition-all duration-300 text-base file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  />
                  <p className="text-sm text-gray-500 mt-2">Format: JPG, PNG, GIF. Maksimal 2MB</p>
                </div>
              </div>
              <div className="flex gap-4 justify-end pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                    setFormData({ name: '', category: 'Makanan', price: '', stock: '', description: '', image: null });
                  }}
                  className="px-8 py-4 text-gray-600 border-2 border-gray-300 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-bold text-base"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 text-white rounded-2xl hover:from-orange-500 hover:via-red-500 hover:to-red-600 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-base"
                >
                  {editingProduct ? 'Update Menu' : 'Simpan Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>Nama Menu</th>
              <th>Kategori</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <ProductRow key={String(getProductId(product) ?? '')} product={product} />
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Tidak ada menu yang tersedia. Silakan tambah menu baru.
        </div>
      )}
    </div>
  );
}
