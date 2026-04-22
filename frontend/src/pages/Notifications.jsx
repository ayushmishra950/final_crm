import { ArrowLeft, Bell, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

export default function Notifications() {
  const navigate = useNavigate();

  return (
    <>
      <div className="navbar">
        <button className="btn-icon" onClick={() => navigate(-1)}>
           <ArrowLeft size={20} />
        </button>
        <h1 className="text-h2" style={{ margin: 0, marginLeft: '1rem', flex: 1 }}>Notifications</h1>
      </div>
      
      <div className="page-content section">
         <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem', background: 'var(--primary-light)', borderColor: 'var(--primary-light)' }}>
            <div className="avatar" style={{ background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Star size={24} />
            </div>
            <div>
               <h4 style={{ fontWeight: 'var(--font-medium)', marginBottom: '0.25rem' }}>Rate your recent service</h4>
               <p className="text-sub">How was your experience with Ramesh Sharma (Electrician)?</p>
               <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem', marginTop: '0.5rem' }}>Leave a Review</button>
            </div>
         </div>

         <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div className="avatar" style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Bell size={24} />
            </div>
            <div>
               <h4 style={{ fontWeight: 'var(--font-medium)', marginBottom: '0.25rem' }}>Monsoon Offer!</h4>
               <p className="text-sub">Get 10% off on all AC repair services this week. Find experts near you.</p>
            </div>
         </div>
      </div>
      <BottomNav />
    </>
  );
}
