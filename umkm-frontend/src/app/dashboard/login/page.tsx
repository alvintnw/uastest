// src/app/dashboard/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');
    
    if (authToken && userData) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (email === 'admin@umkmdelicious.com' && password === 'password123') {
        const userData = {
          id: 1,
          name: 'Admin UMKM Delicious',
          email: email,
          role: 'admin'
        };

        localStorage.setItem('auth_token', 'demo-token-' + Date.now());
        localStorage.setItem('user', JSON.stringify(userData));
        router.push('/dashboard');
      } else {
        setError('Email atau password salah');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Animated Background */}
      <div className="login-bg">
        <div className="bg-layer-1"></div>
        <div className="bg-layer-2"></div>
        <div className="bg-layer-3"></div>
      </div>

      {/* Floating Elements */}
      <div className="floating-elements">
        <div className="floating-item item-1">🍗</div>
        <div className="floating-item item-2">🌶️</div>
        <div className="floating-item item-3">🥔</div>
        <div className="floating-item item-4">⭐</div>
      </div>

      <div className="login-container" style={{ marginTop: '80px' }}>
        <div className="login-card animate-fade-in">
          {/* Decorative Elements */}
          <div className="card-decoration-top"></div>
          <div className="card-decoration-bottom"></div>

          <div className="login-header">
            <div className="logo">
              <div className="logo-icon">
                <i className="fas fa-utensils"></i>
              </div>
              <h1 className="gradient-text">Delicious <span>Admin</span></h1>
              <p>UMKM Delicious Dashboard</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            {error && (
              <div className="error-message">
                <i className="fas fa-exclamation-circle"></i>
                {error}
              </div>
            )}

            <div className="form-group">
              <label>
                <i className="fas fa-envelope"></i>
                Email Address
              </label>
              <input
                type="email"
                placeholder="admin@umkmdelicious.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>
                <i className="fas fa-lock"></i>
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button type="submit" disabled={loading} className="hover-scale">
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Logging in...
                </>
              ) : (
                <>
                  <i className="fas fa-rocket"></i>
                  Login to Dashboard
                </>
              )}
            </button>
          </form>

          <div className="demo-credentials">
            <h4>Demo Credentials</h4>
            <div className="credentials">
              <div>
                <i className="fas fa-envelope"></i>
                <span>admin@umkmdelicious.com</span>
              </div>
              <div>
                <i className="fas fa-key"></i>
                <span>password123</span>
              </div>
            </div>
          </div>

          <div className="back-home">
            <Link href="/">
              <button className="back-home-btn">
                <i className="fas fa-arrow-left"></i>
                Back to Homepage
              </button>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .login-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .bg-layer-1 {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: float 6s ease-in-out infinite;
        }

        .bg-layer-2 {
          position: absolute;
          top: 20%;
          right: -30%;
          width: 60%;
          height: 60%;
          background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
          animation: float 8s ease-in-out infinite reverse;
        }

        .bg-layer-3 {
          position: absolute;
          bottom: -20%;
          left: 10%;
          width: 40%;
          height: 40%;
          background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
          animation: float 10s ease-in-out infinite;
        }

        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .floating-item {
          position: absolute;
          font-size: 2rem;
          opacity: 0.6;
          animation: float 4s ease-in-out infinite;
        }

        .item-1 {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .item-2 {
          top: 60%;
          right: 15%;
          animation-delay: 1s;
        }

        .item-3 {
          top: 40%;
          left: 80%;
          animation-delay: 2s;
        }

        .item-4 {
          top: 80%;
          left: 20%;
          animation-delay: 3s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        .login-container {
          width: 100%;
          max-width: 420px;
          position: relative;
          z-index: 2;
        }

        .login-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          animation: fadeIn 0.8s ease-out;
          position: relative;
          overflow: hidden;
        }

        .card-decoration-top {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #ff6b35, #f7931e, #ff6b35);
          animation: shimmer 2s ease-in-out infinite;
        }

        .card-decoration-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #f7931e, #ff6b35, #f7931e);
          animation: shimmer 2s ease-in-out infinite reverse;
        }

        @keyframes shimmer {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .logo-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #ff6b35, #f7931e);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 1.8rem;
          color: white;
          box-shadow: 0 8px 20px rgba(255, 107, 53, 0.3);
          animation: pulse 2s ease-in-out infinite;
        }

        .logo h1 {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(45deg, #ffffff, #ffeb3b, #ffffff);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 3s ease-in-out infinite;
          margin-bottom: 10px;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .logo span {
          font-weight: 300;
        }

        .logo p {
          background: linear-gradient(45deg, #ff6b35, #f7931e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .login-form {
          margin-bottom: 30px;
        }

        .form-group {
          margin-bottom: 25px;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #2c3e50;
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 0.95rem;
        }

        .form-group input {
          width: 100%;
          padding: 15px 20px;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }

        .form-group input:focus {
          outline: none;
          border-color: #ff6b35;
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
        }

        button {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #ff6b35, #f7931e);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        button:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
        }

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 12px 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #f5c6cb;
        }

        .demo-credentials {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .demo-credentials h4 {
          color: #2c3e50;
          margin-bottom: 15px;
          text-align: center;
        }

        .credentials div {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
          color: #6c757d;
          font-family: monospace;
        }

        .back-home a {
          text-decoration: none !important;
        }

        .back-home-btn {
          width: 100%;
          padding: 12px 20px;
          background: rgba(255, 255, 255, 0.8);
          color: #6c757d;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none !important;
        }

        .back-home-btn:hover {
          background: rgba(255, 107, 53, 0.1);
          border-color: #ff6b35;
          color: #ff6b35;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(255, 107, 53, 0.2);
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .login-page {
            padding: 10px;
          }

          .login-card {
            padding: 30px 20px;
          }

          .logo h1 {
            font-size: 2rem;
          }

          .floating-item {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}