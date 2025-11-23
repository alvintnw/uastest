import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
});

// Request interceptor untuk menambahkan auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token') || 'demo-token-123';
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired atau invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        window.location.href = '/dashboard';
      }
    }
    return Promise.reject(error);
  }
);

// Fungsi untuk mendapatkan foods (untuk halaman utama)
export const getFoods = () => api.get('/foods');

// Fungsi untuk admin CRUD foods
export const getAdminFoods = () => api.get('/admin/foods');
export const createAdminFood = (data: FormData) => api.post('/admin/foods', data);
export const updateAdminFood = (id: string, data: FormData | Record<string, unknown>) => {
  // If data is FormData (file upload), use POST with _method=PUT so PHP/Laravel receives files correctly.
  if (typeof FormData !== 'undefined' && data instanceof FormData) {
    // append method override
    try {
      data.set('_method', 'PUT');
    } catch {
      // ignore if set fails
    }
    return api.post(`/admin/foods/${id}`, data);
  }

  return api.put(`/admin/foods/${id}`, data as Record<string, unknown>);
};
export const deleteAdminFood = (id: string) => api.delete(`/admin/foods/${id}`);

// Fungsi untuk orders/invoices
export const getInvoices = () => api.get('/admin/invoices');
export const getInvoice = (id: string) => api.get(`/admin/invoices/${id}`);
export const createOrder = (data: {
  customer_name: string;
  customer_phone: string;
  items: Array<{
    food_id: string;
    quantity: number;
    price: number;
  }>;
}) => api.post('/admin/invoices', data);
export const updateInvoice = (id: string, data: Record<string, unknown>) => api.put(`/admin/invoices/${id}`, data);
export const updateInvoiceStatus = (id: string, status: string) => api.put(`/admin/invoices/${id}/status`, { status });
export const deleteInvoice = (id: string) => api.delete(`/admin/invoices/${id}`);

// Fungsi untuk dashboard stats
export const getDashboardStats = () => api.get('/admin/dashboard/stats');

export default api;
