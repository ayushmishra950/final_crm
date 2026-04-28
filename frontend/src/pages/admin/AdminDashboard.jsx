import { useState, useEffect } from 'react';
import { ArrowLeft, Users, BarChart2, ShieldCheck, Flag, LogOut, FileText, Trash2, X, TrendingUp, CheckCircle, Search, User, Grid, Plus, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as adminService from '../../service/adminService';
import * as categoryService from '../../service/categoryService';
import { useDispatch, useSelector } from 'react-redux';
import { setAdminStats, setAdminProviders, setAdminUsers, setAdminReviews, setAdminCategories } from '../../redux-toolkit/slice/adminSlice';
import { connectSocket } from '../../socket/socket';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const dispatch = useDispatch();
  const stats = useSelector((state) => state.admin.stats) || { totalUsers: 0, totalProviders: 0, activeListings: 0, revenue: 0 };
  const providers = useSelector((state) => state.admin.providers) || [];
  const users = useSelector((state) => state.admin.users) || [];
  const reviews = useSelector((state) => state.admin.reviews) || [];
  const categories = useSelector((state) => state.admin.categories) || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', image: '', description: '' });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
      try {
          const res = await adminService.getAdminDashboardData();
          if (res.success) {
              dispatch(setAdminStats(res.data.stats));
              dispatch(setAdminProviders(res.data.providers));
              dispatch(setAdminUsers(res.data.users));
              dispatch(setAdminReviews(res.data.reviews));
              connectSocket('admin'); // connect socket for admin
          }
          const catRes = await categoryService.getCategories();
          if (catRes.success) {
              dispatch(setAdminCategories(catRes.data));
          }
      } catch (error) {
          console.error("Failed to fetch admin data", error);
      } finally {
          setLoading(false);
      }
  };

  const handleApprove = async (id) => {
     try {
         await adminService.verifyVendorKyc(id);
         dispatch(setAdminProviders(providers.map(p => p._id === id ? { ...p, isKycVerified: true } : p)));
         setModalOpen(false);
     } catch (error) {
         console.error("Verification failed", error);
     }
  };

  const handleReject = async (id) => {
     if(!window.confirm("Are you sure you want to delete this provider?")) return;
     try {
         await adminService.removeUserOrVendor(id);
         dispatch(setAdminProviders(providers.filter(p => p._id !== id)));
         setModalOpen(false);
     } catch (error) {
         console.error("Rejection failed", error);
     }
  };

  const handleDeleteUser = async (id) => {
     if (!window.confirm("Are you sure you want to remove this user?")) return;
     try {
         await adminService.removeUserOrVendor(id);
         dispatch(setAdminUsers(users.filter(u => u._id !== id)));
     } catch (error) {
         console.error("Delete failed", error);
     }
  };

  const handleCategorySubmit = async (e) => {
      e.preventDefault();
      try {
          if (selectedCategory) {
              const res = await categoryService.updateCategory(selectedCategory._id, categoryForm);
              if (res.success) {
                  dispatch(setAdminCategories(categories.map(c => c._id === selectedCategory._id ? res.data : c)));
              }
          } else {
              const res = await categoryService.createCategory(categoryForm);
              if (res.success) {
                  dispatch(setAdminCategories([res.data, ...categories]));
              }
          }
          setCategoryModalOpen(false);
          setSelectedCategory(null);
          setCategoryForm({ name: '', image: '', description: '' });
      } catch (error) {
          console.error("Category action failed", error);
          alert(error.message || "Something went wrong");
      }
  };

  const handleDeleteCategory = async (id) => {
      if (!window.confirm("Are you sure you want to delete this category?")) return;
      try {
          await categoryService.deleteCategory(id);
          dispatch(setAdminCategories(categories.filter(c => c._id !== id)));
      } catch (error) {
          console.error("Delete category failed", error);
      }
  };

  const filteredProviders = providers.filter(p => 
      (p.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
      (p.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) || '') || 
      (p.category?.toLowerCase().includes(searchQuery.toLowerCase()) || '')
  );

  const filteredUsers = users.filter(u => 
      (u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
      (u.email?.toLowerCase().includes(searchQuery.toLowerCase()) || '')
  );

  const filteredCategories = categories.filter(c => 
      (c.name?.toLowerCase().includes(searchQuery.toLowerCase()) || '')
  );

  if (loading) {
      return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>Loading Dashboard...</div>;
  }

  return (
    <div className="admin-wrapper" style={{ height: '100vh', width: '100vw', maxWidth: '100%', position: 'fixed', top: 0, left: 0, backgroundColor: '#f8fafc', zIndex: 9999 }}>
      <style>{`
        /* Scoped Admin CSS for deep responsiveness and distinct UI */
        .admin-layout {
          display: flex;
          height: 100vh;
          width: 100%;
          font-family: 'Outfit', sans-serif;
          color: #334155;
        }
        .admin-sidebar {
          width: 260px;
          background: #ffffff;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          box-shadow: 2px 0 10px rgba(0,0,0,0.02);
          z-index: 10;
        }
        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #f1f5f9;
        }
        .admin-header {
          background: #ffffff;
          padding: 1rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02);
        }
        .admin-content {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }
        .admin-tab {
          padding: 0.8rem 1.25rem;
          margin: 0.25rem 1rem;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #64748b;
          font-weight: 500;
          transition: all 0.2s;
        }
        .admin-tab:hover { background: #f8fafc; color: #4f46e5; }
        .admin-tab.active { background: #eef2ff; color: #4f46e5; font-weight: 600; }
        
        .admin-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
          transition: transform 0.2s;
        }
        .admin-stat-value { font-size: 2.25rem; font-weight: 600; margin-top: 0.5rem; color: #4f46e5; }
        
        .admin-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        
        .admin-btn { padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.875rem; cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem; font-weight: 500; border: none; }
        .admin-btn-primary { background: #4f46e5; color: white; }
        .admin-btn-outline { background: transparent; border: 1px solid #cbd5e1; color: #475569; }
        .admin-btn-danger { background: #fee2e2; color: #ef4444; border: 1px solid #fecaca; }
        
        .admin-badge { padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; display: inline-flex; align-items: center; gap: 0.25rem; }
        
        /* Mobile Adaptability */
        @media (max-width: 1024px) {
           .admin-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .admin-layout { flex-direction: column; }
          .admin-sidebar { 
             width: 100%; 
             flex-direction: row; 
             border-right: none; 
             border-bottom: 1px solid #e2e8f0; 
             overflow-x: auto; 
             padding: 0.5rem;
             white-space: nowrap;
             box-shadow: 0 2px 4px rgba(0,0,0,0.02);
          }
          .admin-sidebar::-webkit-scrollbar { display: none; }
          .admin-tab { margin: 0 0.5rem; padding: 0.6rem 1rem; }
          .admin-header { padding: 1rem; }
          .admin-content { padding: 1rem; }
          .admin-sidebar > div:first-child { display: none; } /* Hide logo from sidebar on mobile */
        }
        @media (max-width: 480px) {
          .admin-grid { grid-template-columns: 1fr; }
          .admin-search { width: 100%; }
        }
      `}</style>

      <div className="admin-layout">
         
         {/* SIDEBAR */}
         <div className="admin-sidebar">
            <div style={{ padding: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
               <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                  <ArrowLeft size={24} color="#4f46e5" />
               </button>
               <div>
                  <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#4f46e5', fontWeight: 600 }}>BharatSeva</h1>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px' }}>Admin Workspace</div>
               </div>
            </div>

            <div className={`admin-tab ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
               <BarChart2 size={20}/> Overview
            </div>
            <div className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
               <User size={20}/> Platform Users
            </div>
            <div className={`admin-tab ${activeTab === 'providers' ? 'active' : ''}`} onClick={() => setActiveTab('providers')} style={{ position: 'relative' }}>
               <Users size={20}/> Service Providers
               {providers.filter(p => !p.isKycVerified && (p.aadharNumber || p.panNumber || p.bankPassbook)).length > 0 && (
                  <span style={{ position: 'absolute', right: '1rem', background: '#ef4444', color: 'white', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold' }}>
                     {providers.filter(p => !p.isKycVerified && (p.aadharNumber || p.panNumber || p.bankPassbook)).length} New
                  </span>
               )}
            </div>
            <div className={`admin-tab ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
               <Flag size={20}/> Content Moderation
            </div>
            <div className={`admin-tab ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>
               <Grid size={20}/> Categories
            </div>
         </div>

         {/* MAIN WORKSPACE */}
         <div className="admin-main">
            
            <div className="admin-header">
               <div>
                  <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 600 }}>
                      {activeTab === 'dashboard' ? 'Control Panel' : activeTab === 'providers' ? 'Network & KYC' : activeTab === 'users' ? 'User Management' : activeTab === 'categories' ? 'Service Categories' : 'Trust & Moderation'}
                  </h2>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingRight: '1rem', borderRight: '1px solid #e2e8f0' }}>
                     <img src="https://i.pravatar.cc/150?u=admin" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                     <div className="hidden-mobile">
                        <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Superadmin</div>
                     </div>
                  </div>
                  <button className="admin-btn admin-btn-outline" onClick={() => navigate('/')}>
                     <LogOut size={16} /> <span className="hidden-mobile">Sign Out</span>
                  </button>
               </div>
            </div>

            <div className="admin-content">
               
               {/* ----------------- DASHBOARD ----------------- */}
               {activeTab === 'dashboard' && (
                  <div className="animate-fade-in">
                     <div className="admin-grid" style={{ marginBottom: '2rem' }}>
                        <div className="admin-card">
                           <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>Total Users Managed</div>
                           <div className="admin-stat-value">{stats.totalUsers.toLocaleString()}</div>
                        </div>
                        <div className="admin-card">
                           <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>Verified Providers</div>
                           <div className="admin-stat-value">{stats.totalProviders}</div>
                        </div>
                        <div className="admin-card" style={{ borderBottom: '4px solid #10b981' }}>
                           <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>Active Listings</div>
                           <div className="admin-stat-value" style={{ color: '#10b981' }}>{stats.activeListings}</div>
                        </div>
                        <div className="admin-card" style={{ borderBottom: '4px solid #4f46e5' }}>
                           <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>Overall Revenue</div>
                           <div className="admin-stat-value" style={{ color: '#4f46e5' }}>₹{stats.revenue}</div>
                        </div>
                     </div>

                     <div className="admin-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                           <h3 style={{ fontSize: '1.125rem', margin: 0, fontWeight: 600 }}>City-wise Enrollment Growth</h3>
                           <div className="admin-badge" style={{ background: '#dcfce7', color: '#166534' }}><TrendingUp size={14}/> +14% Surge</div>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>Displaying real-time growth curve for Tier-2 cities.</p>
                        <div style={{ height: '300px', background: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #cbd5e1' }}>
                           <BarChart2 size={64} color="#cbd5e1"/>
                        </div>
                     </div>
                  </div>
               )}

               {/* ----------------- USERS ----------------- */}
               {activeTab === 'users' && (
                  <div className="animate-fade-in">
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
                           <Search size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: '#94a3b8' }}/>
                           <input type="text" placeholder="Search users by name or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '99px', border: '1px solid #cbd5e1', outline: 'none', background: 'white' }} />
                        </div>
                     </div>

                     <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {filteredUsers.map(u => (
                           <div key={u._id} className="admin-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                 <img src={u.profileImage || `https://ui-avatars.com/api/?name=${u.fullName}`} style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }} />
                                 <div>
                                    <h4 style={{ margin: 0, fontSize: '1rem', color: '#1e293b' }}>{u.fullName}</h4>
                                    <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '2px' }}>{u.email} &nbsp;•&nbsp; {u.mobile}</div>
                                 </div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                 <button className="admin-btn admin-btn-danger" onClick={() => handleDeleteUser(u._id)}>
                                     <Trash2 size={16}/> Delete Account
                                 </button>
                              </div>
                           </div>
                        ))}
                        {filteredUsers.length === 0 && (
                           <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No users found.</div>
                        )}
                     </div>
                  </div>
               )}

               {/* ----------------- PROVIDERS ----------------- */}
               {activeTab === 'providers' && (
                  <div className="animate-fade-in">
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
                           <Search size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: '#94a3b8' }}/>
                           <input type="text" placeholder="Search provider names or categories..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '99px', border: '1px solid #cbd5e1', outline: 'none', background: 'white' }} />
                        </div>
                     </div>

                     <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {filteredProviders.map(p => (
                           <div key={p._id} className="admin-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                 <img src={p.profileImage || `https://ui-avatars.com/api/?name=${p.fullName}`} style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }} />
                                 <div>
                                    <h4 style={{ margin: 0, fontSize: '1rem', color: '#1e293b' }}>{p.businessName || p.fullName}</h4>
                                    <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '2px' }}>{p.category || "General"} &nbsp;•&nbsp; {p.mobile}</div>
                                 </div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                 {p.isKycVerified ? (
                                    <div className="admin-badge" style={{ background: '#dcfce7', color: '#166534', padding: '0.5rem 1rem' }}>
                                       <ShieldCheck size={16} /> Fully Verified
                                    </div>
                                 ) : (
                                    <button className="admin-btn admin-btn-primary" onClick={() => { setSelectedProvider(p); setModalOpen(true); }}>
                                       <FileText size={16}/> KYC Review Action
                                    </button>
                                 )}
                                 <button className="admin-btn admin-btn-outline" style={{ borderColor: '#ef4444', color: '#ef4444' }} onClick={() => handleReject(p._id)}>
                                    <Trash2 size={16} /> Delete
                                 </button>
                              </div>
                           </div>
                        ))}
                        {filteredProviders.length === 0 && (
                           <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No providers found.</div>
                        )}
                     </div>
                  </div>
               )}

               {/* ----------------- CATEGORIES ----------------- */}
               {activeTab === 'categories' && (
                  <div className="animate-fade-in">
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
                           <Search size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: '#94a3b8' }}/>
                           <input type="text" placeholder="Search categories..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '99px', border: '1px solid #cbd5e1', outline: 'none', background: 'white' }} />
                        </div>
                        <button className="admin-btn admin-btn-primary" onClick={() => { setSelectedCategory(null); setCategoryForm({ name: '', image: '', description: '' }); setCategoryModalOpen(true); }}>
                           <Plus size={18} /> Add Category
                        </button>
                     </div>

                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {filteredCategories.map(c => (
                           <div key={c._id} className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                              <img src={c.image || 'https://via.placeholder.com/150'} style={{ width: '100%', height: '160px', borderRadius: '12px', objectFit: 'cover' }} />
                              <div>
                                 <h4 style={{ margin: 0, fontSize: '1.125rem', color: '#1e293b' }}>{c.name}</h4>
                                 <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px', height: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.description || "No description provided."}</p>
                              </div>
                              <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                                 <button className="admin-btn admin-btn-outline" style={{ flex: 1 }} onClick={() => { setSelectedCategory(c); setCategoryForm({ name: c.name, image: c.image, description: c.description || '' }); setCategoryModalOpen(true); }}>
                                    <Edit size={16} /> Edit
                                 </button>
                                 <button className="admin-btn admin-btn-danger" style={{ flex: 1 }} onClick={() => handleDeleteCategory(c._id)}>
                                    <Trash2 size={16} /> Delete
                                 </button>
                              </div>
                           </div>
                        ))}
                        {filteredCategories.length === 0 && (
                           <div style={{ gridColumn: '1/-1', padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No categories found.</div>
                        )}
                     </div>
                  </div>
               )}

               {/* ----------------- REVIEWS ----------------- */}
               {activeTab === 'reviews' && (
                  <div className="animate-fade-in">
                     <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Monitoring platform reviews and user sentiments.</p>
                     
                     {reviews.length === 0 ? (
                        <div className="admin-card" style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
                           <ShieldCheck size={48} color="#10b981" style={{ margin: '0 auto 1rem auto' }}/>
                           <div style={{ fontSize: '1.125rem', fontWeight: 500, color: '#1e293b' }}>All Clear!</div>
                           Platform environment is clean.
                        </div>
                     ) : (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                           {reviews.map(rev => (
                              <div key={rev._id} className="admin-card" style={{ borderLeft: '4px solid #f59e0b' }}>
                                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    <div>
                                       <span style={{ fontWeight: 600, color: '#1e293b' }}>{rev.userId?.fullName || 'User'}</span>
                                       <span style={{ color: '#64748b', fontSize: '0.875rem' }}> reviewed </span>
                                       <span style={{ fontWeight: 500, color: '#4f46e5' }}>{rev.vendorId?.businessName || rev.vendorId?.fullName || 'Vendor'}</span>
                                       <span style={{ marginLeft: '1rem', color: '#f59e0b', fontSize: '0.875rem' }}>{rev.rating}/5 Stars</span>
                                    </div>
                                 </div>
                                 <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '8px', color: '#334155', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                                    "{rev.comment}"
                                 </div>
                                 <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                    <button className="admin-btn admin-btn-danger" onClick={() => dispatch(setAdminReviews(reviews.filter(r => r._id !== rev._id)))}>
                                       <Trash2 size={16}/> Delete Review
                                    </button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
               )}
            </div>
         </div>

         {/* ----------------- KYC MODAL ----------------- */}
         {modalOpen && selectedProvider && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyItems: 'center', padding: '1rem' }}>
               <div className="admin-card animate-fade-in" style={{ width: '450px', maxWidth: '100%', margin: '0 auto', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                  <button className="admin-btn" style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#f1f5f9', color: '#64748b', padding: '0.4rem' }} onClick={() => setModalOpen(false)}><X size={20}/></button>
                  
                  <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', color: '#1e293b' }}>KYC Verification Case</h2>
                  
                  <div style={{ textAlign: 'center', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                     <img src={selectedProvider.profileImage || `https://ui-avatars.com/api/?name=${selectedProvider.fullName}`} style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '1rem' }} />
                     <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{selectedProvider.businessName || selectedProvider.fullName}</h3>
                     <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '4px 0 0 0' }}>{selectedProvider.category || 'General'} ID: BHARAT-{selectedProvider._id.slice(-4)}</p>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                     <h4 style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Document Details</h4>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px' }}>
                           <span style={{ fontWeight: 500 }}>Aadhar Number</span>
                           <span style={{ color: '#4f46e5', fontWeight: 600 }}>{selectedProvider.aadharNumber || 'Not Submitted'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px' }}>
                           <span style={{ fontWeight: 500 }}>PAN Number</span>
                           <span style={{ color: '#4f46e5', fontWeight: 600 }}>{selectedProvider.panNumber || 'Not Submitted'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px' }}>
                           <span style={{ fontWeight: 500 }}>Bank Passbook</span>
                           <span style={{ color: '#4f46e5', fontWeight: 600 }}>{selectedProvider.bankPassbook || 'Not Submitted'}</span>
                        </div>
                     </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                     <button className="admin-btn admin-btn-outline" style={{ flex: 1, borderColor: '#ef4444', color: '#ef4444' }} onClick={() => handleReject(selectedProvider._id)}>Reject & Delete</button>
                     <button className="admin-btn admin-btn-primary" style={{ flex: 1, background: '#10b981' }} onClick={() => handleApprove(selectedProvider._id)}>Approve KYC</button>
                  </div>
               </div>
            </div>
         )}

         {/* ----------------- CATEGORY MODAL ----------------- */}
         {categoryModalOpen && (
             <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyItems: 'center', padding: '1rem' }}>
                <div className="admin-card animate-fade-in" style={{ width: '500px', maxWidth: '100%', margin: '0 auto', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                   <button className="admin-btn" style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#f1f5f9', color: '#64748b', padding: '0.4rem' }} onClick={() => setCategoryModalOpen(false)}><X size={20}/></button>
                   
                   <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', color: '#1e293b' }}>{selectedCategory ? 'Update Category' : 'Create New Category'}</h2>
                   
                   <form onSubmit={handleCategorySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div>
                         <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#475569' }}>Category Name</label>
                         <input type="text" required value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} placeholder="e.g. Electrician, Plumber" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                      </div>
                      <div>
                         <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#475569' }}>Image URL</label>
                         <input type="text" required value={categoryForm.image} onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })} placeholder="https://example.com/image.jpg" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                      </div>
                      <div>
                         <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#475569' }}>Description (Optional)</label>
                         <textarea rows="3" value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} placeholder="Short description of services in this category..." style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', resize: 'none' }} />
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                         <button type="button" className="admin-btn admin-btn-outline" style={{ flex: 1 }} onClick={() => setCategoryModalOpen(false)}>Cancel</button>
                         <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1 }}>{selectedCategory ? 'Save Changes' : 'Create Category'}</button>
                      </div>
                   </form>
                </div>
             </div>
         )}

      </div>
    </div>
  );
}
