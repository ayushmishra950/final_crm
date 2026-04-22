import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, CheckCircle, Phone, MessageCircle, Clock, Shield } from 'lucide-react';
import { providers } from '../data/dummyData';

export default function ProviderProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const provider = providers.find(p => p.id === parseInt(id)) || providers[0];

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [toast, setToast] = useState(false);

  const handleSubmitReview = () => {
    if (rating === 0) return;
    setToast(true);
    setRating(0);
    setReview('');
    setTimeout(() => setToast(false), 3000);
  };

  return (
    <div className="page-content" style={{ paddingBottom: 0 }}>
      {toast && (
         <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', background: 'var(--success-color)', color: 'white', padding: '0.8rem 1.5rem', borderRadius: 'var(--radius-full)', zIndex: 1000, boxShadow: 'var(--shadow-lg)' }}>
            Review Submitted Successfully
         </div>
      )}

      {/* Header Image Area */}
      <div style={{ position: 'relative', height: '180px', backgroundColor: 'var(--primary-light)' }}>
        <button className="btn-icon" onClick={() => navigate(-1)} style={{ position: 'absolute', top: '1rem', left: '1rem', border: 'none', background: 'rgba(255,255,255,0.8)' }}>
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="section" style={{ position: 'relative', paddingTop: 0 }}>
        {/* Profile Image Overflow */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-40px', marginBottom: '1rem' }}>
          <img src={provider.image} alt={provider.name} className="avatar-lg" style={{ border: '4px solid var(--surface-color)', boxShadow: 'var(--shadow-sm)' }} />
          <div className="flex gap-2">
            <a href={`tel:+919999999999`} className="btn-icon" style={{ background: 'var(--surface-color)', color: 'var(--text-main)', width: '40px', height: '40px' }}><Phone size={20}/></a>
            <a href={`https://wa.me/919999999999`} className="btn-icon" style={{ background: '#25D366', color: 'white', border: 'none', width: '40px', height: '40px' }}><MessageCircle size={20}/></a>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <h1 className="text-h1" style={{ margin: 0 }}>{provider.name}</h1>
          {provider.verified && <CheckCircle size={18} className="text-success" color="var(--success-color)" />}
        </div>
        <p className="text-sub" style={{ fontSize: '1rem', marginBottom: '1rem' }}>{provider.category}</p>

        <div className="flex gap-4" style={{ marginBottom: '1.5rem' }}>
          <div className="flex items-center gap-1">
            <Star fill="var(--warning-color)" color="var(--warning-color)" size={16} />
            <span style={{ fontWeight: 'var(--font-medium)' }}>{provider.rating}</span>
            <span className="text-sub">({provider.reviews})</span>
          </div>
          <div className="flex items-center gap-1 text-sub">
            <Clock size={16} /> {provider.experience}
          </div>
          <div className="flex items-center gap-1 text-sub">
             <MapPin size={16}/> {provider.distance}
          </div>
        </div>

        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3 className="text-h2" style={{ fontSize: '1rem' }}>About</h3>
          <p className="text-sub" style={{ color: 'var(--text-main)' }}>{provider.about}</p>
        </div>

        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3 className="text-h2" style={{ fontSize: '1rem' }}>Services Offered</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {provider.services.map((srv, i) => (
               <span key={i} className="badge" style={{ background: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
                 {srv}
               </span>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem' }}>
             <Shield size={18} color="var(--primary-color)"/>
             <h3 className="text-h2" style={{ fontSize: '1rem', margin: 0 }}>Service Area</h3>
          </div>
          <p className="text-sub" style={{ color: 'var(--text-main)' }}>{provider.serviceArea}</p>
        </div>

        {/* Leave a review */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1.5rem', paddingBottom: '2rem' }}>
          <h3 className="text-h2">Leave a Review</h3>
          <div className="flex gap-2" style={{ marginBottom: '1rem' }}>
            {[1,2,3,4,5].map(star => (
              <Star 
                key={star} 
                size={32} 
                color={star <= rating ? 'var(--warning-color)' : 'var(--border-color)'} 
                fill={star <= rating ? 'var(--warning-color)' : 'none'}
                onClick={() => setRating(star)}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              />
            ))}
          </div>
          <textarea 
            className="input-field" 
            placeholder="Write your experience..." 
            value={review}
            onChange={(e) => setReview(e.target.value)}
            style={{ width: '100%', minHeight: '80px', marginBottom: '1rem', resize: 'vertical' }}
          ></textarea>
          <button className="btn btn-primary btn-block" onClick={handleSubmitReview} disabled={rating === 0}>Submit Review</button>
        </div>
      </div>
    </div>
  );
}
