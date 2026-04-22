import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react';

export default function AdminAuth() {
  const navigate = useNavigate();

  const handleVerify = (e) => {
    e.preventDefault();
    navigate('/admin');
  };

  return (
    <div className="admin-auth-wrapper" style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9', alignItems: 'center', justifyContent: 'center', padding: '1rem', width: '100vw', maxWidth: '100%', position: 'fixed', top: 0, left: 0, zIndex: 9000 }}>
       
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '2rem', background: '#ffffff', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', position: 'relative' }}>
        
        <button className="btn-icon" onClick={() => navigate(-1)} style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', border: 'none', background: '#f8fafc', color: '#64748b' }}>
          <ArrowLeft size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem', marginTop: '1rem' }}>
          <div style={{ width: 64, height: 64, backgroundColor: '#eef2ff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', color: '#4f46e5' }}>
             <ShieldCheck size={32} />
          </div>
          <h1 style={{ fontSize: '1.5rem', margin: '0 0 0.25rem 0', color: '#1e293b', fontWeight: 600 }}>System Login</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Restricted Administrative Portal</p>
        </div>

        <form onSubmit={handleVerify}>
          <div className="input-group" style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem', display: 'block' }}>Admin ID</label>
            <input type="text" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem' }} placeholder="root_admin" required />
          </div>
          
          <div className="input-group" style={{ marginBottom: '2rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem', display: 'block' }}>Passcode</label>
            <div style={{ position: 'relative' }}>
               <input type="password" style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem' }} placeholder="••••••••" required />
               <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            </div>
          </div>

          <button type="submit" style={{ width: '100%', padding: '1rem', background: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}>Authenticate Access</button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
           <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Unauthorized access is strictly prohibited.</span>
        </div>
      </div>
    </div>
  );
}
