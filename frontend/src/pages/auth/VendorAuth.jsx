import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, KeyRound, CheckCircle } from 'lucide-react';
import { categories } from '../../data/dummyData';

export default function VendorAuth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState('input'); // input | otp | success

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep('otp');
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (isLogin) {
       navigate('/provider-dashboard');
    } else {
       setStep('success');
       setTimeout(() => {
          navigate('/provider-dashboard');
       }, 2000);
    }
  };

  return (
    <div className="page-content" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: 0 }}>
      {/* Header */}
      <div className="navbar" style={{ borderBottom: 'none' }}>
        <button className="btn-icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <span className="badge badge-warning" style={{marginLeft: 'auto'}}>Service Partner</span>
      </div>

      {step === 'success' ? (
         <div className="section animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <CheckCircle size={80} color="var(--success-color)" style={{ marginBottom: '1.5rem' }}/>
            <h1 className="text-h1">Registration Setup!</h1>
            <p className="text-sub text-center" style={{ maxWidth: '300px' }}>Your service provider account is created. Forwarding to dashboard...</p>
         </div>
      ) : (
         <div className="section animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
           <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
             <Briefcase size={40} color="var(--warning-color)" style={{ marginBottom: '1rem' }} />
             <h1 className="text-h1" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
                {step === 'otp' ? 'Provider OTP' : (isLogin ? 'Vendor Login' : 'Register your Business')}
             </h1>
             <p className="text-sub" style={{ fontSize: '0.9rem' }}>
                {isLogin && step === 'input' && 'Access leads and manage your profile.'}
                {!isLogin && step === 'input' && 'Partner with us and get daily jobs.'}
             </p>
           </div>

           {step === 'input' ? (
             <form onSubmit={handleSubmit}>
               {!isLogin && (
                  <>
                     <div className="input-group">
                       <label className="text-sub" style={{ fontWeight: 'var(--font-medium)', color: 'var(--text-main)' }}>Your Name</label>
                       <input type="text" className="input-field" placeholder="Full name as per KYC" required />
                     </div>
                     <div className="input-group">
                       <label className="text-sub" style={{ fontWeight: 'var(--font-medium)', color: 'var(--text-main)' }}>Service Category</label>
                       <select className="input-field" required>
                          <option value="" disabled selected>Select Primary Skill</option>
                          {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                       </select>
                     </div>
                     <div className="input-group">
                       <label className="text-sub" style={{ fontWeight: 'var(--font-medium)', color: 'var(--text-main)' }}>Location Range (km)</label>
                       <input type="number" className="input-field" placeholder="E.g., 5" required />
                     </div>
                  </>
               )}

               <div className="input-group">
                 <label className="text-sub" style={{ fontWeight: 'var(--font-medium)', color: 'var(--text-main)' }}>Registered Mobile</label>
                 <div className="flex" style={{ gap: '0.5rem' }}>
                   <input type="text" className="input-field" value="+91" readOnly style={{ width: '60px', textAlign: 'center', padding: '0.75rem 0.5rem', background: '#fef9c3', border: '1px solid #fde047' }} />
                   <input type="tel" className="input-field" placeholder="10-digit number" required style={{ flex: 1, borderColor: isLogin ? 'var(--border-color)' : '#fde047' }} maxLength={10} />
                 </div>
               </div>

               <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'var(--warning-color)' }}>
                  {isLogin ? 'Request OTP' : 'Start Earning (Register)'}
               </button>

               <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
                 <div style={{ flex: 1, borderBottom: '1px solid #e2e8f0' }}></div>
                 <span style={{ padding: '0 1rem', color: '#64748b', fontSize: '0.875rem' }}>OR</span>
                 <div style={{ flex: 1, borderBottom: '1px solid #e2e8f0' }}></div>
               </div>

               <button type="button" onClick={() => {
                  setStep('success');
                  setTimeout(() => navigate('/provider-dashboard'), 2000);
               }} style={{ width: '100%', padding: '1rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontWeight: 600, color: '#1e293b', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', cursor: 'pointer' }}>
                 <svg width="20" height="20" viewBox="0 0 24 24">
                   <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                   <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                   <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                   <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                 </svg>
                 Continue with Google
               </button>
             </form>
           ) : (
             <form onSubmit={handleVerify}>
               <div className="flex justify-between" style={{ marginBottom: '2rem', gap: '1rem' }}>
                 {[1, 2, 3, 4].map(digit => (
                   <input key={digit} type="tel" className="input-field text-center" maxLength={1} style={{ fontSize: '1.5rem', padding: '1rem 0' }} required />
                 ))}
               </div>
               <button type="submit" className="btn btn-primary btn-block" style={{ padding: '1rem', backgroundColor: 'var(--warning-color)' }}>Verify Identity</button>
             </form>
           )}

           {step === 'input' && (
              <div className="text-center" style={{ marginTop: '2rem', padding: '1rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-lg)' }}>
                <div className="text-sub" style={{ marginBottom: '0.5rem' }}>{isLogin ? "New service provider?" : 'Already registered your business?'}</div>
                <button type="button" className="btn btn-outline btn-block" onClick={() => setIsLogin(!isLogin)} style={{ borderColor: 'var(--primary-color)' }}>
                   {isLogin ? 'Become a Partner' : 'Login Here'}
                </button>
              </div>
           )}
         </div>
      )}
    </div>
  );
}
