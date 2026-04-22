import { Star, MapPin, CheckCircle, Phone, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProviderCard({ provider }) {
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
          <p className="text-sub">{provider.category} • {provider.experience}</p>
          
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
      <div className="action-row">
        <a href={`tel:+919999999999`} className="btn btn-outline" style={{ flex: 1, padding: '0.5rem' }}>
          <Phone size={16} /> Call
        </a>
        <a href={`https://wa.me/919999999999`} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ flex: 1, padding: '0.5rem', backgroundColor: '#25D366' }}>
          <MessageCircle size={16} /> WhatsApp
        </a>
      </div>
    </div>
  );
}
