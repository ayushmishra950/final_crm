import { useState, useEffect } from 'react';
import { ArrowLeft, Bell, Star, CheckCircle, Clock, AlertCircle, X, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { getNotifications, markNotificationRead } from '../service/userService';

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await getNotifications();
      if (res.success) {
        setNotifications(res.notifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error("Error marking notification read:", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking_confirmed': return <CheckCircle size={24} color="#10b981" />;
      case 'booking_cancelled': return <X size={24} color="#ef4444" />;
      case 'payment_received': return <Star size={24} color="#f59e0b" />;
      case 'system_alert': return <AlertCircle size={24} color="#4f46e5" />;
      default: return <Bell size={24} color="#64748b" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f8fafc' }}>
      <div className="navbar" style={{ padding: '1rem', background: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#f1f5f9', border: 'none', width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e293b' }}>
           <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', margin: 0, flex: 1 }}>Notifications</h1>
        {notifications.length > 0 && (
           <button style={{ background: 'transparent', border: 'none', color: '#4f46e5', fontSize: '0.875rem', fontWeight: 600 }}>Clear All</button>
        )}
      </div>
      
      <div className="page-content" style={{ overflowY: 'auto', padding: '1.5rem', paddingBottom: '90px' }}>
         {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
               <div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid #e2e8f0', borderTopColor: '#4f46e5', borderRadius: '50%', margin: '0 auto' }}></div>
            </div>
         ) : notifications.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {notifications.map((notif) => (
                  <div 
                     key={notif._id} 
                     onClick={() => !notif.read && handleMarkRead(notif._id)}
                     style={{ 
                        background: 'white', 
                        padding: '1.25rem', 
                        borderRadius: '20px', 
                        border: '1px solid #f1f5f9', 
                        display: 'flex', 
                        gap: '1rem', 
                        position: 'relative',
                        opacity: notif.read ? 0.7 : 1,
                        boxShadow: notif.read ? 'none' : '0 4px 6px -1px rgba(0,0,0,0.05)'
                     }}
                  >
                     {!notif.read && (
                        <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', width: 8, height: 8, background: '#4f46e5', borderRadius: '50%' }}></div>
                     )}
                     <div style={{ width: 48, height: 48, borderRadius: '14px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {getNotificationIcon(notif.type)}
                     </div>
                     <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem', marginBottom: '4px' }}>{notif.title}</div>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>{notif.message}</p>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '8px', fontWeight: 500 }}>{new Date(notif.createdAt).toLocaleString()}</div>
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
               <div style={{ width: 80, height: 80, background: '#f1f5f9', borderRadius: '50%', margin: '0 auto 1.5rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bell size={32} color="#94a3b8" />
               </div>
               <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>All caught up!</h3>
               <p style={{ fontSize: '0.875rem', color: '#64748b' }}>No new notifications. We'll let you know when something happens.</p>
               <button onClick={() => navigate('/home')} style={{ marginTop: '1.5rem', background: '#4f46e5', color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: '12px', fontWeight: 600 }}>Go Home</button>
            </div>
         )}
      </div>
      <BottomNav />
    </div>
  );
}
