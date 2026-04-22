import { ArrowLeft, Search, MapPin, ChevronDown, CheckCircle, Star, ArrowRight, Zap, Droplets, Wrench, Hammer, Paintbrush, Sparkles, Scissors, Wind } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import ProviderCard from '../components/ProviderCard';
import { categories, providers, bookingHistory } from '../data/dummyData';
import { useNavigate } from 'react-router-dom';

const iconMap = {
  Zap, Droplets, Wrench, Hammer, Paintbrush, Sparkles, Scissors, Wind
};

export default function Home() {
  const navigate = useNavigate();
  // Get active ongoing booking if any
  const ongoingBooking = bookingHistory.find(b => b.status === 'Pending');

  return (
    <>
      {/* Dynamic Header */}
      <div className="navbar" style={{ paddingBottom: '1.5rem', background: 'var(--surface-color)', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button className="btn-icon" onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', padding: 0 }}>
               <ArrowLeft size={24} color="#1e293b" />
            </button>
            <div>
              <div className="text-sub" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
               <MapPin size={12} color="var(--primary-color)" /> Delivering to
            </div>
            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
               Civil Lines, Meerut <ChevronDown size={16} color="var(--primary-color)" />
            </div>
          </div>
          <img src="https://i.pravatar.cc/150?img=11" alt="user" className="avatar" style={{ width: 40, height: 40, border: '2px solid var(--primary-light)', cursor: 'pointer' }} onClick={() => navigate('/user-profile')} />
        </div>
        
        {/* Intelligently placed search bar redirecting to focus-ready dashboard */}
        <div className="search-container" style={{ margin: 0 }}>
          <Search className="search-icon" size={20} color="var(--primary-color)"/>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search for 'AC Repair' or 'Plumber'..." 
            onClick={() => navigate('/user-dashboard')}
            readOnly
            style={{ padding: '1rem 1rem 1rem 3rem', background: 'var(--bg-color)', border: '1px solid transparent', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', fontSize: '0.95rem' }}
          />
        </div>
      </div>

      <div className="page-content" style={{ background: 'var(--bg-color)', paddingTop: '0.5rem' }}>
         
        {/* Promotional Banners Carousel */}
        <div className="section animate-fade-in" style={{ paddingTop: '0', paddingBottom: '0.5rem' }}>
           <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'none', margin: '0 -1rem', padding: '0 1rem 1rem 1rem' }}>
              
              <div style={{ flex: '0 0 auto', width: '280px', background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)', borderRadius: '16px', padding: '1.5rem', position: 'relative', overflow: 'hidden', border: '1px solid #c7d2fe' }}>
                 <div style={{ position: 'relative', zIndex: 2 }}>
                    <div className="badge badge-warning" style={{ background: '#fef3c7', color: '#b45309', marginBottom: '0.5rem' }}>Limited Time</div>
                    <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: '#312e81' }}>Monsoon AC Servicing <br/>@ Flat ₹299/-</h2>
                    <button onClick={() => navigate('/user-dashboard')} style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' }}>Book Now</button>
                 </div>
                 <Wind size={120} color="#c7d2fe" style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.5, zIndex: 1 }} />
              </div>

              <div style={{ flex: '0 0 auto', width: '280px', background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)', borderRadius: '16px', padding: '1.5rem', position: 'relative', overflow: 'hidden', border: '1px solid #fecdd3' }}>
                 <div style={{ position: 'relative', zIndex: 2 }}>
                    <div className="badge badge-warning" style={{ background: '#fecdd3', color: '#be123c', marginBottom: '0.5rem' }}>Festive Offer</div>
                    <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: '#881337' }}>Deep Home Cleaning <br/>20% Off Today</h2>
                    <button onClick={() => navigate('/user-dashboard')} style={{ background: '#e11d48', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' }}>Get Offer</button>
                 </div>
                 <Sparkles size={120} color="#fecdd3" style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.5, zIndex: 1 }} />
              </div>

              <div style={{ flex: '0 0 auto', width: '280px', background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', borderRadius: '16px', padding: '1.5rem', position: 'relative', overflow: 'hidden', border: '1px solid #bbf7d0' }}>
                 <div style={{ position: 'relative', zIndex: 2 }}>
                    <div className="badge badge-warning" style={{ background: '#bbf7d0', color: '#166534', marginBottom: '0.5rem' }}>Essentials</div>
                    <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: '#14532d' }}>Quick Plumber <br/>Within 30 Mins</h2>
                    <button onClick={() => navigate('/user-dashboard')} style={{ background: '#16a34a', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' }}>Hire Now</button>
                 </div>
                 <Droplets size={120} color="#bbf7d0" style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.5, zIndex: 1 }} />
              </div>

           </div>
        </div>

        {/* Dynamic Ongoing Booking Widget (Shows only if pending exists) */}
        {ongoingBooking && (
           <div className="section" style={{ paddingTop: 0 }}>
             <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem', border: '1px solid #e2e8f0', borderLeft: '4px solid #f59e0b', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                   <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f59e0b' }}>Ongoing Request</div>
                   <div className="text-sub" style={{ fontSize: '0.75rem' }}>Today</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                   <div>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{ongoingBooking.providerName}</div>
                      <div className="text-sub" style={{ fontSize: '0.875rem' }}>{ongoingBooking.category} • Assigner en route</div>
                   </div>
                   <button className="btn-icon" style={{ background: '#e0f2fe', color: '#0ea5e9', border: 'none' }} onClick={() => navigate('/user-profile')}>
                      <ArrowRight size={18} />
                   </button>
                </div>
             </div>
           </div>
        )}

        {/* Categories Grid */}
        <div className="section" style={{ paddingTop: 0 }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '1.25rem' }}>
            <h3 className="text-h2" style={{ fontSize: '1.125rem', margin: 0, color: '#1e293b' }}>What are you looking for?</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', rowGap: '1.5rem' }}>
            {categories.map(cat => {
              const IconComp = iconMap[cat.icon];
              return (
                <div key={cat.id} className="category-item" onClick={() => navigate('/user-dashboard')} style={{ cursor: 'pointer' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', transition: '0.2s', marginBottom: '0.25rem' }}>
                    <IconComp size={24} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#475569', textAlign: 'center' }}>{cat.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="section" style={{ paddingTop: 0 }}>
           <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'none', margin: '0 -1rem', padding: '0 1rem 1rem 1rem' }}>
              <div style={{ flex: '0 0 auto', width: '240px', background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                 <CheckCircle size={32} color="#10b981" fill="#ecfdf5" />
                 <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Verified Experts</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Background checked</div>
                 </div>
              </div>
              <div style={{ flex: '0 0 auto', width: '240px', background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                 <Star size={32} color="#f59e0b" fill="#fef3c7" />
                 <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Transparent Pricing</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>No hidden charges</div>
                 </div>
              </div>
           </div>
        </div>

        {/* Top Rated Near You (Horizontal Scroll) */}
        <div className="section" style={{ paddingTop: 0, paddingBottom: '0.5rem' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '1.25rem' }}>
            <h3 className="text-h2" style={{ fontSize: '1.125rem', margin: 0, color: '#1e293b' }}>Top Rated Near You</h3>
            <span style={{ fontSize: '0.875rem', color: 'var(--primary-color)', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/user-dashboard')}>See All</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'none', margin: '0 -1rem', padding: '0 1rem 1rem 1rem' }}>
            {providers.filter(p => p.rating >= 4.7).map(provider => (
               <div key={provider.id} style={{ flex: '0 0 auto', width: '260px' }}>
                  <ProviderCard provider={provider} />
               </div>
            ))}
          </div>
        </div>

        {/* Explore All (Vertical List) */}
        <div className="section" style={{ paddingTop: 0 }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '1.25rem' }}>
            <h3 className="text-h2" style={{ fontSize: '1.125rem', margin: 0, color: '#1e293b' }}>Recommended Professionals</h3>
          </div>
          <div className="provider-list">
            {providers.slice(0, 4).map(provider => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
          <button onClick={() => navigate('/user-dashboard')} className="btn btn-outline btn-block" style={{ marginTop: '1.5rem', background: 'white' }}>Explore All 50+ Partners</button>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
