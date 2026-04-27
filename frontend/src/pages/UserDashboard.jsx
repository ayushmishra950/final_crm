import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, SortDesc, Star, Clock, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProviderCard from '../components/ProviderCard';
import BottomNav from '../components/BottomNav';
import { getExploreProviders } from '../service/userService';

export default function UserDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState([]);
  const [activeFilter, setActiveFilter] = useState(location.state?.category || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProviders();
  }, [activeFilter, sortBy]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
       fetchProviders();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const res = await getExploreProviders({
        category: activeFilter,
        search: searchQuery,
        sortBy
      });
      if (res.success) {
        setProviders(res.providers);
        // Extract categories from results if categories list is empty
        if (categories.length === 0) {
           const uniqueCats = [...new Set(res.providers.map(p => p.category))];
           setCategories(uniqueCats);
        }
      }
    } catch (error) {
      console.error("Error fetching providers:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f8fafc' }}>
      {/* HEADER */}
      <div className="navbar" style={{ padding: '1rem', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#f1f5f9', border: 'none', width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e293b' }}>
          <ArrowLeft size={20} />
        </button>
        <div className="search-container" style={{ margin: 0, flex: 1, position: 'relative' }}>
          <Search className="search-icon" size={18} color="#94a3b8" />
          <input 
             type="text" 
             className="search-input" 
             placeholder="Search providers, skills, or services..." 
             style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', background: '#f1f5f9', border: 'none', fontSize: '0.875rem', borderRadius: '12px' }}
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
             <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94a3b8' }}>
                <X size={16} />
             </button>
          )}
        </div>
      </div>

      <div className="page-content" style={{ overflowY: 'auto', paddingBottom: '90px' }}>
        
        {/* FILTERS & SORT */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#f8fafc', padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
           <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.75rem', scrollbarWidth: 'none' }}>
             <div className={`filter-chip ${activeFilter === 'All' ? 'active' : ''}`} onClick={() => setActiveFilter('All')} style={{ whiteSpace: 'nowrap', padding: '0.5rem 1.25rem', borderRadius: '10px', background: activeFilter === 'All' ? '#4f46e5' : 'white', color: activeFilter === 'All' ? 'white' : '#64748b', fontSize: '0.875rem', fontWeight: 600, border: '1px solid #e2e8f0', cursor: 'pointer' }}>All Categories</div>
             {categories.map((cat, idx) => (
                <div 
                   key={idx} 
                   className={`filter-chip ${activeFilter === cat ? 'active' : ''}`}
                   onClick={() => setActiveFilter(cat)}
                   style={{ whiteSpace: 'nowrap', padding: '0.5rem 1.25rem', borderRadius: '10px', background: activeFilter === cat ? '#4f46e5' : 'white', color: activeFilter === cat ? 'white' : '#64748b', fontSize: '0.875rem', fontWeight: 600, border: '1px solid #e2e8f0', cursor: 'pointer' }}
                >
                  {cat}
                </div>
             ))}
           </div>
           
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>{loading ? "Searching..." : `${providers.length} Partners Available`}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: sortBy === 'rating' ? '#4f46e5' : '#64748b', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => setSortBy('rating')}>
                    <Star size={14} fill={sortBy === 'rating' ? '#4f46e5' : 'none'}/> Top Rated
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: sortBy === 'distance' ? '#4f46e5' : '#64748b', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => setSortBy('distance')}>
                    <Clock size={14}/> Recent
                 </div>
              </div>
           </div>
        </div>

        {/* PROVIDERS LIST */}
        <div className="section" style={{ paddingTop: '1rem' }}>
          {loading && providers.length === 0 ? (
             <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid #e2e8f0', borderTopColor: '#4f46e5', borderRadius: '50%', margin: '0 auto' }}></div>
             </div>
          ) : (
            <div className="provider-list animate-fade-in">
               {providers.map((provider, idx) => (
                  <ProviderCard key={idx} provider={{
                     id: provider._id,
                     name: provider.businessName || provider.fullName,
                     category: provider.category,
                     rating: provider.rating,
                     reviewsCount: provider.reviewsCount || 10,
                     profileImage: provider.profileImage,
                     distance: "1.2 km"
                  }} />
               ))}
               
               {providers.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'white', borderRadius: '24px', border: '1px dashed #cbd5e1' }}>
                     <div style={{ width: 64, height: 64, background: '#f1f5f9', borderRadius: '50%', margin: '0 auto 1.5rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Search size={28} color="#94a3b8" />
                     </div>
                     <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>No results found</h3>
                     <p style={{ fontSize: '0.875rem', color: '#64748b' }}>We couldn't find any partners matching "{searchQuery}". Try different keywords.</p>
                  </div>
               )}
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
