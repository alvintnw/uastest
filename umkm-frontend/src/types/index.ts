export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock_quantity?: number;
  ingredients?: string[];
  nutrition_facts?: string;
}

export interface Developer {
  id: number;
  name: string;
  role: string;
  email: string;
  whatsapp: string;
  photo_url?: string;
  skills: string[];
  description: string;
  github_url?: string;
  linkedin_url?: string;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  status: string;
  items: InvoiceItem[];
  created_at: string;
}

export interface InvoiceItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  token: string;
  token_type: string;
}