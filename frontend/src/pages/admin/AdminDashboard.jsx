import { useState, useEffect } from 'react';
import { 
  ArrowLeft, Users, BarChart2, ShieldCheck, Flag, LogOut, FileText, Trash2, X, 
  TrendingUp, CheckCircle, Search, User, Grid, Plus, Edit, 
  PieChart as PieIcon, Layers, ShieldAlert, Activity, Clock, MapPin, 
  Phone, Mail, IndianRupee, ArrowUpRight, ArrowDownRight, MoreVertical,
  Briefcase, MessageCircle, ChevronRight, Settings, Bell, Camera,
  LayoutDashboard, Filter
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import * as adminService from '../../service/adminService';
import * as categoryService from '../../service/categoryService';
import * as authService from '../../service/auth';
import { useDispatch, useSelector } from 'react-redux';
import { setAdminStats, setAdminProviders, setAdminUsers, setAdminReviews, setAdminData, setAdminActivity } from '../../redux-toolkit/slice/adminSlice';

import { setCategoryList } from '../../redux-toolkit/slice/categorySlice';
import { connectSocket, socket } from '../../socket/socket';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

export default function AdminDashboard() {
   const navigate = useNavigate();
   const [activeTab, setActiveTab] = useState('dashboard');
   const [loading, setLoading] = useState(true);
   const [searchQuery, setSearchQuery] = useState('');
   
   const dispatch = useDispatch();
   const stats = useSelector((state) => state.admin.stats) || { totalUsers: 0, totalProviders: 0, activeListings: 0, revenue: 0 };
   const providers = useSelector((state) => state.admin.providers) || [];
   const users = useSelector((state) => state.admin.users) || [];
   const reviews = useSelector((state) => state.admin.reviews) || [];
   const categories = useSelector((state) => state.category.categoryList) || [];
   const adminData = useSelector((state) => state.admin.adminData);
   const activityDataFromState = useSelector((state) => state.admin.activity);
   const activityData = activityDataFromState && activityDataFromState.length > 0 ? activityDataFromState : [
      { month: 'Jan', users: 400, vendors: 240, revenue: 2400 },
      { month: 'Feb', users: 300, vendors: 139, revenue: 2210 },
      { month: 'Mar', users: 200, vendors: 980, revenue: 2290 },
      { month: 'Apr', users: 278, vendors: 390, revenue: 2000 },
      { month: 'May', users: 189, vendors: 480, revenue: 2181 },
   ];


   const [modalOpen, setModalOpen] = useState(false);
   const [selectedProvider, setSelectedProvider] = useState(null);
   const [categoryModalOpen, setCategoryModalOpen] = useState(false);
   const [selectedCategory, setSelectedCategory] = useState(null);
   const [categoryForm, setCategoryForm] = useState({ name: '', image: '', description: '' });

   useEffect(() => {
      fetchDashboardData();

      socket.on('admin_update', () => {
         fetchDashboardData();
      });

      return () => {
         socket.off('admin_update');
      };
   }, []);

   const fetchDashboardData = async () => {
      try {
         setLoading(true);
         const res = await adminService.getAdminDashboardData();
         if (res.success) {
            dispatch(setAdminStats(res.data.stats));
            dispatch(setAdminProviders(res.data.providers));
            dispatch(setAdminUsers(res.data.users));
            dispatch(setAdminReviews(res.data.reviews));
            // Activity data is optional from backend, fallback to default if not present
            if(res.data.activity) {
               dispatch(setAdminActivity(res.data.activity));
            }

            connectSocket('admin');
         }
         const catRes = await categoryService.getCategories();
         if (catRes.success) {
            dispatch(setCategoryList(catRes.data));
         }
         const adminRes = await authService.getCurrentUser();
         if (adminRes.data?.success) {
            dispatch(setAdminData(adminRes.data.user));
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
      if (!window.confirm("Are you sure you want to delete this provider?")) return;
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
               dispatch(setCategoryList(categories.map(c => c._id === selectedCategory._id ? res.data : c)));
            }
         } else {
            const res = await categoryService.createCategory(categoryForm);
            if (res.success) {
               dispatch(setCategoryList([res.data, ...categories]));
            }
         }
         setCategoryModalOpen(false);
         setSelectedCategory(null);
         setCategoryForm({ name: '', image: '', description: '' });
      } catch (error) {
         console.error("Category action failed", error);
      }
   };

   const handleDeleteCategory = async (id) => {
      if (!window.confirm("Are you sure you want to delete this category?")) return;
      try {
         await categoryService.deleteCategory(id);
         dispatch(setCategoryList(categories.filter(c => c._id !== id)));
      } catch (error) {
         console.error("Delete category failed", error);
      }
   };

   const filteredProviders = providers.filter(p => {
      const query = searchQuery.toLowerCase();
      return (
         (p.fullName?.toLowerCase() || '').includes(query) ||
         (p.businessName?.toLowerCase() || '').includes(query) ||
         (p.category?.toLowerCase() || '').includes(query)
      );
   });

   const filteredUsers = users.filter(u => {
      const query = searchQuery.toLowerCase();
      return (u.fullName?.toLowerCase() || '').includes(query) || (u.email?.toLowerCase() || '').includes(query);
   });

   if (loading) {
      return (
         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f1f5f9', flexDirection: 'column', gap: '1rem' }}>
            <div className="animate-spin" style={{ width: 40, height: 40, border: '4px solid #e2e8f0', borderTopColor: '#4f46e5', borderRadius: '50%' }}></div>
            <div style={{ color: '#4f46e5', fontWeight: 600, fontSize: '0.875rem' }}>Securing Dashboard...</div>
         </div>
      );
   }

   return (
      <div className="admin-wrapper" style={{ height: '100vh', width: '100vw', maxWidth: '100%', position: 'fixed', top: 0, left: 0, backgroundColor: '#f8fafc', zIndex: 9999, overflow: 'hidden' }}>
         <style>{`
            .admin-layout { display: flex; height: 100vh; width: 100%; font-family: 'Inter', sans-serif; }
            .admin-sidebar { width: 260px; background: #0f172a; display: flex; flex-direction: column; color: #94a3b8; transition: all 0.3s; }
            .admin-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
            .admin-header { background: white; padding: 0.75rem 2rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; }
            .admin-content { flex: 1; padding: 2rem; overflow-y: auto; scroll-behavior: smooth; }
            .admin-tab { padding: 0.75rem 1.25rem; margin: 0.2rem 0.75rem; border-radius: 10px; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; transition: 0.2s; font-size: 0.9rem; }
            .admin-tab:hover { background: rgba(255,255,255,0.05); color: white; }
            .admin-tab.active { background: #4f46e5; color: white; }
            .admin-card { background: white; border-radius: 20px; padding: 1.5rem; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
            .admin-table { width: 100%; border-collapse: separate; border-spacing: 0 0.5rem; }
            .admin-table th { text-align: left; padding: 1rem; color: #64748b; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
            .admin-table td { padding: 1rem; background: white; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; }
            .admin-table tr td:first-child { border-left: 1px solid #f1f5f9; border-top-left-radius: 12px; border-bottom-left-radius: 12px; }
            .admin-table tr td:last-child { border-right: 1px solid #f1f5f9; border-top-right-radius: 12px; border-bottom-right-radius: 12px; }
            .animate-fade-in { animation: fadeIn 0.4s ease-out; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            
            @media (max-width: 768px) {
               .admin-sidebar { width: 80px; }
               .admin-sidebar .tab-text { display: none; }
               .admin-sidebar .logo-text { display: none; }
               .admin-header { padding: 0.75rem 1rem; }
               .admin-content { padding: 1rem; }
            }
         `}</style>

         <div className="admin-layout">
            {/* SIDEBAR */}
            <div className="admin-sidebar">
               <div style={{ padding: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 32, height: 32, background: '#4f46e5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                     <ShieldCheck size={20} />
                  </div>
                  <h1 className="logo-text" style={{ margin: 0, fontSize: '1.25rem', color: 'white', fontWeight: 700 }}>Admin<span style={{ color: '#4f46e5' }}>CRM</span></h1>
               </div>

               <div className={`admin-tab ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                  <LayoutDashboard size={20} /> <span className="tab-text">Overview</span>
               </div>
               <div className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                  <User size={20} /> <span className="tab-text">User Base</span>
               </div>
               <div className={`admin-tab ${activeTab === 'providers' ? 'active' : ''}`} onClick={() => setActiveTab('providers')}>
                  <Briefcase size={20} /> <span className="tab-text">Providers</span>
               </div>
               <div className={`admin-tab ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>
                  <Grid size={20} /> <span className="tab-text">Categories</span>
               </div>
               <div className={`admin-tab ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
                  <Flag size={20} /> <span className="tab-text">Moderation</span>
               </div>
               <div style={{ marginTop: 'auto', paddingBottom: '1rem' }}>
                  <div className={`admin-tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                     <Settings size={20} /> <span className="tab-text">Profile</span>
                  </div>
               </div>
            </div>

            {/* MAIN */}
            <div className="admin-main">
               <div className="admin-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                     <button onClick={() => navigate('/home')} style={{ background: '#f1f5f9', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', color: '#64748b' }}><ArrowLeft size={18}/></button>
                     <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                     <div style={{ position: 'relative' }}>
                        <Bell size={20} color="#64748b" />
                        <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: '#ef4444', borderRadius: '50%', border: '2px solid white' }}></span>
                     </div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '12px', background: '#f8fafc' }}>
                        <img src={`https://ui-avatars.com/api/?name=${adminData?.name || 'Admin'}&background=4f46e5&color=fff`} style={{ width: 32, height: 32, borderRadius: '50%' }} />
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }} className="tab-text">{adminData?.name || 'Super Admin'}</div>
                     </div>
                  </div>
               </div>

               <div className="admin-content">
                  {/* ---------------- OVERVIEW ---------------- */}
                  {activeTab === 'dashboard' && (
                     <div className="animate-fade-in">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                           <div className="admin-card">
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                 <div style={{ width: 48, height: 48, background: '#eef2ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}><Users size={24}/></div>
                                 <div style={{ color: '#10b981', background: '#dcfce7', padding: '2px 8px', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}><ArrowUpRight size={12}/> 12%</div>
                              </div>
                              <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>Total Users</div>
                              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', marginTop: '0.25rem' }}>{stats.totalUsers}</div>
                           </div>
                           <div className="admin-card">
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                 <div style={{ width: 48, height: 48, background: '#fff7ed', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f97316' }}><Briefcase size={24}/></div>
                                 <div style={{ color: '#10b981', background: '#dcfce7', padding: '2px 8px', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}><ArrowUpRight size={12}/> 5%</div>
                              </div>
                              <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>Total Providers</div>
                              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', marginTop: '0.25rem' }}>{stats.totalProviders}</div>
                           </div>
                           <div className="admin-card">
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                 <div style={{ width: 48, height: 48, background: '#f0fdf4', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}><IndianRupee size={24}/></div>
                                 <div style={{ color: '#10b981', background: '#dcfce7', padding: '2px 8px', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}><ArrowUpRight size={12}/> 24%</div>
                              </div>
                              <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>Total Revenue</div>
                              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', marginTop: '0.25rem' }}>₹{stats.revenue.toLocaleString()}</div>
                           </div>
                           <div className="admin-card">
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                 <div style={{ width: 48, height: 48, background: '#fef2f2', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}><ShieldAlert size={24}/></div>
                                 {providers.filter(p => !p.isKycVerified && (p.aadharNumber)).length > 0 && <div style={{ background: '#ef4444', color: 'white', width: 20, height: 20, borderRadius: '50%', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{providers.filter(p => !p.isKycVerified && p.aadharNumber).length}</div>}
                              </div>
                              <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>Pending KYC</div>
                              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', marginTop: '0.25rem' }}>{providers.filter(p => !p.isKycVerified && p.aadharNumber).length}</div>
                           </div>
                        </div>

                        {/* Activity Chart - Task 18 */}
                        <div className="admin-card" style={{ marginBottom: '2rem' }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>Growth & Activity</h3>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#64748b' }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4f46e5' }}></div> Revenue
                                 </div>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#64748b' }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></div> Users
                                 </div>
                              </div>
                           </div>
                           <div style={{ height: 300, width: '100%' }}>
                              <ResponsiveContainer width="100%" height="100%">
                                 <AreaChart data={activityData}>
                                    <defs>
                                       <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                       </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                    <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                    <Area type="monotone" dataKey="users" stroke="#10b981" strokeWidth={3} fillOpacity={0} />
                                 </AreaChart>
                              </ResponsiveContainer>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* ---------------- USERS ---------------- */}
                  {activeTab === 'users' && (
                     <div className="animate-fade-in">
                        <div className="admin-card">
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                              <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                                 <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                 <input type="text" placeholder="Search by name or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '0.6rem 0.75rem 0.6rem 2.5rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }} />
                              </div>
                              <button className="admin-btn admin-btn-outline" style={{ background: '#f8fafc' }}><Filter size={16}/> Filter</button>
                           </div>

                           <div style={{ overflowX: 'auto' }}>
                              <table className="admin-table">
                                 <thead>
                                    <tr>
                                       <th>User</th>
                                       <th>Email & Contact</th>
                                       <th>Joined Date</th>
                                       <th>Status</th>
                                       <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {filteredUsers.map(u => (
                                       <tr key={u._id}>
                                          <td>
                                             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <img src={u.profileImage || `https://ui-avatars.com/api/?name=${u.fullName}`} style={{ width: 40, height: 40, borderRadius: '10px', objectFit: 'cover' }} />
                                                <div style={{ fontWeight: 600, color: '#1e293b' }}>{u.fullName}</div>
                                             </div>
                                          </td>
                                          <td>
                                             <div style={{ fontSize: '0.875rem', color: '#1e293b' }}>{u.email}</div>
                                             <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.mobile || 'No Phone'}</div>
                                          </td>
                                          <td style={{ fontSize: '0.875rem', color: '#64748b' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                                          <td><span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 600 }}>Active</span></td>
                                          <td style={{ textAlign: 'right' }}>
                                             <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button onClick={() => handleDeleteUser(u._id)} style={{ width: 32, height: 32, borderRadius: '8px', border: 'none', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Trash2 size={16}/></button>
                                                <button style={{ width: 32, height: 32, borderRadius: '8px', border: 'none', background: '#f8fafc', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><MoreVertical size={16}/></button>
                                             </div>
                                          </td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* ---------------- PROVIDERS ---------------- */}
                  {activeTab === 'providers' && (
                     <div className="animate-fade-in">
                        <div style={{ display: 'grid', gap: '1rem' }}>
                           {filteredProviders.map(p => (
                              <div key={p._id} className="admin-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem' }}>
                                 <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ position: 'relative' }}>
                                       <img src={p.profileImage || `https://ui-avatars.com/api/?name=${p.fullName}`} style={{ width: 56, height: 56, borderRadius: '16px', objectFit: 'cover' }} />
                                       {p.isKycVerified ? (
                                          <div style={{ position: 'absolute', bottom: -5, right: -5, background: 'white', borderRadius: '50%', padding: '2px' }}><CheckCircle size={16} color="#10b981" fill="#dcfce7"/></div>
                                       ) : (p.aadharNumber && <div style={{ position: 'absolute', bottom: -5, right: -5, background: 'white', borderRadius: '50%', padding: '2px' }}><Clock size={16} color="#f59e0b" fill="#fef3c7"/></div>)}
                                    </div>
                                    <div>
                                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                          <h4 style={{ margin: 0, fontSize: '1rem', color: '#1e293b', fontWeight: 600 }}>{p.businessName || p.fullName}</h4>
                                          <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px', color: '#64748b' }}>{p.category || 'General'}</span>
                                       </div>
                                       <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '2px' }}>{p.mobile} &nbsp;•&nbsp; {p.email}</div>
                                    </div>
                                 </div>
                                 <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    {!p.isKycVerified && p.aadharNumber && (
                                       <button onClick={() => { setSelectedProvider(p); setModalOpen(true); }} style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '0.5rem 1.25rem', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>Review KYC</button>
                                    )}
                                    <button onClick={() => handleReject(p._id)} style={{ width: 40, height: 40, borderRadius: '10px', border: 'none', background: '#f1f5f9', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Trash2 size={18}/></button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {/* ---------------- CATEGORIES ---------------- */}
                  {activeTab === 'categories' && (
                     <div className="animate-fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                           <h3 style={{ margin: 0 }}>Category Management</h3>
                           <button onClick={() => { setSelectedCategory(null); setCategoryForm({ name: '', image: '', description: '' }); setCategoryModalOpen(true); }} style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}><Plus size={18}/> Add New</button>
                        </div>
                        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                           <table className="admin-table" style={{ margin: 0 }}>
                              <thead style={{ background: '#f8fafc' }}>
                                 <tr>
                                    <th style={{ paddingLeft: '1.5rem' }}>Preview</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th style={{ textAlign: 'right', paddingRight: '1.5rem' }}>Actions</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {categories.map(c => (
                                    <tr key={c._id}>
                                       <td style={{ paddingLeft: '1.5rem' }}><img src={c.image} style={{ width: 48, height: 48, borderRadius: '8px', objectFit: 'cover' }} /></td>
                                       <td style={{ fontWeight: 600 }}>{c.name}</td>
                                       <td style={{ fontSize: '0.875rem', color: '#64748b', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.description}</td>
                                       <td style={{ textAlign: 'right', paddingRight: '1.5rem' }}>
                                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                             <button onClick={() => { setSelectedCategory(c); setCategoryForm({ name: c.name, image: c.image, description: c.description }); setCategoryModalOpen(true); }} style={{ background: '#f1f5f9', border: 'none', padding: '0.4rem', borderRadius: '6px', color: '#4f46e5', cursor: 'pointer' }}><Edit size={16}/></button>
                                             <button onClick={() => handleDeleteCategory(c._id)} style={{ background: '#fef2f2', border: 'none', padding: '0.4rem', borderRadius: '6px', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16}/></button>
                                          </div>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  )}

                  {/* ---------------- PROFILE ---------------- */}
                  {activeTab === 'profile' && adminData && (
                     <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className="admin-card" style={{ width: '100%', maxWidth: '500px', textAlign: 'center' }}>
                           <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
                              <img src={`https://ui-avatars.com/api/?name=${adminData.name}&background=4f46e5&color=fff&size=128`} style={{ width: 120, height: 120, borderRadius: '50%', border: '4px solid #f1f5f9' }} />
                              <button style={{ position: 'absolute', bottom: 5, right: 5, background: '#4f46e5', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '50%' }}><Camera size={16}/></button>
                           </div>
                           <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{adminData.name}</h2>
                           <p style={{ color: '#64748b', margin: '0.5rem 0 1.5rem 0' }}>{adminData.email}</p>
                           
                           <div style={{ textAlign: 'left', background: '#f8fafc', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                 <span style={{ color: '#64748b' }}>Role</span>
                                 <span style={{ fontWeight: 600, color: '#4f46e5' }}>Super Admin</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                 <span style={{ color: '#64748b' }}>Phone</span>
                                 <span style={{ fontWeight: 600 }}>{adminData.phone || '+91 98765 43210'}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                 <span style={{ color: '#64748b' }}>Account Status</span>
                                 <span style={{ color: '#10b981', fontWeight: 600 }}>ACTIVE</span>
                              </div>
                           </div>
                           
                           <button onClick={() => { localStorage.removeItem('token'); navigate('/admin-auth'); }} style={{ width: '100%', marginTop: '2rem', padding: '0.75rem', borderRadius: '12px', border: '1px solid #ef4444', color: '#ef4444', background: 'transparent', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><LogOut size={18}/> Sign Out Admin</button>
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </div>

         {/* KYC MODAL */}
         {modalOpen && selectedProvider && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1rem' }}>
               <div className="admin-card" style={{ width: '100%', maxWidth: '450px', position: 'relative' }}>
                  <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={24}/></button>
                  <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>KYC Document Review</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                     <img src={selectedProvider.profileImage || `https://ui-avatars.com/api/?name=${selectedProvider.fullName}`} style={{ width: 56, height: 56, borderRadius: '12px' }} />
                     <div>
                        <div style={{ fontWeight: 700 }}>{selectedProvider.fullName}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{selectedProvider.category || 'General Provider'}</div>
                     </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                     <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem' }}>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Aadhar Number</div>
                        <div style={{ fontWeight: 600, letterSpacing: '0.1em' }}>{selectedProvider.aadharNumber || 'XXXX-XXXX-XXXX'}</div>
                     </div>
                     <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem' }}>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>PAN Number</div>
                        <div style={{ fontWeight: 600, letterSpacing: '0.1em' }}>{selectedProvider.panNumber || 'XXXXX0000X'}</div>
                     </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                     <button onClick={() => handleReject(selectedProvider._id)} style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: '1px solid #ef4444', color: '#ef4444', background: 'transparent', fontWeight: 600, cursor: 'pointer' }}>Reject Case</button>
                     <button onClick={() => handleApprove(selectedProvider._id)} style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: 'none', background: '#10b981', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Approve KYC</button>
                  </div>
               </div>
            </div>
         )}

         {/* CATEGORY MODAL */}
         {categoryModalOpen && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1rem' }}>
               <div className="admin-card" style={{ width: '100%', maxWidth: '450px', position: 'relative' }}>
                  <button onClick={() => setCategoryModalOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={24}/></button>
                  <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>{selectedCategory ? 'Edit Category' : 'Create Category'}</h3>
                  <form onSubmit={handleCategorySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                     <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Category Name</label>
                        <input type="text" required value={categoryForm.name} onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})} placeholder="e.g. Electrician" style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }} />
                     </div>
                     <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Icon/Image URL</label>
                        <input type="text" required value={categoryForm.image} onChange={(e) => setCategoryForm({...categoryForm, image: e.target.value})} placeholder="https://image-url.com" style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }} />
                     </div>
                     <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Description</label>
                        <textarea rows="3" value={categoryForm.description} onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})} placeholder="What does this category cover?" style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', resize: 'none' }} />
                     </div>
                     <button type="submit" style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '0.8rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem' }}>{selectedCategory ? 'Update Category' : 'Create Category'}</button>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
}
