import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import UserAuth from './pages/auth/UserAuth';
import VendorAuth from './pages/auth/VendorAuth';
import AdminAuth from './pages/auth/AdminAuth';
import UserDashboard from './pages/UserDashboard';
import UserProfile from './pages/UserProfile';
import ProviderProfile from './pages/ProviderProfile';
import ProviderDashboard from './pages/provider/ProviderDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Notifications from './pages/Notifications';
import { useState } from 'react';

function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/user-auth" element={<UserAuth />} />
          <Route path="/vendor-auth" element={<VendorAuth />} />
          <Route path="/admin-login" element={<AdminAuth />} />
          
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/provider/:id" element={<ProviderProfile />} />
          <Route path="/notifications" element={<Notifications />} />
          
          <Route path="/provider-dashboard" element={<ProviderDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
