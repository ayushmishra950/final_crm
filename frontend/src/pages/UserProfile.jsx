import { useEffect, useState } from 'react';
import { ArrowLeft, Edit3, MapPin, CreditCard, HelpCircle, FileText, LogOut, ChevronRight, Wallet, CheckCircle, Clock, Briefcase, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { bookingHistory } from '../data/dummyData';
import { getCurrentUser, updateProfile } from '../service/auth';
import { setUserData } from "@/redux-toolkit/slice/userSlice";
import { useAppDispatch, useAppSelector } from '@/redux-toolkit/customHook/customHook';

export default function UserProfile() {
   const navigate = useNavigate();
   const [isEditing, setIsEditing] = useState(false);
   const [editFormData, setEditFormData] = useState({});
   const dispatch = useAppDispatch();
   const user = useAppSelector((state) => state?.user?.userData);

   const handleUpdateProfile = async (e) => {
      e.preventDefault();
      try {
         const res = await updateProfile(editFormData);
         if (res.status === 200) {
            dispatch(setUserData(res.data.user));
            setIsEditing(false);
         }

      } catch (error) {
         console.log(error);
      }
   }

   const fetchUserData = async () => {
      try {
         const res = await getCurrentUser();
         if (res.status === 200) {
            dispatch(setUserData(res.data.user));
         }

      } catch (error) {
         console.log(error);
      }
   }

   useEffect(() => {
      if (!user || Object.keys(user).length === 0) {
         fetchUserData();
      }
   }, [user]);

   return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f8fafc' }}>
         {/* Premium Header */}
         <div className="navbar" style={{ padding: '1.25rem 1rem', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <button className="btn-icon" onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', padding: '0.25rem' }}>
                  <ArrowLeft size={24} color="#1e293b" />
               </button>
               <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#1e293b' }}>Account & Details</h1>
            </div>
            <button className="btn-icon" onClick={() => { setEditFormData(user || {}); setIsEditing(true); }} style={{ background: '#f1f5f9', border: 'none', color: '#4f46e5', cursor: 'pointer' }}>
               <Edit3 size={18} />
            </button>
         </div>

         {isEditing && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
               <div className="animate-fade-in" style={{ background: 'white', width: '100%', maxWidth: '400px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '24px', padding: '2rem 1.5rem', position: 'relative' }}>
                  <button onClick={() => setIsEditing(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={24} /></button>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>Edit Details</h2>

                  <form onSubmit={handleUpdateProfile}>
                     <div className="input-group" style={{ marginBottom: '1rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>Full Name</label>
                        <input type="text" className="input-field" value={editFormData?.fullName || ''} onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px' }} required />
                     </div>
                     <div className="input-group" style={{ marginBottom: '1rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>Mobile Number</label>
                        <input type="tel" className="input-field" value={editFormData?.mobile || ''} onChange={(e) => setEditFormData({ ...editFormData, mobile: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px' }} required />
                     </div>
                     <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
                        <input type="email" className="input-field" value={editFormData?.email || ''} onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px' }} required />
                     </div>
                     <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>Address</label>
                        <textarea className="input-field" value={editFormData?.address || ''} onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', minHeight: '80px', resize: 'vertical' }} placeholder="Enter full address" />
                     </div>
                     <button type="submit" style={{ width: '100%', background: '#4f46e5', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Save Changes</button>
                  </form>
               </div>
            </div>
         )}

         <div className="page-content" style={{ overflowY: 'auto', paddingBottom: '90px' }}>

            {/* Profile Card Widget */}
            <div style={{ background: 'white', padding: '2rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
               <div style={{ position: 'relative', marginBottom: '1rem' }}>
                  <img src="https://i.pravatar.cc/150?img=11" style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} alt="User Avatar" />
                  <div style={{ position: 'absolute', bottom: '0', right: '0', background: '#10b981', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
                     <CheckCircle size={10} color="white" />
                  </div>
               </div>
               <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem', fontWeight: 600, color: '#1e293b' }}>{user?.fullName}</h2>
               <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>{user?.mobile} • {user?.email}</div>
            </div>

            <div className="section" style={{ paddingTop: '1.5rem' }}>

               {/* Quick Actions Grid */}
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                  <div className="animate-fade-in" style={{ background: 'white', padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                     <div style={{ background: '#eef2ff', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}><Wallet size={20} /></div>
                     <div style={{ color: '#64748b', fontSize: '0.875rem' }}>BharatSeva Cash</div>
                     <div style={{ fontWeight: 600, fontSize: '1.25rem', color: '#1e293b' }}>₹250</div>
                  </div>
                  <div className="animate-fade-in" style={{ background: 'white', padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                     <div style={{ background: '#fef3c7', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}><HelpCircle size={20} /></div>
                     <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Help Center</div>
                     <div style={{ fontWeight: 600, fontSize: '1rem', color: '#1e293b', marginTop: 'auto' }}>Get Support</div>
                  </div>
               </div>

               {/* Recent Bookings */}
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.125rem', margin: 0, fontWeight: 600, color: '#1e293b' }}>Recent Bookings</h3>
                  <span style={{ fontSize: '0.875rem', color: '#4f46e5', fontWeight: 600, cursor: 'pointer' }}>View All</span>
               </div>
               <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  {bookingHistory.slice(0, 2).map((booking, idx) => (
                     <div key={idx} style={{ background: 'white', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', borderLeft: booking.status === 'Completed' ? '4px solid #10b981' : '4px solid #f59e0b', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                           <div>
                              <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '1rem' }}>{booking.providerName}</div>
                              <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '2px' }}>{booking.category}</div>
                           </div>
                           <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: booking.status === 'Completed' ? '#10b981' : '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                 {booking.status === 'Completed' ? <CheckCircle size={14} /> : <Clock size={14} />} {booking.status}
                              </div>
                              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', marginTop: '2px' }}>{booking.amount}</div>
                           </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #e2e8f0', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                           <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Booked on {booking.date}</span>
                           {booking.status === 'Completed' ? (
                              <button style={{ background: '#f1f5f9', color: '#4f46e5', border: '1px solid #e2e8f0', padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>Rebook</button>
                           ) : (
                              <button style={{ background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a', padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>Track Partner</button>
                           )}
                        </div>
                     </div>
                  ))}
               </div>

               {/* Account Settings Menu */}
               <h3 style={{ fontSize: '1.125rem', margin: '0 0 1rem 0', fontWeight: 600, color: '#1e293b' }}>Settings & Legal</h3>
               <div className="animate-fade-in" style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'white'}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#334155', fontWeight: 500 }}>
                        <div style={{ background: '#f1f5f9', padding: '0.5rem', borderRadius: '8px', color: '#64748b' }}><MapPin size={18} /></div>
                        Manage Addresses
                     </div>
                     <ChevronRight size={18} color="#cbd5e1" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'white'}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#334155', fontWeight: 500 }}>
                        <div style={{ background: '#f1f5f9', padding: '0.5rem', borderRadius: '8px', color: '#64748b' }}><CreditCard size={18} /></div>
                        Payment Methods
                     </div>
                     <ChevronRight size={18} color="#cbd5e1" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'white'}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#334155', fontWeight: 500 }}>
                        <div style={{ background: '#f1f5f9', padding: '0.5rem', borderRadius: '8px', color: '#64748b' }}><FileText size={18} /></div>
                        Terms & Privacy Policy
                     </div>
                     <ChevronRight size={18} color="#cbd5e1" />
                  </div>
               </div>

               {/* Switch Mode Action */}
               <button onClick={() => navigate('/provider-dashboard')} style={{ width: '100%', background: '#4f46e5', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', marginBottom: '1rem' }}>
                  <Briefcase size={20} /> Switch to Partner Mode
               </button>

               {/* Logout Action */}
               <button onClick={() => navigate('/')} style={{ width: '100%', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', padding: '1rem', borderRadius: '12px', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                  <LogOut size={20} /> Logout Securely
               </button>
               <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', marginTop: '1.5rem' }}>App Version 1.0.4 build 28</div>

            </div>
         </div>
         <BottomNav />
      </div>
   );
}
