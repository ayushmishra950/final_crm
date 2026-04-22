import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Bell, User } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="bottom-nav">
      <Link to="/" className={`bottom-nav-item ${path === '/' ? 'active' : ''}`}>
        <Home size={24} />
        <span>Home</span>
      </Link>
      <Link to="/user-dashboard" className={`bottom-nav-item ${path === '/user-dashboard' ? 'active' : ''}`}>
        <Search size={24} />
        <span>Explore</span>
      </Link>
      <Link to="/notifications" className={`bottom-nav-item ${path === '/notifications' ? 'active' : ''}`}>
        <Bell size={24} />
        <span>Alerts</span>
      </Link>
      <Link to="/user-profile" className={`bottom-nav-item ${path === '/user-profile' ? 'active' : ''}`}>
        <User size={24} />
        <span>Profile</span>
      </Link>
    </div>
  );
}
