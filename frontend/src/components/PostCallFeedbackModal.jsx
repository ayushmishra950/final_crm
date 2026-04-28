import { useEffect, useState } from 'react';
import { X, CheckCircle, XCircle, Clock } from 'lucide-react';
import { createBooking } from '../service/userService';
import { useAppSelector } from '../redux-toolkit/customHook/customHook';

export default function PostCallFeedbackModal() {
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const currentUser = useAppSelector((state) => state?.user?.userData);

  useEffect(() => {
    const handleFocus = () => {
      const pendingData = sessionStorage.getItem('pendingCallVendor');
      if (pendingData) {
        setVendorData(JSON.parse(pendingData));
      }
    };

    // Check immediately on mount
    handleFocus();

    // Listen to focus event
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const clearPending = () => {
    sessionStorage.removeItem('pendingCallVendor');
    setVendorData(null);
  };

  const handleBooked = async () => {
    if (!vendorData || !currentUser) return;
    setLoading(true);
    try {
      await createBooking({
        vendorId: vendorData.id,
        // Optional service ID, totalAmount, location
        totalAmount: 0,
        location: currentUser.address || 'User Address',
        date: new Date()
      });
      setToast('Booking request sent to vendor!');
      setTimeout(() => {
        setToast('');
        clearPending();
      }, 3000);
    } catch (error) {
      console.error(error);
      setToast('Failed to send booking request');
      setTimeout(() => setToast(''), 3000);
      setLoading(false);
    }
  };

  const handleNoResponse = () => {
    // Analytics call can be placed here
    clearPending();
  };

  if (!vendorData) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'flex-end', padding: '1rem', paddingBottom: '3rem' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px', margin: '0 auto', position: 'relative', background: 'white' }}>
        <button onClick={clearPending} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
          <X size={20} color="#64748b" />
        </button>
        
        {toast ? (
           <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--success-color)', fontWeight: 600 }}>
              {toast}
           </div>
        ) : (
          <>
            <h3 className="text-h2" style={{ marginBottom: '0.5rem' }}>Did you hire {vendorData.name}?</h3>
            <p className="text-sub" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>We noticed you called this vendor. Was the conversation successful?</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                className="btn" 
                style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', justifyContent: 'center' }}
                onClick={handleBooked}
                disabled={loading}
              >
                <CheckCircle size={18} /> {loading ? 'Sending...' : 'Yes, Booked'}
              </button>
              <button 
                className="btn btn-outline" 
                style={{ borderColor: '#fecaca', color: '#ef4444', justifyContent: 'center' }}
                onClick={handleNoResponse}
              >
                <XCircle size={18} /> No Response / Declined
              </button>
              <button 
                className="btn btn-outline" 
                style={{ justifyContent: 'center' }}
                onClick={clearPending}
              >
                <Clock size={18} /> Still talking / Undecided
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
