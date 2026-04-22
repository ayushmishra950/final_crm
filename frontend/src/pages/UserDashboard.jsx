import { useState } from 'react';
import { ArrowLeft, Search, Filter, SortDesc, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProviderCard from '../components/ProviderCard';
import BottomNav from '../components/BottomNav';
import { providers, categories } from '../data/dummyData';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating'); // 'rating' | 'distance'

  let filteredProviders = activeFilter === 'All' 
    ? [...providers] 
    : providers.filter(p => p.category === activeFilter);

  if (searchQuery.trim() !== '') {
     filteredProviders = filteredProviders.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
     );
  }

  // Basic sorting logic mock
  if (sortBy === 'rating') {
     filteredProviders.sort((a,b) => b.rating - a.rating);
  } else if (sortBy === 'distance') {
     // Distance is stored as "X.X km", parse it back to float for sorting
     filteredProviders.sort((a,b) => parseFloat(a.distance) - parseFloat(b.distance));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-color)' }}>
      {/* HEADER */}
      <div className="navbar" style={{ padding: '1rem', background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <button className="btn-icon" onClick={() => navigate(-1)} style={{ marginRight: '1rem', background: '#f8fafc', border: 'none' }}>
          <ArrowLeft size={20} />
        </button>
        <div className="search-container" style={{ margin: 0, flex: 1 }}>
          <Search className="search-icon" size={18} color="#94a3b8" />
          <input 
             type="text" 
             className="search-input" 
             placeholder="Search providers or skills..." 
             style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', background: '#f1f5f9', border: 'none', fontSize: '0.95rem' }}
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             autoFocus
          />
        </div>
      </div>

      <div className="page-content" style={{ overflowY: 'auto', paddingBottom: '80px' }}>
        
        {/* FILTERS & SORT */}
        <div style={{ position: 'sticky', top: 0, zIndex: 5, background: 'var(--bg-color)', padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
           <div className="filters-scroll" style={{ paddingBottom: '0.75rem' }}>
             <div className={`filter-chip ${activeFilter === 'All' ? 'active' : ''}`} onClick={() => setActiveFilter('All')}>All Categories</div>
             {categories.map(cat => (
                <div 
                   key={cat.id} 
                   className={`filter-chip ${activeFilter === cat.name ? 'active' : ''}`}
                   onClick={() => setActiveFilter(cat.name)}
                   style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  {cat.name}
                </div>
             ))}
           </div>
           
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <span className="text-sub" style={{ fontWeight: 500 }}>{filteredProviders.length} results</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: sortBy === 'rating' ? '#4f46e5' : '#64748b', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }} onClick={() => setSortBy('rating')}>
                    <Star size={14} fill={sortBy === 'rating' ? '#4f46e5' : 'none'}/> Top Rated
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: sortBy === 'distance' ? '#4f46e5' : '#64748b', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }} onClick={() => setSortBy('distance')}>
                    <SortDesc size={14}/> Nearest
                 </div>
              </div>
           </div>
        </div>

        {/* PROVIDERS LIST */}
        <div className="section" style={{ paddingTop: '1rem' }}>
          <div className="provider-list animate-fade-in">
            {filteredProviders.map(provider => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
            
            {filteredProviders.length === 0 && (
              <div className="text-center text-sub" style={{ padding: '3rem 1rem', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                <div style={{ width: 64, height: 64, background: '#f1f5f9', borderRadius: '50%', margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <Search size={28} color="#94a3b8" />
                </div>
                <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '1rem', marginBottom: '0.5rem' }}>No exact matches found</div>
                Try adjusting your filters or search terms.
              </div>
            )}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
