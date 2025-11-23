// src/app/dashboard/invoices/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { getInvoices, getAdminFoods, createOrder, updateInvoice, updateInvoiceStatus } from '../../../services/api';

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
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export default function InvoicesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderForm, setOrderForm] = useState({
    customer_name: '',
    customer_phone: '',
    items: [] as Array<{ food_id: string; quantity: number; price: number }>
  });
  const [selectedFood, setSelectedFood] = useState('');
  const [quantity, setQuantity] = useState(1);

  const [filterStatus, setFilterStatus] = useState('Semua Status');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invoicesResponse = await getInvoices();
        const foodsResponse = await getAdminFoods();

        if (invoicesResponse.data.success) {
          setOrders(invoicesResponse.data.data);
        }

        if (foodsResponse.data.success) {
          setFoods(foodsResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    console.log(`Attempting to update status for order ${orderId} to ${newStatus}`);

    try {
      const response = await updateInvoiceStatus(orderId, newStatus);
      console.log('API Response:', response);

      if (response.data && response.data.success) {
        console.log('Status update successful, updating local state');
        setOrders(orders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        alert(`Status pesanan berhasil diperbarui ke "${newStatus}" dan tersimpan di database!`);
      } else {
        console.error('API returned success=false:', response.data);
        alert(`Gagal memperbarui status pesanan: ${response.data?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);

      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error('Response data:', axiosError.response.data);
        console.error('Response status:', axiosError.response.status);
        alert(`Gagal memperbarui status pesanan. Server error: ${axiosError.response.status}`);
      } else if (axiosError.request) {
        console.error('No response received:', axiosError.request);
        alert('Gagal memperbarui status pesanan. Tidak ada respons dari server.');
      } else {
        console.error('Request setup error:', axiosError.message);
        alert(`Gagal memperbarui status pesanan: ${axiosError.message}`);
      }
    }
  };

  const addItemToOrder = () => {
    if (!selectedFood || quantity <= 0) return;

    const food = foods.find(f => f.id === selectedFood);
    if (!food) return;

    const existingItemIndex = orderForm.items.findIndex(item => item.food_id === selectedFood);

    if (existingItemIndex >= 0) {
      // Update quantity if item already exists
      const updatedItems = [...orderForm.items];
      updatedItems[existingItemIndex].quantity += quantity;
      setOrderForm({ ...orderForm, items: updatedItems });
    } else {
      // Add new item
      setOrderForm({
        ...orderForm,
        items: [...orderForm.items, {
          food_id: selectedFood,
          quantity,
          price: food.price
        }]
      });
    }

    setSelectedFood('');
    setQuantity(1);
  };

  const removeItemFromOrder = (foodId: string) => {
    setOrderForm({
      ...orderForm,
      items: orderForm.items.filter(item => item.food_id !== foodId)
    });
  };

  const handleCreateOrder = async () => {
    if (!orderForm.customer_name || !orderForm.customer_phone || orderForm.items.length === 0) {
      alert('Harap isi semua field dan tambahkan setidaknya satu item');
      return;
    }

    try {
      const response = await createOrder(orderForm);
      if (response.data.success) {
        setOrders([response.data.data, ...orders]);
        setOrderForm({ customer_name: '', customer_phone: '', items: [] });
        setShowOrderForm(false);
        alert('Pesanan berhasil dibuat!');
      }
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal membuat pesanan';
      alert(message);
    }
  };

  const filteredOrders = filterStatus === 'Semua Status'
    ? orders
    : orders.filter(order => order.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selesai': return 'from-green-500 to-emerald-500';
      case 'Diproses': return 'from-blue-500 to-cyan-500';
      case 'Menunggu': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'Selesai': return 'from-green-100 to-emerald-100 text-green-800 border-green-300';
      case 'Diproses': return 'from-blue-100 to-cyan-100 text-blue-800 border-blue-300';
      case 'Menunggu': return 'from-yellow-100 to-orange-100 text-yellow-800 border-yellow-300';
      default: return 'from-gray-100 to-gray-200 text-gray-800 border-gray-300';
    }
  };

  return (
    <div>
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h2 className="welcome-title">
            Manajemen <span className="brand-text">Pesanan</span>
          </h2>
          <p className="welcome-subtitle">
            Kelola semua pesanan pelanggan dengan mudah dan efisien
          </p>
          <div className="welcome-stats">
            <div className="stat-item">
              <div className="stat-number">{orders.length}</div>
              <div className="stat-label">Total Pesanan</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{orders.filter(o => o.status === 'Menunggu').length}</div>
              <div className="stat-label">Menunggu</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{orders.filter(o => o.status === 'Diproses').length}</div>
              <div className="stat-label">Diproses</div>
            </div>
          </div>
        </div>
        <div className="welcome-decoration">
          <div className="floating-icon icon-1">📋</div>
          <div className="floating-icon icon-2">🛒</div>
          <div className="floating-icon icon-3">✅</div>
          <div className="floating-icon icon-4">🚚</div>
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
          <div className="card-value">{orders.length}</div>
            <div className="card-actions mt-3 flex gap-2">
              <button
                onClick={async () => {
                  // Quick create an order using first available active food
                  const activeFood = foods.find(f => f.is_active) || foods[0];
                  if (!activeFood) {
                    alert('Tidak ada menu tersedia untuk membuat pesanan cepat');
                    return;
                  }

                  const payload = {
                    customer_name: 'Walk-in Demo',
                    customer_phone: '081234567890',
                    items: [
                      {
                        food_id: activeFood.id,
                        quantity: 1,
                        price: activeFood.price
                      }
                    ]
                  };

                  try {
                    const resp = await createOrder(payload);
                    if (resp.data?.success) {
                      setOrders([resp.data.data, ...orders]);
                      alert('Pesanan demo berhasil dibuat dan disimpan ke database');
                    } else {
                      alert('Gagal membuat pesanan demo');
                    }
                  } catch (err) {
                    console.error('Error creating quick order', err);
                    alert('Terjadi kesalahan saat membuat pesanan demo');
                  }
                }}
                className="px-3 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
              >
                Buat Pesanan Cepat
              </button>
            </div>
          <div className="card-change positive">
            <i className="fas fa-arrow-up"></i> {orders.filter(o => o.status === 'Selesai').length} selesai
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Pendapatan</h3>
            <div className="card-icon revenue">
              <i className="fas fa-dollar-sign"></i>
            </div>
          </div>
          <div className="card-value">Rp {orders.reduce((sum, order) => sum + order.total_amount, 0).toLocaleString('id-ID')}</div>
          <div className="card-change positive">
            <i className="fas fa-arrow-up"></i> {Math.round((orders.filter(o => o.status === 'Selesai').length / orders.length) * 100)}% konversi
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Menunggu</h3>
            <div className="card-icon customers">
              <i className="fas fa-clock"></i>
            </div>
          </div>
          <div className="card-value">{orders.filter(o => o.status === 'Menunggu').length}</div>
          <div className="card-change negative">
            <i className="fas fa-exclamation-triangle"></i> Perlu perhatian
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Selesai</h3>
            <div className="card-icon products">
              <i className="fas fa-check-circle"></i>
            </div>
          </div>
          <div className="card-value">{orders.filter(o => o.status === 'Selesai').length}</div>
          <div className="card-change positive">
            <i className="fas fa-arrow-up"></i> Hari ini
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="card">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Filter Pesanan</h3>
            <p className="text-gray-600">Pilih status pesanan yang ingin ditampilkan</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowOrderForm(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 border-2 border-green-400"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Buat Pesanan Baru
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Filter Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white shadow-sm"
              >
                <option>Semua Status</option>
                <option>Menunggu</option>
                <option>Diproses</option>
                <option>Selesai</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="invoices-table-container">
        <table>
          <thead className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
            <tr>
              <th className="text-left text-sm font-bold uppercase tracking-wider">
                ID Pesanan
              </th>
              <th className="text-left text-sm font-bold uppercase tracking-wider">
                Pelanggan
              </th>
              <th className="text-left text-sm font-bold uppercase tracking-wider">
                Tanggal
              </th>
              <th className="text-left text-sm font-bold uppercase tracking-wider">
                Total
              </th>
              <th className="text-left text-sm font-bold uppercase tracking-wider">
                Status
              </th>
              <th className="text-left text-sm font-bold uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white/60 backdrop-blur-md">
            {filteredOrders.map((order, index) => (
              <tr key={order.id || `order-${index}`} className={`hover:bg-gradient-to-r hover:from-red-50/80 hover:via-orange-50/80 hover:to-yellow-50/80 transition-all duration-300 transform hover:scale-[1.01] hover:shadow-lg ${index % 2 === 0 ? 'bg-white/40' : 'bg-gradient-to-r from-gray-50/30 to-orange-50/20'}`}>
                <td className="whitespace-nowrap">
                  <div className="font-mono text-red-600 font-bold text-lg">{order.invoice_number}</div>
                  <div className="text-xs text-gray-500 font-medium">ID: {order.id}</div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="avatar-circle bg-gradient-to-r from-red-500 to-orange-500">
                      {order.customer_name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="customer-name font-bold text-gray-900">{order.customer_name}</div>
                      <div className="text-xs text-gray-500 font-medium">{order.items.length} item{order.items.length > 1 ? 's' : ''}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">{new Date(order.created_at).toLocaleDateString('id-ID')}</div>
                  <div className="text-xs text-gray-500 font-medium">{new Date(order.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="text-xl font-black text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
                    Rp {order.total_amount.toLocaleString('id-ID')}
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <span className={`inline-flex items-center px-4 py-2 text-sm font-black rounded-full shadow-lg border-2 ${getStatusBg(order.status)}`}>
                    <div className={`w-3 h-3 rounded-full mr-3 shadow-md bg-gradient-to-r ${getStatusColor(order.status)}`}></div>
                    {order.status}
                  </span>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex gap-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white shadow-sm"
                    >
                      <option value="Menunggu">Menunggu</option>
                      <option value="Diproses">Diproses</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                    <button
                      onClick={() => setShowDetails(showDetails === order.id ? null : order.id)}
                      className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 border-2 border-red-400"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Detail
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Detail Pesanan {showDetails}</h3>
                <button
                  onClick={() => setShowDetails(null)}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              {(() => {
                const order = orders.find(o => o.id === showDetails);
                if (!order) return null;
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Informasi Pelanggan</h4>
                        <p className="text-sm text-gray-600"><strong>Nama:</strong> {order.customer_name}</p>
                        <p className="text-sm text-gray-600"><strong>Telepon:</strong> {order.customer_phone}</p>
                        <p className="text-sm text-gray-600"><strong>Tanggal:</strong> {new Date(order.created_at).toLocaleDateString('id-ID')}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Detail Pesanan</h4>
                        <p className="text-sm text-gray-600"><strong>Invoice:</strong> {order.invoice_number}</p>
                        <p className="text-sm text-gray-600"><strong>Status:</strong> {order.status}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Item Pesanan</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-900">{item.food_name}</span>
                            <span className="text-sm text-gray-600">Qty: {item.quantity} x Rp {item.price.toLocaleString('id-ID')}</span>
                            <span className="text-sm font-semibold text-gray-900">Rp {item.subtotal.toLocaleString('id-ID')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Total:</span>
                        <span className="text-xl font-black text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
                          Rp {order.total_amount.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Order Form Modal */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Buat Pesanan Baru</h3>
                <button
                  onClick={() => setShowOrderForm(false)}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">Informasi Pelanggan</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Pelanggan</label>
                    <input
                      type="text"
                      value={orderForm.customer_name}
                      onChange={(e) => setOrderForm({ ...orderForm, customer_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Masukkan nama pelanggan"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
                    <input
                      type="text"
                      value={orderForm.customer_phone}
                      onChange={(e) => setOrderForm({ ...orderForm, customer_phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Masukkan nomor telepon"
                    />
                  </div>
                </div>

                {/* Add Items */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">Tambah Menu</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Menu</label>
                      <select
                        value={selectedFood}
                        onChange={(e) => setSelectedFood(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Pilih menu...</option>
                        {foods.filter(food => food.is_active).map((food) => (
                          <option key={food.id} value={food.id}>
                            {food.name} - Rp {food.price.toLocaleString('id-ID')} (Stok: {food.stock_quantity})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah</label>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  <button
                    onClick={addItemToOrder}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-2 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Item
                  </button>
                </div>
              </div>

              {/* Order Items List */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Daftar Pesanan</h4>
                {orderForm.items.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                    Belum ada item yang ditambahkan
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orderForm.items.map((item, index) => {
                      const food = foods.find(f => f.id === item.food_id);
                      return (
                        <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <span className="font-medium text-gray-900">{food?.name}</span>
                            <div className="text-sm text-gray-600">
                              Qty: {item.quantity} x Rp {item.price.toLocaleString('id-ID')}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-semibold text-gray-900">
                              Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                            </span>
                            <button
                              onClick={() => removeItemFromOrder(item.food_id)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Total and Actions */}
                {orderForm.items.length > 0 && (
                  <div className="mt-6 border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold text-gray-900">Total:</span>
                      <span className="text-2xl font-black text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
                        Rp {orderForm.items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleCreateOrder}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Buat Pesanan
                      </button>
                      <button
                        onClick={() => setShowOrderForm(false)}
                        className="px-6 py-3 border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all duration-300"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredOrders.length === 0 && (
        <div className="text-center py-8 text-gray-500">
        </div>
      )}
    </div>
  );
}
