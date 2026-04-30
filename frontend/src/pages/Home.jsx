import { useState, useEffect } from 'react';
import { ArrowLeft, Search, MapPin, ChevronDown, CheckCircle, Star, ArrowRight, Zap, Droplets, Wrench, Hammer, Paintbrush, Sparkles, Scissors, Wind, Clock, Bell, X } from 'lucide-react';

import BottomNav from '../components/BottomNav';
import ProviderCard from '../components/ProviderCard';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/redux-toolkit/customHook/customHook';
import { getHomeData } from '../service/userService';

const iconMap = {
  Zap, Droplets, Wrench, Hammer, Paintbrush, Sparkles, Scissors, Wind, Clock
};

// Fallback icons for categories if match not found
const getCategoryIcon = (categoryName) => {
  const name = categoryName?.toLowerCase() || '';
  if (name.includes('repair')) return Wrench;
  if (name.includes('clean')) return Sparkles;
  if (name.includes('plumb')) return Droplets;
  if (name.includes('electric')) return Zap;
  if (name.includes('paint')) return Paintbrush;
  if (name.includes('salon') || name.includes('hair')) return Scissors;
  return Wrench; // Default
};

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [homeData, setHomeData] = useState({
    ongoingBooking: null,
    categories: [],
    topRatedProviders: [],
    notifications: []
  });
  const [showNotifications, setShowNotifications] = useState(false);

  const userData = useAppSelector((state) => state?.user?.userData);


  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const res = await getHomeData();
      if (res.success) {
        setHomeData(res.data);
      }
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setLoading(false);
    }
  };

  const { ongoingBooking, categories, topRatedProviders } = homeData;

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8fafc' }}>
        <div className="animate-pulse" style={{ color: '#4f46e5', fontWeight: 600 }}>Loading Experience...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Dynamic Header */}
      <div className="navbar" style={{ paddingBottom: '1rem', background: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '12px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <MapPin size={20} color="#4f46e5" />
            </div>
            <div>
              <div className="text-sub" style={{ fontSize: '0.75rem' }}>Current Location</div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Civil Lines, Meerut <ChevronDown size={14} color="#4f46e5" />
              </div>
            </div>
          </div>
           <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
             <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowNotifications(!showNotifications)}>
                <Bell size={24} color="#64748b" />
                {homeData.notifications?.length > 0 && (
                   <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: '#ef4444', borderRadius: '50%', border: '2px solid white' }}></span>
                )}
             </div>
             <div style={{ position: 'relative' }}>
                <img 
                   src={userData?.profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"} 
                   alt="user" 
                   className="avatar" 
                   style={{ width: 40, height: 40, cursor: 'pointer', borderRadius: '50%', objectFit: 'cover', border: '1px solid #eef2ff' }} 
                   onClick={() => navigate('/user-profile')} 
                />
             </div>
          </div>

        </div>

        <div className="search-container" style={{ margin: 0 }}>
          <Search className="search-icon" size={18} color="#94a3b8" />
          <input
            type="text"
            className="search-input"
            placeholder="Search for 'AC Repair' or 'Cleaning'..."
            onClick={() => navigate('/user-dashboard')}
            readOnly
            style={{ padding: '0.75rem 0.75rem 0.75rem 2.5rem', background: '#f1f5f9', border: 'none', borderRadius: '12px', fontSize: '0.875rem' }}
          />
        </div>
      </div>

      {/* Notifications Modal */}
      {showNotifications && (
         <div style={{ position: 'fixed', top: 70, right: 20, width: '300px', background: 'white', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 1000, padding: '1rem', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
               <h3 style={{ margin: 0, fontSize: '1rem' }}>Notifications</h3>
               <button onClick={() => setShowNotifications(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={18}/></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
               {homeData.notifications?.length === 0 ? (
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', textAlign: 'center' }}>No new notifications</p>
               ) : (
                  homeData.notifications.map((n, i) => (
                     <div key={i} style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '10px', fontSize: '0.875rem' }}>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{n.title}</div>
                        <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{n.message}</div>
                     </div>
                  ))
               )}
            </div>
         </div>
      )}

      <div className="page-content" style={{ paddingBottom: '90px' }}>

        {/* Promotional Banners */}
        <div className="section" style={{ paddingTop: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
            <div style={{ flex: '0 0 auto', width: '280px', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', borderRadius: '20px', padding: '1.5rem', position: 'relative', overflow: 'hidden', color: 'white' }}>
               <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ background: 'rgba(255,255,255,0.2)', width: 'fit-content', padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Limited Offer</div>
                  <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>AC Deep Servicing</h2>
                  <p style={{ margin: '4px 0 1rem 0', fontSize: '0.875rem', opacity: 0.9 }}>Starting from ₹299/-</p>
                  <button onClick={() => navigate('/user-dashboard')} style={{ background: 'white', color: '#4f46e5', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>Book Now</button>
               </div>
               <Wind size={100} color="rgba(255,255,255,0.1)" style={{ position: 'absolute', right: '-10px', bottom: '-10px' }} />
            </div>

            <div style={{ flex: '0 0 auto', width: '280px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '20px', padding: '1.5rem', position: 'relative', overflow: 'hidden', color: 'white' }}>
               <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ background: 'rgba(255,255,255,0.2)', width: 'fit-content', padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Top Pick</div>
                  <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Full Home Spa</h2>
                  <p style={{ margin: '4px 0 1rem 0', fontSize: '0.875rem', opacity: 0.9 }}>Get 20% discount today</p>
                  <button onClick={() => navigate('/user-dashboard')} style={{ background: 'white', color: '#10b981', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>View Details</button>
               </div>
               <Sparkles size={100} color="rgba(255,255,255,0.1)" style={{ position: 'absolute', right: '-10px', bottom: '-10px' }} />
            </div>
          </div>
        </div>

        {/* Ongoing Booking Widget */}
        {ongoingBooking && (
          <div className="section" style={{ paddingTop: 0 }}>
            <div style={{ background: 'white', borderRadius: '20px', padding: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <div style={{ width: 6, height: 6, background: '#f59e0b', borderRadius: '50%' }}></div> Ongoing Request
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Tracking active</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={ongoingBooking.vendorId?.profileImage || "https://i.pravatar.cc/150"} alt="provider" style={{ width: 48, height: 48, borderRadius: '12px', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 700, color: '#1e293b' }}>{ongoingBooking.vendorId?.businessName || ongoingBooking.vendorId?.fullName}</div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{ongoingBooking.serviceId?.name} • Coming soon</div>
                  </div>
                </div>
                <button onClick={() => navigate('/user-profile')} style={{ background: '#f1f5f9', border: 'none', width: 36, height: 36, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Categories Section */}
        <div className="section" style={{ paddingTop: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Discover Services</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {categories.length > 0 ? categories.map((cat, idx) => {
              const Icon = getCategoryIcon(cat);
              return (
                <div key={idx} onClick={() => navigate('/user-dashboard', { state: { category: cat } })} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'white', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                    <Icon size={26} />
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569', textAlign: 'center' }}>{cat}</span>
                </div>
              );
            }) : (
               <div style={{ gridColumn: 'span 4', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem', padding: '1rem' }}>No categories found</div>
            )}
          </div>
        </div>

        {/* Top Rated Professionals */}
        <div className="section" style={{ paddingTop: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Top Rated Experts</h3>
            <span onClick={() => navigate('/user-dashboard')} style={{ fontSize: '0.875rem', color: '#4f46e5', fontWeight: 600, cursor: 'pointer' }}>See All</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'none' }}>
            {topRatedProviders.length > 0 ? topRatedProviders.map((provider, idx) => (
              <div key={provider._id || idx} style={{ flex: '0 0 auto', width: '260px' }}>
                <ProviderCard provider={provider} />
              </div>
            )) : (

               <div style={{ textAlign: 'center', width: '100%', color: '#94a3b8', padding: '2rem' }}>No experts available right now</div>
            )}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
