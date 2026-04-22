import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, KeyRound, Phone, ShieldCheck } from 'lucide-react';

export default function Auth({ defaultRole = 'user' }) {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || defaultRole;
  const [step, setStep] = useState('phone'); // phone | otp
  const navigate = useNavigate();

  const handleSendOtp = (e) => {
    e.preventDefault();
    setStep('otp');
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (role === 'admin') navigate('/admin');
    else if (role === 'provider') navigate('/provider-dashboard');
    else navigate('/home');
  };

  return (
    <div className="page-content" style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: 0 }}>
      <div className="navbar" style={{ borderBottom: 'none' }}>
        <button className="btn-icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        {role === 'admin' && <div className="badge badge-warning" style={{marginLeft: 'auto'}}>Admin Login</div>}
      </div>

      <div className="section animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 64, height: 64, backgroundColor: 'var(--primary-light)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', color: 'var(--primary-color)' }}>
            {role === 'admin' ? <ShieldCheck size={32}/> : (step === 'phone' ? <Phone size={32} /> : <KeyRound size={32} />)}
          </div>
          <h1 className="text-h1">{role === 'admin' ? 'Admin Access' : (step === 'phone' ? 'Enter Mobile Number' : 'Verify OTP')}</h1>
          <p className="text-sub">
            {role === 'admin' ? 'Enter administrative credentials.' : (step === 'phone' ? 'We will send you a 4-digit verification code.' : 'Enter the code sent to +91 9876543210')}
          </p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp}>
            {role === 'admin' ? (
               <div className="input-group">
                 <label className="text-sub" style={{ fontWeight: 'var(--font-medium)', color: 'var(--text-main)' }}>Admin ID</label>
                 <input type="text" className="input-field" placeholder="Admin username" required />
               </div>
            ) : (
               <div className="input-group">
                 <label className="text-sub" style={{ fontWeight: 'var(--font-medium)', color: 'var(--text-main)' }}>Mobile Number</label>
                 <div className="flex" style={{ gap: '0.5rem' }}>
                   <input type="text" className="input-field" value="+91" readOnly style={{ width: '60px', textAlign: 'center', padding: '0.75rem 0.5rem' }} />
                   <input type="tel" className="input-field" placeholder="10-digit mobile number" required style={{ flex: 1 }} maxLength={10} />
                 </div>
               </div>
            )}
            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '1rem' }}>{role === 'admin' ? 'Proceed' : 'Get OTP'}</button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <div className="flex justify-between" style={{ marginBottom: '2rem', gap: '1rem' }}>
              {[1, 2, 3, 4].map(digit => (
                <input key={digit} type="text" className="input-field text-center" maxLength={1} style={{ fontSize: '1.5rem', padding: '1rem 0' }} required />
              ))}
            </div>
            <button type="submit" className="btn btn-primary btn-block">Verify & Login</button>
            <div className="text-center" style={{ marginTop: '1.5rem' }}>
              <span className="text-sub">Didn't receive the code? </span>
              <span style={{ color: 'var(--primary-color)', fontWeight: 'var(--font-medium)', cursor: 'pointer' }}>Resend</span>
            </div>
          </form>
        )}
      </div>
      
      <div className="section text-center text-sub">
         &copy; 2026 BharatSeva. <br/> By logging in, you agree to our T&C.
      </div>
    </div>
  );
}
