import { Star, MapPin, CheckCircle, Phone, MessageCircle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProviderCard({ provider }) {
  const handleCall = () => {
    sessionStorage.setItem('pendingCallVendor', JSON.stringify({ id: provider._id, name: provider.fullName || provider.businessName }));
  };

  const whatsappMessage = encodeURIComponent(`Hi, mujhe ${provider.category || 'service'} chahiye, aap available ho kya?`);
  
  return (
    <div className="card" style={{ padding: '1rem' }}>
      <div className="flex gap-4">
        <img src={provider.profileImage || "https://i.pravatar.cc/150"} alt={provider.fullName} className="avatar" style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }} />
        <div style={{ flex: 1 }}>
          <div className="flex justify-between items-center">
            <h3 className="text-h2" style={{ marginBottom: 0, fontSize: '1rem', fontWeight: 600 }}>
              <Link to={`/provider/${provider._id}`} style={{ color: '#1e293b', textDecoration: 'none' }}>{provider.businessName || provider.fullName}</Link>
            </h3>
            {provider.isKycVerified && <CheckCircle size={16} className="text-success" color="#10b981" />}
          </div>
          <p className="text-sub" style={{ fontSize: '0.875rem', margin: '2px 0' }}>{provider.category || 'Professional Partner'}</p>
          
          <div className="flex justify-between items-center" style={{ marginTop: '0.5rem' }}>
            <div className="stars" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
              <span style={{ fontSize: '0.875rem', color: '#1e293b', fontWeight: 600 }}>
                {provider.rating || '4.5'} <span style={{ color: '#94a3b8', fontWeight: 400 }}>({provider.reviewsCount || 0})</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="action-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '1rem' }}>
        <a href={`tel:${provider.mobile || '+919999999999'}`} onClick={handleCall} className="btn" style={{ background: '#f1f5f9', color: '#1e293b', padding: '0.5rem', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', border: 'none', borderRadius: '8px' }}>
          <Phone size={14} /> Call
        </a>
        <a href={`https://wa.me/${provider.mobile || '919999999999'}?text=${whatsappMessage}`} target="_blank" rel="noreferrer" className="btn" style={{ background: '#dcfce7', color: '#166534', padding: '0.5rem', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', border: 'none', borderRadius: '8px' }}>
          <MessageCircle size={14} /> WhatsApp
        </a>
        <Link to={`/provider/${provider._id}`} className="btn" style={{ background: '#e0e7ff', color: '#4338ca', padding: '0.5rem', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', border: 'none', borderRadius: '8px', textDecoration: 'none' }}>
          <Calendar size={14} /> Book
        </Link>
      </div>
    </div>
  );
}

