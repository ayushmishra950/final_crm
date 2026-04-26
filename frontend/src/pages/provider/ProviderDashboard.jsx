// import { useState } from 'react';
// import { ArrowLeft, 
//   BarChart2, Briefcase, IndianRupee, UserCircle, 
//   MapPin, PhoneCall, CheckCircle, Upload, Power, 
//   Clock, ShieldCheck, Camera, CreditCard, ChevronRight, User, ShieldAlert, X, Edit3
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// export default function ProviderDashboard() {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('home'); 
//   const [isOnline, setIsOnline] = useState(true);
//   const [toast, setToast] = useState(null);
//   const [isKycVerified, setIsKycVerified] = useState(false);
//   const [showKycForm, setShowKycForm] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [vendorUser, setVendorUser] = useState({ name: 'Ramesh Sharma', phone: '+91 99999 88888', about: 'Specialist in house wiring, short circuits, and all domestic appliance repairs. Minimum visiting fee ₹150.' });

//   // Mocked state
//   const [leads, setLeads] = useState([
//      { id: 1, customer: 'Ravi Kumar', issue: 'AC cooling issue', location: 'Civil Lines, 2.5km', time: 'Just now', status: 'New', amount: '₹350' },
//      { id: 2, customer: 'Neha Singh', issue: 'Pipe leakage in washroom', location: 'City Center, 4km', time: '1 hour ago', status: 'New', amount: '₹200' },
//      { id: 3, customer: 'Amit Patel', issue: 'Main switchboard sparking', location: 'South Block, 1.2km', time: 'Yesterday', status: 'Accepted', amount: '₹450', paid: true },
//      { id: 4, customer: 'Suresh Das', issue: 'Inverter installation', location: 'Highway Society, 5km', time: '2 hours ago', status: 'Accepted', amount: '₹800', paid: false },
//   ]);

//   const showToast = (message) => {
//     setToast(message);
//     setTimeout(() => setToast(null), 3000);
//   };

//   const handleAccept = (id) => {
//     setLeads(leads.map(l => l.id === id ? { ...l, status: 'Accepted' } : l));
//     showToast('Lead Accepted! Call Customer immediately.');
//   };

//   const handleDecline = (id) => {
//     setLeads(leads.filter(l => l.id !== id));
//     showToast('Lead Declined.');
//   };

//   const newLeads = leads.filter(l => l.status === 'New');
//   const activeJobs = leads.filter(l => l.status === 'Accepted' && !l.paid);
//   const completedJobs = leads.filter(l => l.status === 'Accepted' && l.paid);

//   return (
//     <div className="provider-app" style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f1f5f9' }}>

//       {isEditing && (
//          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
//             <div className="animate-fade-in" style={{ background: 'white', width: '100%', maxWidth: '400px', borderRadius: '24px', padding: '2rem 1.5rem', position: 'relative' }}>
//                <button onClick={() => setIsEditing(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={24}/></button>
//                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>Edit Profile</h2>

//                <form onSubmit={(e) => { e.preventDefault(); setIsEditing(false); showToast('Profile Updated Successfully!'); }}>
//                   <div className="input-group" style={{ marginBottom: '1rem' }}>
//                      <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>Partner Name</label>
//                      <input type="text" className="input-field" value={vendorUser.name} onChange={(e) => setVendorUser({...vendorUser, name: e.target.value})} style={{ width: '100%', padding: '0.75rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px' }} required />
//                   </div>
//                   <div className="input-group" style={{ marginBottom: '1rem' }}>
//                      <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>Mobile Number</label>
//                      <input type="tel" className="input-field" value={vendorUser.phone} onChange={(e) => setVendorUser({...vendorUser, phone: e.target.value})} style={{ width: '100%', padding: '0.75rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px' }} required />
//                   </div>
//                   <div className="input-group" style={{ marginBottom: '1.5rem' }}>
//                      <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>About Business</label>
//                      <textarea className="input-field" value={vendorUser.about} onChange={(e) => setVendorUser({...vendorUser, about: e.target.value})} style={{ width: '100%', padding: '0.75rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', minHeight: '80px', resize: 'vertical' }} required />
//                   </div>
//                   <button type="submit" style={{ width: '100%', background: '#4f46e5', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Save Changes</button>
//                </form>
//             </div>
//          </div>
//       )}

//       {showKycForm && (
//          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
//             <div className="animate-fade-in" style={{ background: 'white', width: '100%', maxWidth: '500px', borderRadius: '24px', padding: '2rem 1.5rem', position: 'relative' }}>
//                <button onClick={() => setShowKycForm(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={24}/></button>
//                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', margin: '0 0 0.5rem 0' }}>Complete KYC</h2>
//                <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Submit documents to verify your business and receive payments.</p>

//                <form onSubmit={(e) => { e.preventDefault(); setIsKycVerified(true); setShowKycForm(false); showToast('KYC Documents Submitted Successfully!'); }}>
//                   <div className="input-group" style={{ marginBottom: '1rem' }}>
//                      <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>PAN Card Number</label>
//                      <input type="text" className="input-field" placeholder="ABCDE1234F" style={{ width: '100%', padding: '0.75rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px' }} required />
//                   </div>
//                   <div className="input-group" style={{ marginBottom: '1rem' }}>
//                      <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>Aadhar Card Number</label>
//                      <input type="text" className="input-field" placeholder="1234 5678 9012" style={{ width: '100%', padding: '0.75rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px' }} required />
//                   </div>
//                   <div className="input-group" style={{ marginBottom: '1.5rem' }}>
//                      <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>Bank Passbook/Account Number</label>
//                      <input type="text" className="input-field" placeholder="Account Number for payouts" style={{ width: '100%', padding: '0.75rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px' }} required />
//                   </div>
//                   <button type="submit" style={{ width: '100%', background: '#4f46e5', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Submit Verification</button>
//                </form>
//             </div>
//          </div>
//       )}

//       {/* Toast Notification */}
//       {toast && (
//          <div className="animate-fade-in" style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#10b981', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '99px', zIndex: 9999, fontWeight: 500, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
//             {toast}
//          </div>
//       )}

//       {/* HEADER / TOP NAV */}
//       <div style={{ background: '#ffffff', padding: '1.25rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', zIndex: 10 }}>
//          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
//             <button className="btn-icon" onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', padding: 0 }}>
//                <ArrowLeft size={24} color="#1e293b" />
//             </button>
//             <div>
//                <h1 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b', fontWeight: 600 }}>Partner Central</h1>
//                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{vendorUser.name}</div>
//             </div>
//          </div>
//          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isOnline ? '#10b981' : '#ef4444' }}>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
//                <div onClick={() => setIsOnline(!isOnline)} style={{ width: '40px', height: '22px', background: isOnline ? '#10b981' : '#cbd5e1', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: '0.2s' }}>
//                   <div style={{ position: 'absolute', top: '2px', left: isOnline ? '20px' : '2px', width: '18px', height: '18px', background: 'white', borderRadius: '50%', transition: '0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}></div>
//                </div>
//             </div>
//          </div>
//       </div>

//       {/* SCROLLABLE MAIN CONTENT */}
//       <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '80px', padding: '1rem' }}>

//          {/* ------------------ HOME TAB ------------------ */}
//          {activeTab === 'home' && (
//             <div className="animate-fade-in">
//                {!isOnline && (
//                   <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '12px', border: '1px solid #fecaca', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
//                      <Power size={20}/> You are currently offline. Go online to receive daily job leads.
//                   </div>
//                )}

//                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
//                   <div style={{ background: 'white', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
//                      <div style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Today's Earnings</div>
//                      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b' }}>₹1,250</div>
//                   </div>
//                   <div style={{ background: 'white', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
//                      <div style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem' }}>New Requests</div>
//                      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#4f46e5' }}>{newLeads.length}</div>
//                   </div>
//                </div>

//                <h3 style={{ fontSize: '1.125rem', margin: '0 0 1rem 0', color: '#1e293b' }}>Active Jobs (Ongoing)</h3>
//                {activeJobs.length === 0 ? (
//                   <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
//                      No active jobs right now.
//                   </div>
//                ) : (
//                   <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//                      {activeJobs.map(job => (
//                         <div key={job.id} style={{ background: 'white', padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0', borderLeft: '4px solid #f59e0b', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
//                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
//                               <span style={{ fontWeight: 600, color: '#1e293b' }}>{job.customer}</span>
//                               <span style={{ fontWeight: 600, color: '#10b981' }}>{job.amount}</span>
//                            </div>
//                            <div style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
//                               <MapPin size={14}/> {job.location}
//                            </div>
//                            <div style={{ display: 'flex', gap: '0.5rem' }}>
//                               <button style={{ flex: 1, padding: '0.6rem', background: '#25D366', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 500, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}><PhoneCall size={16} /> Contact User</button>
//                               <button style={{ flex: 1, padding: '0.6rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 500 }} onClick={() => showToast('Marked as Completed!')}>Mark Complete</button>
//                            </div>
//                         </div>
//                      ))}
//                   </div>
//                )}
//             </div>
//          )}

//          {/* ------------------ LEADS TAB ------------------ */}
//          {activeTab === 'leads' && (
//             <div className="animate-fade-in">
//                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#1e293b' }}>Available Bookings</h2>

//                {newLeads.length === 0 ? (
//                   <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
//                      <div style={{ width: '64px', height: '64px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}><Briefcase size={32} color="#94a3b8"/></div>
//                      No new leads at the moment. Make sure you are marked Online.
//                   </div>
//                ) : (
//                   <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//                      {newLeads.map(lead => (
//                         <div key={lead.id} style={{ background: 'white', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
//                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
//                               <span style={{ fontWeight: 600, fontSize: '1.125rem', color: '#1e293b' }}>{lead.issue}</span>
//                               <span style={{ fontWeight: 600, color: '#f59e0b' }}>Est. {lead.amount}</span>
//                            </div>

//                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#64748b', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
//                               <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14}/> {lead.location}</span>
//                               <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14}/> {lead.time}</span>
//                            </div>

//                            <div style={{ display: 'flex', gap: '1rem' }}>
//                               <button onClick={() => handleDecline(lead.id)} style={{ flex: 1, padding: '0.75rem', background: '#f8fafc', color: '#ef4444', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Decline</button>
//                               <button onClick={() => handleAccept(lead.id)} style={{ flex: 1, padding: '0.75rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 4px rgba(79,70,229,0.3)' }}>Accept Lead</button>
//                            </div>
//                         </div>
//                      ))}
//                   </div>
//                )}
//             </div>
//          )}

//          {/* ------------------ EARNINGS TAB ------------------ */}
//          {activeTab === 'earnings' && (
//             <div className="animate-fade-in">
//                <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', padding: '2rem', borderRadius: '16px', color: 'white', textAlign: 'center', marginBottom: '2rem', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)' }}>
//                   <div style={{ opacity: 0.9, fontSize: '0.875rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Wallet Balance</div>
//                   <div style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1rem' }}>₹4,250</div>
//                   <button onClick={() => showToast('Withdrawal request sent to bank!')} style={{ background: 'white', color: '#4f46e5', border: 'none', padding: '0.75rem 2rem', borderRadius: '99px', fontWeight: 600, cursor: 'pointer' }}>Withdraw Funds</button>
//                </div>

//                <h3 style={{ fontSize: '1.125rem', color: '#1e293b', marginBottom: '1rem' }}>Payout History</h3>
//                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
//                   {completedJobs.map(job => (
//                      <div key={job.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
//                         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
//                            <div style={{ width: '40px', height: '40px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}><IndianRupee size={18}/></div>
//                            <div>
//                               <div style={{ fontWeight: 500, color: '#1e293b' }}>Payment from {job.customer}</div>
//                               <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{job.issue}</div>
//                            </div>
//                         </div>
//                         <div style={{ fontWeight: 600, color: '#10b981' }}>+{job.amount}</div>
//                      </div>
//                   ))}
//                   {/* Fake older payout */}
//                   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
//                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
//                         <div style={{ width: '40px', height: '40px', background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}><IndianRupee size={18}/></div>
//                         <div>
//                            <div style={{ fontWeight: 500, color: '#1e293b' }}>Bank Withdrawal</div>
//                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>HDFC Bank ****1234</div>
//                         </div>
//                      </div>
//                      <div style={{ fontWeight: 600, color: '#1e293b' }}>-₹2,000</div>
//                   </div>
//                </div>
//             </div>
//          )}

//          {/* ------------------ PROFILE TAB ------------------ */}
//          {activeTab === 'profile' && (
//             <div className="animate-fade-in">

//                <div style={{ textAlign: 'center', marginBottom: '2rem', padding: '2rem', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
//                   <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
//                      <img src="https://i.pravatar.cc/150?u=ramesh" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #f1f5f9' }} alt="Profile" />
//                      <button style={{ position: 'absolute', bottom: 0, right: -5, background: '#4f46e5', color: 'white', border: 'none', padding: '0.4rem', borderRadius: '50%', cursor: 'pointer' }}><Camera size={14}/></button>
//                   </div>
//                   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
//                      <h2 style={{ fontSize: '1.25rem', margin: 0, color: '#1e293b' }}>{vendorUser.name}</h2>
//                      <button onClick={() => setIsEditing(true)} style={{ background: 'transparent', border: 'none', color: '#4f46e5', cursor: 'pointer', padding: 0 }}><Edit3 size={16}/></button>
//                   </div>
//                   {isKycVerified ? (
//                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', color: '#10b981', fontSize: '0.875rem', fontWeight: 500 }}><ShieldCheck size={16}/> KYC Fully Verified</div>
//                   ) : (
//                      <button onClick={() => setShowKycForm(true)} style={{ background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a', padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
//                         <ShieldAlert size={16}/> Complete KYC Now
//                      </button>
//                   )}
//                </div>

//                <h3 style={{ fontSize: '1rem', margin: '0 0 1rem 0', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Business Profile</h3>
//                <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '2rem' }}>
//                   <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9' }}>
//                      <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>Service Category</label>
//                      <div style={{ color: '#1e293b', fontWeight: 500 }}>Electrician</div>
//                   </div>
//                   <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9' }}>
//                      <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>Operating Radius</label>
//                      <div style={{ color: '#1e293b', fontWeight: 500 }}>Within 15 Km</div>
//                   </div>
//                   <div style={{ padding: '1rem' }}>
//                      <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>About Business</label>
//                      <div style={{ color: '#1e293b', fontWeight: 500, fontSize: '0.875rem', lineHeight: '1.5' }}>{vendorUser.about}</div>
//                   </div>
//                </div>

//                <h3 style={{ fontSize: '1rem', margin: '0 0 1rem 0', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Portfolio Gallery</h3>
//                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '2rem' }}>
//                   <img src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=200&auto=format&fit=crop" style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '8px' }}/>
//                   <div style={{ width: '100%', aspectRatio: '1/1', background: '#e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', cursor: 'pointer' }}>
//                      <Upload size={24}/>
//                   </div>
//                </div>

//                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
//                   <button onClick={() => navigate('/user-profile')} style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center' }}>
//                      <User size={18}/> Switch to User Mode
//                   </button>
//                   <button onClick={() => navigate('/')} style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '0.75rem 2rem', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center' }}>
//                      <Power size={18}/> Logout Business Account
//                   </button>
//                </div>
//             </div>
//          )}
//       </div>

//       {/* DEDICATED BOTTOM NAV FOR VENDORS */}
//       <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-around', padding: '0.75rem 0', paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))', zIndex: 100 }}>
//          <div onClick={() => setActiveTab('home')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', color: activeTab === 'home' ? '#4f46e5' : '#64748b', cursor: 'pointer', transition: '0.2s', width: '25%' }}>
//             <BarChart2 size={24} />
//             <span style={{ fontSize: '0.7rem', fontWeight: activeTab === 'home' ? 600 : 400 }}>Dashboard</span>
//          </div>
//          <div onClick={() => setActiveTab('leads')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', color: activeTab === 'leads' ? '#4f46e5' : '#64748b', cursor: 'pointer', transition: '0.2s', width: '25%', position: 'relative' }}>
//             <div style={{ position: 'relative' }}>
//                <Briefcase size={24} />
//                {newLeads.length > 0 && <span style={{ position: 'absolute', top: '-4px', right: '-6px', background: '#ef4444', color: 'white', fontSize: '0.6rem', padding: '2px 5px', borderRadius: '10px', fontWeight: 'bold' }}>{newLeads.length}</span>}
//             </div>
//             <span style={{ fontSize: '0.7rem', fontWeight: activeTab === 'leads' ? 600 : 400 }}>Leads</span>
//          </div>
//          <div onClick={() => setActiveTab('earnings')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', color: activeTab === 'earnings' ? '#4f46e5' : '#64748b', cursor: 'pointer', transition: '0.2s', width: '25%' }}>
//             <IndianRupee size={24} />
//             <span style={{ fontSize: '0.7rem', fontWeight: activeTab === 'earnings' ? 600 : 400 }}>Earnings</span>
//          </div>
//          <div onClick={() => setActiveTab('profile')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', color: activeTab === 'profile' ? '#4f46e5' : '#64748b', cursor: 'pointer', transition: '0.2s', width: '25%' }}>
//             <UserCircle size={24} />
//             <span style={{ fontSize: '0.7rem', fontWeight: activeTab === 'profile' ? 600 : 400 }}>Profile</span>
//          </div>
//       </div>

//     </div>
//   );
// }





































import { useState } from 'react';
import {
   ArrowLeft,
   BarChart2, Briefcase, IndianRupee, UserCircle,
   MapPin, PhoneCall, CheckCircle, Upload, Power,
   Clock, ShieldCheck, Camera, CreditCard, ChevronRight, User, ShieldAlert, X, Edit3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HomeTab from '../../components/providerSection/HomeTab';
import LeadsTab from '../../components/providerSection/LeadsTab';
import EarningsTab from '../../components/providerSection/EarningsTab';
import ProfileTab from '../../components/providerSection/ProfileTab';
import EditProfileModal from '../../components/forms/EditProfileModal';
import KycFormModal from '../../components/forms/KycFormModal';

export default function ProviderDashboard() {
   const navigate = useNavigate();
   const [activeTab, setActiveTab] = useState('home');
   const [isOnline, setIsOnline] = useState(true);
   const [toast, setToast] = useState(null);
   const [isKycVerified, setIsKycVerified] = useState(false);
   const [showKycForm, setShowKycForm] = useState(false);
   const [isEditing, setIsEditing] = useState(false);
   const [vendorUser, setVendorUser] = useState({ name: 'Ramesh Sharma', phone: '+91 99999 88888', about: 'Specialist in house wiring, short circuits, and all domestic appliance repairs. Minimum visiting fee ₹150.' });

   // Mocked state
   const [leads, setLeads] = useState([
      { id: 1, customer: 'Ravi Kumar', issue: 'AC cooling issue', location: 'Civil Lines, 2.5km', time: 'Just now', status: 'New', amount: '₹350' },
      { id: 2, customer: 'Neha Singh', issue: 'Pipe leakage in washroom', location: 'City Center, 4km', time: '1 hour ago', status: 'New', amount: '₹200' },
      { id: 3, customer: 'Amit Patel', issue: 'Main switchboard sparking', location: 'South Block, 1.2km', time: 'Yesterday', status: 'Accepted', amount: '₹450', paid: true },
      { id: 4, customer: 'Suresh Das', issue: 'Inverter installation', location: 'Highway Society, 5km', time: '2 hours ago', status: 'Accepted', amount: '₹800', paid: false },
   ]);

   const showToast = (message) => {
      setToast(message);
      setTimeout(() => setToast(null), 3000);
   };

   const handleAccept = (id) => {
      setLeads(leads.map(l => l.id === id ? { ...l, status: 'Accepted' } : l));
      showToast('Lead Accepted! Call Customer immediately.');
   };

   const handleDecline = (id) => {
      setLeads(leads.filter(l => l.id !== id));
      showToast('Lead Declined.');
   };

   const newLeads = leads.filter(l => l.status === 'New');
   const activeJobs = leads.filter(l => l.status === 'Accepted' && !l.paid);
   const completedJobs = leads.filter(l => l.status === 'Accepted' && l.paid);

   return (
      <div className="provider-app" style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f1f5f9' }}>

         {isEditing && (
            <EditProfileModal
               vendorUser={vendorUser}
               setVendorUser={setVendorUser}
               setIsEditing={setIsEditing}
               showToast={showToast}
            />
         )}

         {showKycForm && (
            <KycFormModal
               setShowKycForm={setShowKycForm}
               setIsKycVerified={setIsKycVerified}
               showToast={showToast}
            />

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
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{vendorUser.name}</div>
               </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isOnline ? '#10b981' : '#ef4444' }}>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
                  <div onClick={() => setIsOnline(!isOnline)} style={{ width: '40px', height: '22px', background: isOnline ? '#10b981' : '#cbd5e1', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: '0.2s' }}>
                     <div style={{ position: 'absolute', top: '2px', left: isOnline ? '20px' : '2px', width: '18px', height: '18px', background: 'white', borderRadius: '50%', transition: '0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}></div>
                  </div>
               </div>
            </div>
         </div>

         {/* SCROLLABLE MAIN CONTENT */}
         <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '80px', padding: '1rem' }}>
 
            {/* ------------------ HOME TAB ------------------ */}
            {activeTab === 'home' && (
               <HomeTab
                  isOnline={isOnline}
                  activeJobs={activeJobs}
                  newLeads={newLeads}
                  showToast={showToast}
               />
            )}

            {activeTab === 'leads' && (
               <LeadsTab
                  newLeads={newLeads}
                  handleAccept={handleAccept}
                  handleDecline={handleDecline}
               />
            )}

            {activeTab === 'earnings' && (
               <EarningsTab
                  completedJobs={completedJobs}
                  showToast={showToast}
               />
            )}

            {activeTab === 'profile' && (
               <ProfileTab
                  vendorUser={vendorUser}
                  setIsEditing={setIsEditing}
                  isKycVerified={isKycVerified}
                  setShowKycForm={setShowKycForm}
                  navigate={navigate}
               />
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
                  {newLeads.length > 0 && <span style={{ position: 'absolute', top: '-4px', right: '-6px', background: '#ef4444', color: 'white', fontSize: '0.6rem', padding: '2px 5px', borderRadius: '10px', fontWeight: 'bold' }}>{newLeads.length}</span>}
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

