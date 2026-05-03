import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Mail, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { loginAdmin } from '../../service/auth';
import { useCustomToast } from '../../components/CustomToast';

export default function AdminAuth() {
  const { addToast } = useCustomToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await loginAdmin(formData);
      if (res.status === 200) {
        addToast("Authentication Successful", "Welcome to Admin Portal", "success");
        navigate('/admin');
      }
    } catch (error) {
      console.error(error);
      addToast("Authentication Failed", error.response?.data?.message || "Invalid credentials", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-wrapper" style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '1rem', 
      width: '100vw', 
      maxWidth: '100%', 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      zIndex: 9000,
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)',
        top: '-200px',
        right: '-100px',
        borderRadius: '50%',
        animation: 'pulse 4s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
        bottom: '-150px',
        left: '-100px',
        borderRadius: '50%',
        animation: 'pulse 4s ease-in-out infinite 2s'
      }}></div>

      <div className="card animate-fade-in" style={{ 
        width: '100%', 
        maxWidth: '420px', 
        padding: '0', 
        background: 'rgba(255, 255, 255, 0.95)', 
        borderRadius: '24px', 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Top Accent Bar */}
        <div style={{
          height: '4px',
          background: 'linear-gradient(90deg, #4f46e5 0%, #6366f1 50%, #4f46e5 100%)',
          width: '100%'
        }}></div>

        <div style={{ padding: '2.5rem 2rem' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <button 
              onClick={() => navigate(-1)} 
              style={{ 
                position: 'absolute', 
                top: '1.5rem', 
                left: '1.5rem', 
                border: 'none', 
                background: '#f1f5f9', 
                color: '#64748b',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: '0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.background = '#e2e8f0'}
              onMouseOut={e => e.currentTarget.style.background = '#f1f5f9'}
            >
              <ArrowLeft size={18} />
            </button>

            <div style={{ 
              width: 72, 
              height: 72, 
              backgroundColor: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
              background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
              borderRadius: '20px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 1.5rem auto',
              boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.4)',
              position: 'relative'
            }}>
              <Shield size={36} color="#ffffff" />
              <div style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '16px',
                height: '16px',
                background: '#10b981',
                borderRadius: '50%',
                border: '3px solid white'
              }}></div>
            </div>
            
            <h1 style={{ 
              fontSize: '1.625rem', 
              margin: '0 0 0.5rem 0', 
              color: '#0f172a', 
              fontWeight: 700,
              letterSpacing: '-0.025em'
            }}>
              Admin Portal
            </h1>
            <p style={{ 
              color: '#64748b', 
              fontSize: '0.875rem',
              fontWeight: 500
            }}>
              Secure administrative access
            </p>
          </div>

          <form onSubmit={handleVerify}>
            {/* Email Field */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                color: '#475569', 
                marginBottom: '0.5rem', 
                display: 'block',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Admin Email
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  style={{ 
                    width: '100%', 
                    padding: '0.875rem 1rem 0.875rem 2.75rem', 
                    borderRadius: '12px', 
                    border: '2px solid #e2e8f0', 
                    outline: 'none', 
                    fontSize: '0.9375rem',
                    color: '#0f172a',
                    background: '#f8fafc',
                    transition: '0.2s'
                  }} 
                  placeholder="admin@company.com" 
                  required 
                  onFocus={e => e.target.style.borderColor = '#4f46e5'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
                <Mail size={18} style={{ 
                  position: 'absolute', 
                  left: '1rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: '#94a3b8' 
                }} />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                color: '#475569', 
                marginBottom: '0.5rem', 
                display: 'block',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={formData.password} 
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                  style={{ 
                    width: '100%', 
                    padding: '0.875rem 3rem 0.875rem 2.75rem', 
                    borderRadius: '12px', 
                    border: '2px solid #e2e8f0', 
                    outline: 'none', 
                    fontSize: '0.9375rem',
                    color: '#0f172a',
                    background: '#f8fafc',
                    transition: '0.2s'
                  }} 
                  placeholder="Enter your password" 
                  required 
                  onFocus={e => e.target.style.borderColor = '#4f46e5'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
                <Lock size={18} style={{ 
                  position: 'absolute', 
                  left: '1rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: '#94a3b8' 
                }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94a3b8',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading} 
              style={{ 
                width: '100%', 
                padding: '1rem', 
                background: loading ? '#818cf8' : 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                color: '#ffffff', 
                border: 'none', 
                borderRadius: '12px', 
                fontSize: '1rem', 
                fontWeight: 600, 
                cursor: loading ? 'not-allowed' : 'pointer', 
                transition: 'all 0.2s',
                boxShadow: loading ? 'none' : '0 4px 15px -3px rgba(79, 70, 229, 0.4)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={e => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px -5px rgba(79, 70, 229, 0.5)';
                }
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px -3px rgba(79, 70, 229, 0.4)';
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <svg style={{ animation: 'spin 1s linear infinite' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Authenticating...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Lock size={18} />
                  Secure Login
                </span>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.5rem',
            marginTop: '1.5rem',
            padding: '0.75rem',
            background: '#f8fafc',
            borderRadius: '10px',
            border: '1px solid #e2e8f0'
          }}>
            <CheckCircle size={14} color="#10b981" />
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
              256-bit SSL Encrypted Connection
            </span>
          </div>

          {/* Warning */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: '1.25rem',
            padding: '1rem',
            background: 'rgba(239, 68, 68, 0.05)',
            borderRadius: '10px',
            border: '1px solid rgba(239, 68, 68, 0.1)'
          }}>
            <p style={{ 
              fontSize: '0.7rem', 
              color: '#ef4444', 
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: 0
            }}>
              ⚠️ Unauthorized access is strictly prohibited
            </p>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}