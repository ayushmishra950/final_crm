import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, CheckCircle, Phone, MessageCircle, Clock, Shield, Calendar, ShieldAlert, User, Zap, X} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux-toolkit/customHook/customHook';
import * as userService from '../service/userService';


export default function ProviderProfile() {

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([]); 
  const [toast, setToast] = useState(false);
  const [providerData, setProviderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingNote, setBookingNote] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [creatingBooking, setCreatingBooking] = useState(false);

  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state?.user?.userData);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchProviderData = async () => {
    try {
      setLoading(true);
      const res = await userService.getVendorProfile(id);
      if (res.success) {
        setProviderData(res.vendor);
        setReviews(res.reviews || []);
      }
    } catch (error) {
      console.error("Error fetching vendor:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviderData();
  }, [id]);

  const handleSubmitReview = async () => {
    if (rating === 0) return;
    setSubmittingReview(true);
    try {
      const res = await userService.submitReview({
        vendorId: id,
        rating,
        comment: review
      });

      if (res.success) {
        setToast(true);
        setRating(0);
        setReview('');
        fetchProviderData();
        setTimeout(() => setToast(false), 3000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleCall = () => {
    if (!providerData) return;
    sessionStorage.setItem(
      'pendingCallVendor',
      JSON.stringify({
        id: providerData._id || providerData.id,
        name: providerData.fullName || providerData.businessName
      })
    );
  };

  const whatsappMessage = providerData
    ? encodeURIComponent(`Hi ${providerData.businessName || providerData.fullName}, I found you on BharatSeva. Are you available for ${providerData.category}?`)
    : '';

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-color)' }}>
         <div className="flex-col items-center gap-4">
            <div className="animate-spin" style={{ width: 40, height: 40, border: '4px solid var(--border-color)', borderTopColor: 'var(--primary-color)', borderRadius: '50%' }}></div>
            <div style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Loading Professional Profile...</div>
         </div>
      </div>
    );
  }

  if (!providerData) {
    return (
      <div className="section text-center" style={{ marginTop: '5rem' }}>
         <ShieldAlert size={64} color="var(--danger-color)" style={{ marginBottom: '1rem' }} />
         <h2 className="text-h1">Provider Not Found</h2>
         <p className="text-sub">The profile you're looking for might have been moved or removed.</p>
         <button className="btn btn-primary" style={{ marginTop: '2rem' }} onClick={() => navigate('/user-dashboard')}>Explore Other Partners</button>
      </div>
    );
  }

  const provider = providerData;
  console.log("Provider Data:", provider);

  return (
    <div className="page-content" style={{ background: 'var(--bg-color)', minHeight: '100vh', paddingBottom: '100px' }}>
      
      {/* Toast Notification */}
      {toast && (
         <div style={{ position: 'fixed', top: '2rem', left: '50%', transform: 'translateX(-50%)', background: 'var(--success-color)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-full)', zIndex: 2000, boxShadow: 'var(--shadow-lg)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={18} /> Review Posted Successfully!
         </div>
      )}

      {/* Header Banner */}
      <div style={{ position: 'relative', height: '180px', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', overflow: 'hidden' }}>
        <button className="btn-icon" onClick={() => navigate(-1)} style={{ position: 'absolute', top: '1.5rem', left: '1rem', border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(8px)' }}>
          <ArrowLeft size={20} />
        </button>
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', opacity: 0.1 }}>
           <Shield size={200} color="white" />
        </div>
      </div>

      <div className="section" style={{ position: 'relative', marginTop: '-60px' }}>
        
        {/* Profile Identity Card */}
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
             <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <img src={provider.profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed="+provider.fullName} alt={provider.fullName} style={{ width: 90, height: 90, borderRadius: '24px', border: '4px solid white', boxShadow: 'var(--shadow-md)', objectFit: 'cover' }} />
                <div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h1 className="text-h1" style={{ margin: 0, fontSize: '1.5rem' }}>{provider.businessName || provider.fullName}</h1>
                      {provider.isKycVerified && (
                         <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '99px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>
                            <CheckCircle size={12} fill="#166534" color="white" /> Verified
                         </div>
                      )}
                   </div>
                   <p className="text-sub" style={{ fontSize: '1rem', marginTop: '4px' }}>{provider.category}</p>
                   <div style={{ display: 'flex', gap: '1rem', marginTop: '8px' }}>
                      <div className="stars">
                         <Star fill="var(--warning-color)" size={14} />
                         <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)' }}>{provider.rating || 'New'}</span>
                         <span className="text-sub" style={{ fontSize: '0.75rem' }}> ({reviews.length} reviews)</span>
                      </div>
                   </div>
                </div>
             </div>

             <div className="flex gap-2">
                <a href={`tel:${provider.mobile}`} onClick={handleCall} className="btn-icon" style={{ background: '#f8fafc', color: '#1e293b', width: 44, height: 44 }}><Phone size={20}/></a>
                <a href={`https://wa.me/${provider.mobile}?text=${whatsappMessage}`} target="_blank" rel="noreferrer" className="btn-icon" style={{ background: '#25D366', color: 'white', border: 'none', width: 44, height: 44 }}><MessageCircle size={20}/></a>
             </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
             <div className="text-center">
                <div style={{ fontWeight: 600, color: 'var(--primary-color)', fontSize: '1.125rem' }}>{provider.experience || '3+'}</div>
                <div className="text-sub" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Experience</div>
             </div>
             <div className="text-center" style={{ borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 600, color: 'var(--primary-color)', fontSize: '1.125rem' }}>{provider.serviceArea?.split(',')[0] || 'Local'}</div>
                <div className="text-sub" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Service Area</div>
             </div>
             <div className="text-center">
                <div style={{ fontWeight: 600, color: 'var(--primary-color)', fontSize: '1.125rem' }}>{provider?.distance || 0} km</div>
                <div className="text-sub" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Distance</div>
             </div>
          </div>
        </div>

        {/* Content Tabs/Cards */}
        <div style={{ display: 'grid', gap: '1.5rem' }}>
           
           <div className="card">
              <h3 className="text-h2" style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '8px' }}><User size={18} color="var(--primary-color)"/> Professional Bio</h3>
              <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: 1.6, marginTop: '0.5rem' }}>{provider.about || "Experienced professional dedicated to providing high-quality service in your local area. Reliable, punctual and verified for your peace of mind."}</p>
           </div>

           <div className="card">
              <h3 className="text-h2" style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Zap size={18} color="var(--primary-color)"/> Specialties & Services</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
                 {(provider.services?.length > 0 ? provider.services : [provider.category]).map((srv, i) => (
                    <span key={i} className="badge" style={{ padding: '0.5rem 1rem', background: 'var(--primary-light)', border: '1px solid rgba(59, 130, 246, 0.2)', fontSize: '0.8rem' }}>
                       {srv}
                    </span>
                 ))}
              </div>
           </div>

           {/* Review Analysis Header */}
           <div style={{ marginTop: '1.5rem' }}>
              <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                 <h3 className="text-h1" style={{ margin: 0 }}>Community Feedback</h3>
                 <div className="badge badge-warning" style={{ fontWeight: 600 }}>{provider.rating || '4.8'} Total Score</div>
              </div>

              <div className="flex-col gap-4">
                 {reviews.length === 0 ? (
                    <div className="card text-center" style={{ padding: '3rem', border: '2px dashed var(--border-color)', background: 'transparent' }}>
                       <MessageCircle size={40} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                       <p className="text-sub">No reviews yet. Be the first to share your experience!</p>
                    </div>
                 ) : (
                    reviews.map((rev, idx) => (
                       <div key={idx} className="card animate-fade-in" style={{ padding: '1.25rem' }}>
                          <div className="flex justify-between items-start" style={{ marginBottom: '1rem' }}>
                             <div className="flex gap-3 items-center">
                                <img src={rev.userId?.profileImage || `https://ui-avatars.com/api/?name=${rev.userId?.fullName || 'User'}&background=random`} style={{ width: 44, height: 44, borderRadius: '12px' }} alt="" />
                                <div>
                                   <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{rev.userId?.fullName || "Verified User"}</div>
                                   <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(rev.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                </div>
                             </div>
                             <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                   <Star key={i} size={12} fill={i < rev.rating ? "var(--warning-color)" : "none"} color="var(--warning-color)" />
                                ))}
                             </div>
                          </div>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5, margin: 0 }}>"{rev.comment}"</p>
                       </div>
                    ))
                 )}
              </div>

              {/* Add Review Card */}
              <div className="card" style={{ marginTop: '2.5rem', background: '#f1f5f9', border: 'none' }}>
                 <h4 style={{ fontWeight: 600, marginBottom: '1rem' }}>Rate your experience</h4>
                 <div className="flex gap-2" style={{ marginBottom: '1.5rem' }}>
                    {[1,2,3,4,5].map(s => (
                       <button 
                          key={s} 
                          onClick={() => setRating(s)}
                          style={{ background: 'transparent', transition: 'transform 0.2s' }}
                          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.8)'}
                          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                       >
                          <Star size={32} fill={s <= rating ? "var(--warning-color)" : "none"} color={s <= rating ? "var(--warning-color)" : "#cbd5e1"} />
                       </button>
                    ))}
                 </div>
                 <textarea 
                    className="input-field" 
                    placeholder="Tell others what you liked about their service..."
                    style={{ width: '100%', minHeight: '100px', marginBottom: '1.25rem', border: '1px solid white' }}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                 />
                  <button className="btn btn-primary btn-block" style={{ padding: '1rem' }} onClick={handleSubmitReview} disabled={rating === 0 || submittingReview}>
                    {submittingReview ? 'Posting...' : 'Post Public Review'}
                  </button>
              </div>
           </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', background: 'white', padding: '1rem 1.5rem', boxShadow: '0 -10px 15px -3px rgba(0,0,0,0.05)', borderTop: '1px solid var(--border-color)', zIndex: 100, display: 'flex', gap: '1rem', alignItems: 'center' }}>
         <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Service Category</div>
            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{provider.category}</div>
         </div>
         <button className="btn btn-primary" style={{ padding: '0.875rem 2.5rem', borderRadius: '16px', boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)' }} onClick={() => setShowBookingModal(true)}>
            Book Service Now
         </button>
      </div>

      {/* Booking Modal Redesign */}
      {showBookingModal && (
         <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000 }}>
            <div className="animate-fade-in" style={{ background: 'white', width: '100%', maxWidth: '500px', borderTopLeftRadius: '32px', borderTopRightRadius: '32px', padding: '2rem', paddingBottom: '3rem', position: 'relative' }}>
               <div style={{ width: '40px', height: '4px', background: '#e2e8f0', borderRadius: '2px', margin: '0 auto 1.5rem auto' }} onClick={() => setShowBookingModal(false)}></div>
               <button onClick={() => setShowBookingModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
               
               <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
                  <div style={{ width: 56, height: 56, background: 'var(--primary-light)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                     <Calendar size={28} />
                  </div>
                  <div>
                     <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Book {provider.businessName || provider.fullName}</h3>
                     <p className="text-sub" style={{ margin: 0 }}>Step 1: Define your requirements</p>
                  </div>
               </div>

               <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.75rem' }}>Service Details & Requirements</label>
                  <textarea 
                     value={bookingNote}
                     onChange={(e) => setBookingNote(e.target.value)}
                     placeholder="Describe what you need help with (e.g. leaking tap, wiring issue, AC not cooling)..."
                     style={{ width: '100%', padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0', minHeight: '150px', outline: 'none', background: '#f8fafc', fontSize: '0.95rem' }}
                  />
               </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                   <button className="btn btn-primary btn-block" style={{ height: '56px', borderRadius: '18px', fontSize: '1.125rem' }} onClick={async () => {
                      if (!bookingNote.trim()) {
                         alert("Please describe your requirements");
                         return;
                      }
                      setCreatingBooking(true);
                      try {
                         const res = await userService.createBooking({
                            vendorId: provider._id || provider.id,
                            serviceId: provider.services?.[0],
                            date: new Date(),
                            location: "Current Location",
                            note: bookingNote
                         });
                         if (res.success) {
                            alert("Booking Request Sent Successfully!");
                            setShowBookingModal(false);
                            setBookingNote('');
                            navigate('/user-dashboard');
                         }
                      } catch (e) {
                         alert("Failed to send booking: " + (e.message || "Unknown error"));
                      } finally {
                         setCreatingBooking(false);
                      }
                   }} disabled={creatingBooking}>
                      {creatingBooking ? 'Sending Request...' : 'Confirm Request'}
                   </button>
                </div>
               <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', marginTop: '1.5rem' }}>No payment required now. You can discuss pricing via call.</p>
            </div>
         </div>
      )}

    </div>
  );
}
