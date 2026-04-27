import { useState, useEffect } from 'react';
import { ArrowLeft, 
  BarChart2, Briefcase, IndianRupee, UserCircle, 
  MapPin, PhoneCall, CheckCircle, Upload, Power, 
  Clock, ShieldCheck, Camera, CreditCard, ChevronRight, User, ShieldAlert, X, Edit3, Plus, Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as vendorService from '../../service/vendorService';
import * as serviceManagement from '../../service/serviceManagement';

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home'); 
  const [isOnline, setIsOnline] = useState(true);
  const [toast, setToast] = useState(null);
  const [isKycVerified, setIsKycVerified] = useState(false);
  const [showKycForm, setShowKycForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCompletionAlert, setShowCompletionAlert] = useState(false);
  
  const [vendorUser, setVendorUser] = useState({ 
    fullName: '', 
    mobile: '', 
    about: '', 
    businessName: '',
    category: '',
    operatingRadius: 10,
    address: ''
  });

  const [dashboardData, setDashboardData] = useState({
    stats: {
        totalBookings: 0,
        pendingBookings: 0,
        acceptedBookings: 0,
        totalEarnings: 0
    },
    recentBookings: [],
    reviews: []
  });

  const [myServices, setMyServices] = useState([]);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    images: []
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [dashRes, servicesRes] = await Promise.all([
        vendorService.getVendorDashboard(),
        serviceManagement.getMyServices()
      ]);

      if (dashRes.success) {
        setDashboardData(dashRes.data);
        setVendorUser(dashRes.data.vendor);
        setIsOnline(dashRes.data.vendor.isOnline);
        setIsKycVerified(dashRes.data.vendor.isKycVerified);
      }

      if (servicesRes.success) {
        setMyServices(servicesRes.services);
      }
    } catch (error) {
      console.error("Error fetching vendor data:", error);
      showToast("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const checkProfileCompletion = () => {
    if (!isKycVerified || !vendorUser.category || !vendorUser.about) {
       setShowCompletionAlert(true);
       return false;
    }
    return true;
  };

  const isKycPending = !isKycVerified && (vendorUser.aadharNumber || vendorUser.panNumber || vendorUser.bankPassbook);

  const handleToggleOnline = async () => {
    if (!checkProfileCompletion()) return;
    try {
        const newStatus = !isOnline;
        const res = await vendorService.updateAvailability(newStatus);
        if (res.success) {
            setIsOnline(newStatus);
            showToast(res.message);
        }
    } catch (error) {
        showToast("Failed to update status");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
        const res = await vendorService.updateVendorProfile(vendorUser);
        if (res.success) {
            setVendorUser(res.vendor);
            setIsEditing(false);
            showToast("Profile Updated Successfully!");
        }
    } catch (error) {
        showToast("Failed to update profile");
    }
  };

  const handleSubmitKyc = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
        const res = await vendorService.submitKyc(data);
        if (res.success) {
            setVendorUser(res.vendor);
            setShowKycForm(false);
            showToast("KYC Documents Submitted Successfully!");
        }
    } catch (error) {
        showToast("Failed to submit KYC");
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
        const res = await serviceManagement.createService(newService);
        if (res.success) {
            setMyServices([res.service, ...myServices]);
            setShowAddService(false);
            setNewService({ name: '', description: '', price: '', category: '', images: [] });
            showToast("Service added successfully!");
        }
    } catch (error) {
        showToast("Failed to add service");
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
        const res = await serviceManagement.deleteService(id);
        if (res.success) {
            setMyServices(myServices.filter(s => s._id !== id));
            showToast("Service deleted");
        }
    } catch (error) {
        showToast("Failed to delete service");
    }
  };

  const handleUpdateBooking = async (id, status) => {
    if (!checkProfileCompletion()) return;
    try {
        const res = await vendorService.updateBookingStatus(id, status);
        if (res.success) {
            const updatedBookings = dashboardData.recentBookings.map(b => 
                b._id === id ? { ...b, status } : b
            );
            setDashboardData({ ...dashboardData, recentBookings: updatedBookings });
            showToast(`Booking ${status}`);
        }
    } catch (error) {
        showToast("Failed to update booking");
    }
  };

  const newBookings = dashboardData.recentBookings.filter(b => b.status === 'pending');
  const activeBookings = dashboardData.recentBookings.filter(b => b.status === 'accepted');
  const completedBookings = dashboardData.recentBookings.filter(b => b.status === 'completed');

  return (
    <div className="provider-app" style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f1f5f9' }}>

      {showCompletionAlert && (
         <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div className="animate-fade-in" style={{ background: 'white', width: '100%', maxWidth: '400px', borderRadius: '24px', padding: '2rem 1.5rem', position: 'relative', textAlign: 'center' }}>
               <button onClick={() => setShowCompletionAlert(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={24}/></button>
               <div style={{ width: '64px', height: '64px', background: '#fef3c7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', margin: '0 auto 1.5rem auto' }}>
                  <ShieldAlert size={32}/>
               </div>
               <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.75rem' }}>Action Required</h2>
               <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                  To unlock all partner features, ensure quality service, and build trust with customers, please complete your business profile and KYC verification.
               </p>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button onClick={() => { setShowCompletionAlert(false); setActiveTab('profile'); }} style={{ width: '100%', background: '#4f46e5', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Complete Profile Now</button>
                  <button onClick={() => setShowCompletionAlert(false)} style={{ width: '100%', background: '#f1f5f9', color: '#64748b', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Maybe Later</button>
               </div>
            </div>
         </div>
      )}

      {isEditing && (
         <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div className="animate-fade-in" style={{ background: 'white', width: '100%', maxWidth: '400px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '24px', padding: '2rem 1.5rem', position: 'relative' }}>
               <button onClick={() => setIsEditing(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={24}/></button>
               <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>Edit Profile</h2>

               <form onSubmit={handleUpdateProfile}>
                  <div className="input-group" style={{ marginBottom: '1rem' }}>
                     <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>Partner Name</label>
                     <input type="text" className="input-field" value={vendorUser.fullName} onChange={(e) => setVendorUser({...vendorUser, fullName: e.target.value})} style={{ width: '100%', padding: '0.75rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px' }} required />
                  </div>
                  <div className="input-group" style={{ marginBottom: '1rem' }}>
                     <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>Business Name</label>
                     <input type="text" className="input-field" value={vendorUser.businessName} onChange={(e) => setVendorUser({...vendorUser, businessName: e.target.value})} style={{ width: '100%', padding: '0.75rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px' }} />
                  </div>
                  <div className="input-group" style={{ marginBottom: '1rem' }}>
                     <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>Mobile Number</label>
                     <input type="tel" className="input-field" value={vendorUser.mobile} onChange={(e) => setVendorUser({...vendorUser, mobile: e.target.value})} style={{ width: '100%', padding: '0.75rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px' }} required />
                  </div>
                  <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                     <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>About Business</label>
                     <textarea className="input-field" value={vendorUser.about} onChange={(e) => setVendorUser({...vendorUser, about: e.target.value})} style={{ width: '100%', padding: '0.75rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', minHeight: '80px', resize: 'vertical' }} required />
                  </div>
                  <button type="submit" style={{ width: '100%', background: '#4f46e5', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Save Changes</button>
               </form>
            </div>
         </div>
      )}

      {showAddService && (
         <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div className="animate-fade-in" style={{ background: 'white', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '24px', padding: '2rem 1.5rem', position: 'relative' }}>
               <button onClick={() => setShowAddService(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={24}/></button>
               <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>Add New Service</h2>

               <form onSubmit={handleAddService}>
                  <div className="input-group" style={{ marginBottom: '1rem' }}>
                     <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>Service Name</label>
                     <input type="text" className="input-field" value={newService.name} onChange={(e) => setNewService({...newService, name: e.target.value})} placeholder="e.g. AC Repair" style={{ width: '100%', padding: '0.75rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px' }} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="input-group">
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>Price (₹)</label>
                        <input type="number" className="input-field" value={newService.price} onChange={(e) => setNewService({...newService, price: e.target.value})} placeholder="299" style={{ width: '100%', padding: '0.75rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px' }} required />
                    </div>
                    <div className="input-group">
                        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>Category</label>
                        <input type="text" className="input-field" value={newService.category} onChange={(e) => setNewService({...newService, category: e.target.value})} placeholder="Electrician" style={{ width: '100%', padding: '0.75rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px' }} required />
                    </div>
                  </div>
                  <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                     <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>Description</label>
                     <textarea className="input-field" value={newService.description} onChange={(e) => setNewService({...newService, description: e.target.value})} placeholder="Tell customers what's included..." style={{ width: '100%', padding: '0.75rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', minHeight: '80px' }} required />
                  </div>
                  <button type="submit" style={{ width: '100%', background: '#4f46e5', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Create Service</button>
               </form>
            </div>
         </div>
      )}

      {showKycForm && (
         <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div className="animate-fade-in" style={{ background: 'white', width: '100%', maxWidth: '400px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '24px', padding: '2rem 1.5rem', position: 'relative' }}>
               <button onClick={() => setShowKycForm(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={24}/></button>
               <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>Complete KYC</h2>

               <form onSubmit={handleSubmitKyc}>
                  <div className="input-group" style={{ marginBottom: '1rem' }}>
                     <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>PAN Number</label>
                     <input type="text" name="panNumber" className="input-field" placeholder="ABCDE1234F" style={{ width: '100%', padding: '0.75rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', textTransform: 'uppercase' }} required />
                  </div>
                  <div className="input-group" style={{ marginBottom: '1rem' }}>
                     <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>Aadhar Number</label>
                     <input type="text" name="aadharNumber" className="input-field" placeholder="1234 5678 9012" style={{ width: '100%', padding: '0.75rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px' }} required />
                  </div>
                  <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                     <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>Bank Passbook / Account No</label>
                     <input type="text" name="bankPassbook" className="input-field" placeholder="Enter bank details..." style={{ width: '100%', padding: '0.75rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px' }} required />
                  </div>
                  <button type="submit" style={{ width: '100%', background: '#4f46e5', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Submit Documents</button>
               </form>
            </div>
         </div>
      )}

      {/* Toast Notification */}
      {toast && (
         <div className="animate-fade-in" style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#10b981', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '99px', zIndex: 9999, fontWeight: 500, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            {toast}
         </div>
      )}

      {/* HEADER / TOP NAV */}
      <div style={{ background: '#ffffff', padding: '1.25rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', zIndex: 10 }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="btn-icon" onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', padding: 0 }}>
               <ArrowLeft size={24} color="#1e293b" />
            </button>
             <div>
               <h1 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b', fontWeight: 600 }}>Partner Central</h1>
               <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{vendorUser.fullName}</div>
            </div>
         </div>
         <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isOnline ? '#10b981' : '#ef4444' }}>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
               <div onClick={handleToggleOnline} style={{ width: '40px', height: '22px', background: isOnline ? '#10b981' : '#cbd5e1', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: '0.2s' }}>
                  <div style={{ position: 'absolute', top: '2px', left: isOnline ? '20px' : '2px', width: '18px', height: '18px', background: 'white', borderRadius: '50%', transition: '0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}></div>
               </div>
            </div>
         </div>
      </div>

      {/* SCROLLABLE MAIN CONTENT */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '80px', padding: '1rem' }}>

         {/* ------------------ HOME TAB ------------------ */}
         {activeTab === 'home' && (
            <div className="animate-fade-in">
               {!isOnline && (
                  <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '12px', border: '1px solid #fecaca', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                     <Power size={20}/> You are currently offline. Go online to receive daily job leads.
                  </div>
               )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: 'white', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                     <div style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Earnings</div>
                     <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b' }}>₹{dashboardData.stats.totalEarnings}</div>
                  </div>
                  <div style={{ background: 'white', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                     <div style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem' }}>New Requests</div>
                     <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#4f46e5' }}>{newBookings.length}</div>
                  </div>
               </div>

               <h3 style={{ fontSize: '1.125rem', margin: '0 0 1rem 0', color: '#1e293b' }}>Active Jobs (Ongoing)</h3>
               {activeBookings.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                     No active jobs right now.
                  </div>
               ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                     {activeBookings.map(job => (
                        <div key={job._id} style={{ background: 'white', padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0', borderLeft: '4px solid #f59e0b', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                              <span style={{ fontWeight: 600, color: '#1e293b' }}>{job.userId?.fullName}</span>
                              <span style={{ fontWeight: 600, color: '#10b981' }}>₹{job.totalAmount}</span>
                           </div>
                           <div style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                              <MapPin size={14}/> {job.location}
                           </div>
                           <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button style={{ flex: 1, padding: '0.6rem', background: '#25D366', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 500, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} onClick={() => window.open(`tel:${job.userId?.mobile}`)}><PhoneCall size={16} /> Contact User</button>
                              <button style={{ flex: 1, padding: '0.6rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 500 }} onClick={() => handleUpdateBooking(job._id, 'completed')}>Mark Complete</button>
                           </div>
                        </div>
                     ))}
                  </div>
               )}

               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '2rem 0 1rem 0' }}>
                  <h3 style={{ fontSize: '1.125rem', margin: 0, color: '#1e293b' }}>My Services</h3>
                  <button onClick={() => { if(checkProfileCompletion()) setShowAddService(true); }} style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                     <Plus size={16}/> Add New
                  </button>
               </div>

               {myServices.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                     No services added yet. Add your first service to start receiving leads.
                  </div>
               ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                     {myServices.map(service => (
                        <div key={service._id} style={{ background: 'white', padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <div>
                              <div style={{ fontWeight: 600, color: '#1e293b' }}>{service.name}</div>
                              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>₹{service.price} • {service.category}</div>
                           </div>
                           <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button onClick={() => handleDeleteService(service._id)} style={{ padding: '0.5rem', color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }}><Trash2 size={18}/></button>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         )}

         {/* ------------------ LEADS TAB ------------------ */}
         {activeTab === 'leads' && (
            <div className="animate-fade-in">
               <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#1e293b' }}>Available Bookings</h2>

               {newBookings.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                     <div style={{ width: '64px', height: '64px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}><Briefcase size={32} color="#94a3b8"/></div>
                     No new leads at the moment. Make sure you are marked Online.
                  </div>
               ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                     {newBookings.map(lead => (
                        <div key={lead._id} style={{ background: 'white', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                              <span style={{ fontWeight: 600, fontSize: '1.125rem', color: '#1e293b' }}>{lead.serviceId?.name}</span>
                              <span style={{ fontWeight: 600, color: '#f59e0b' }}>Est. ₹{lead.totalAmount}</span>
                           </div>

                           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#64748b', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14}/> {lead.location}</span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14}/> {new Date(lead.date).toLocaleDateString()}</span>
                           </div>

                           <div style={{ display: 'flex', gap: '1rem' }}>
                              <button onClick={() => handleUpdateBooking(lead._id, 'declined')} style={{ flex: 1, padding: '0.75rem', background: '#f8fafc', color: '#ef4444', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Decline</button>
                              <button onClick={() => handleUpdateBooking(lead._id, 'accepted')} style={{ flex: 1, padding: '0.75rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 4px rgba(79,70,229,0.3)' }}>Accept Lead</button>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         )}

         {/* ------------------ EARNINGS TAB ------------------ */}
         {activeTab === 'earnings' && (
            <div className="animate-fade-in">
               <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', padding: '2rem', borderRadius: '16px', color: 'white', textAlign: 'center', marginBottom: '2rem', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)' }}>
                  <div style={{ opacity: 0.9, fontSize: '0.875rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Wallet Balance</div>
                  <div style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1rem' }}>₹{dashboardData.stats.totalEarnings}</div>
                  <button onClick={() => showToast('Withdrawal request sent to bank!')} style={{ background: 'white', color: '#4f46e5', border: 'none', padding: '0.75rem 2rem', borderRadius: '99px', fontWeight: 600, cursor: 'pointer' }}>Withdraw Funds</button>
               </div>

               <h3 style={{ fontSize: '1.125rem', color: '#1e293b', marginBottom: '1rem' }}>Payout History</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {completedBookings.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No payouts yet.</div>
                  ) : (
                    completedBookings.map(job => (
                        <div key={job._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <div style={{ width: '40px', height: '40px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}><IndianRupee size={18}/></div>
                              <div>
                                 <div style={{ fontWeight: 500, color: '#1e293b' }}>Payment from {job.userId?.fullName}</div>
                                 <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{job.serviceId?.name}</div>
                              </div>
                           </div>
                           <div style={{ fontWeight: 600, color: '#10b981' }}>+₹{job.totalAmount}</div>
                        </div>
                     ))
                  )}
               </div>
            </div>
         )}

         {/* ------------------ PROFILE TAB ------------------ */}
         {activeTab === 'profile' && (
            <div className="animate-fade-in">

               <div style={{ textAlign: 'center', marginBottom: '2rem', padding: '2rem', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
                     <img src={vendorUser.profileImage || "https://i.pravatar.cc/150?u=ramesh"} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #f1f5f9' }} alt="Profile" />
                     <button style={{ position: 'absolute', bottom: 0, right: -5, background: '#4f46e5', color: 'white', border: 'none', padding: '0.4rem', borderRadius: '50%', cursor: 'pointer' }}><Camera size={14}/></button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                     <h2 style={{ fontSize: '1.25rem', margin: 0, color: '#1e293b' }}>{vendorUser.fullName}</h2>
                     <button onClick={() => setIsEditing(true)} style={{ background: 'transparent', border: 'none', color: '#4f46e5', cursor: 'pointer', padding: 0 }}><Edit3 size={16}/></button>
                  </div>
                  {isKycVerified ? (
                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', color: '#10b981', fontSize: '0.875rem', fontWeight: 500 }}><ShieldCheck size={16}/> KYC Fully Verified</div>
                  ) : isKycPending ? (
                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', color: '#f59e0b', fontSize: '0.875rem', fontWeight: 500, background: '#fef3c7', padding: '0.4rem 1rem', borderRadius: '8px', border: '1px solid #fde68a' }}><Clock size={16}/> KYC Pending Approval</div>
                  ) : (
                     <button onClick={() => setShowKycForm(true)} style={{ background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a', padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <ShieldAlert size={16}/> Complete KYC Now
                     </button>
                  )}
               </div>

               <h3 style={{ fontSize: '1rem', margin: '0 0 1rem 0', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Business Profile</h3>
               <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '2rem' }}>
                  <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                     <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>Service Category</label>
                     <div style={{ color: '#1e293b', fontWeight: 500 }}>{vendorUser.category || "Not Specified"}</div>
                  </div>
                  <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                     <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>Operating Radius</label>
                     <div style={{ color: '#1e293b', fontWeight: 500 }}>Within {vendorUser.operatingRadius} Km</div>
                  </div>
                  <div style={{ padding: '1rem' }}>
                     <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>About Business</label>
                     <div style={{ color: '#1e293b', fontWeight: 500, fontSize: '0.875rem', lineHeight: '1.5' }}>{vendorUser.about || "Add a description about your business."}</div>
                  </div>
               </div>


               <h3 style={{ fontSize: '1rem', margin: '0 0 1rem 0', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Recent Reviews</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  {dashboardData.reviews.length === 0 ? (
                      <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>No reviews yet.</div>
                  ) : (
                    dashboardData.reviews.map(review => (
                        <div key={review._id} style={{ background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                              <img src={review.userId?.profileImage} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                              <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{review.userId?.fullName}</div>
                              <div style={{ marginLeft: 'auto', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                 <BarChart2 size={14}/> {review.rating}/5
                              </div>
                           </div>
                           <div style={{ color: '#64748b', fontSize: '0.875rem' }}>{review.comment}</div>
                        </div>
                    ))
                  )}
               </div>

               <h3 style={{ fontSize: '1rem', margin: '0 0 1rem 0', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Portfolio Gallery</h3>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '2rem' }}>
                  <img src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=200&auto=format&fit=crop" style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '8px' }}/>
                  <div style={{ width: '100%', aspectRatio: '1/1', background: '#e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', cursor: 'pointer' }}>
                     <Upload size={24}/>
                  </div>
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                  <button onClick={() => navigate('/user-profile')} style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center' }}>
                     <User size={18}/> Switch to User Mode
                  </button>
                  <button onClick={() => navigate('/')} style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '0.75rem 2rem', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center' }}>
                     <Power size={18}/> Logout Business Account
                  </button>
               </div>
            </div>
         )}
      </div>

      {/* DEDICATED BOTTOM NAV FOR VENDORS */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-around', padding: '0.75rem 0', paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))', zIndex: 100 }}>
         <div onClick={() => setActiveTab('home')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', color: activeTab === 'home' ? '#4f46e5' : '#64748b', cursor: 'pointer', transition: '0.2s', width: '25%' }}>
            <BarChart2 size={24} />
            <span style={{ fontSize: '0.7rem', fontWeight: activeTab === 'home' ? 600 : 400 }}>Dashboard</span>
         </div>
         <div onClick={() => setActiveTab('leads')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', color: activeTab === 'leads' ? '#4f46e5' : '#64748b', cursor: 'pointer', transition: '0.2s', width: '25%', position: 'relative' }}>
            <div style={{ position: 'relative' }}>
               <Briefcase size={24} />
               {newBookings.length > 0 && <span style={{ position: 'absolute', top: '-4px', right: '-6px', background: '#ef4444', color: 'white', fontSize: '0.6rem', padding: '2px 5px', borderRadius: '10px', fontWeight: 'bold' }}>{newBookings.length}</span>}
            </div>
            <span style={{ fontSize: '0.7rem', fontWeight: activeTab === 'leads' ? 600 : 400 }}>Leads</span>
         </div>
         <div onClick={() => setActiveTab('earnings')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', color: activeTab === 'earnings' ? '#4f46e5' : '#64748b', cursor: 'pointer', transition: '0.2s', width: '25%' }}>
            <IndianRupee size={24} />
            <span style={{ fontSize: '0.7rem', fontWeight: activeTab === 'earnings' ? 600 : 400 }}>Earnings</span>
         </div>
         <div onClick={() => setActiveTab('profile')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', color: activeTab === 'profile' ? '#4f46e5' : '#64748b', cursor: 'pointer', transition: '0.2s', width: '25%' }}>
            <UserCircle size={24} />
            <span style={{ fontSize: '0.7rem', fontWeight: activeTab === 'profile' ? 600 : 400 }}>Profile</span>
         </div>
      </div>

    </div>
  );
}
