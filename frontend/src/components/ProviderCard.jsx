import { Star, MapPin, CheckCircle, Phone, MessageCircle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProviderCard({ provider }) {
  const handleCall = () => {
    sessionStorage.setItem('pendingCallVendor', JSON.stringify({ id: provider.id, name: provider.name }));
  };

  const whatsappMessage = encodeURIComponent(`Hi, mujhe ${provider.category || 'service'} chahiye, aap available ho kya?`);
  
  return (
    <div className="card">
      <div className="flex gap-4">
        <img src={provider.image} alt={provider.name} className="avatar" />
        <div style={{ flex: 1 }}>
          <div className="flex justify-between items-center">
            <h3 className="text-h2" style={{ marginBottom: 0, fontSize: '1.125rem' }}>
              <Link to={`/provider/${provider.id}`}>{provider.name}</Link>
            </h3>
            {provider.verified && <CheckCircle size={16} className="text-success" color="var(--success-color)" />}
          </div>
          <p className="text-sub">{provider.category || 'Professional Partner'} • {provider.experience || 'Verified'}</p>
          
          <div className="flex justify-between items-center" style={{ marginTop: '0.25rem' }}>
            <div className="stars">
              <Star size={14} fill="currentColor" />
              <span style={{ fontSize: '0.875rem', color: 'var(--text-main)', fontWeight: 'var(--font-medium)' }}>
                {provider.rating} <span className="text-sub">({provider.reviews})</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-sub" style={{ fontSize: '0.75rem' }}>
              <MapPin size={12} />
              {provider.distance}
            </div>
          </div>
        </div>
      </div>
      <div className="action-row" style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <a href={`tel:${provider.mobile || '+919999999999'}`} onClick={handleCall} className="btn btn-outline" style={{ flex: 1, padding: '0.5rem', justifyContent: 'center' }}>
          <Phone size={16} /> Call
        </a>
        <a href={`https://wa.me/${provider.mobile || '919999999999'}?text=${whatsappMessage}`} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ flex: 1, padding: '0.5rem', backgroundColor: '#25D366', justifyContent: 'center' }}>
          <MessageCircle size={16} /> WhatsApp
        </a>
        <Link to={`/provider/${provider.id}`} className="btn btn-primary" style={{ flex: 1, padding: '0.5rem', justifyContent: 'center' }}>
          <Calendar size={16} /> Book
        </Link>
      </div>
    </div>
  );
}
