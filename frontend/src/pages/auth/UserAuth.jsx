import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCircle, Phone, KeyRound, EyeOff, Eye } from 'lucide-react';
import { registerUser, loginUser } from '../../service/auth';
import { useCustomToast } from '../../components/CustomToast';

export default function UserAuth() {
  const { addToast } = useCustomToast();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    mobile: '',
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      let res;
      if (isLogin) {
        res = await loginUser({ email: formData.email, password: formData.password });
      } else {
        res = await registerUser(formData);
      }

      console.log(res);
      if (res.status === 201 || res.status === 200) {
        addToast(isLogin ? "Login Successful" : "Registration Successful", "Welcome to BharatSeva!", "success");
        navigate('/user-dashboard');
      }
    }
    catch (err) {
      console.log(err);
      addToast("Authentication Failed", err.response?.data?.message || "Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="page-content" style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: 0 }}>
      {/* Header */}
      <div className="navbar" style={{ borderBottom: 'none' }}>
        <button className="btn-icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h3 style={{ margin: '0 0 0 1rem', fontSize: '1rem', flex: 1, color: 'var(--text-main)', opacity: 0.8 }}>Customer Portal</h3>
      </div>

      <div className="section animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: 72, height: 72, backgroundColor: 'var(--primary-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', color: 'var(--primary-color)' }}>
            {isLogin ? <KeyRound size={36} /> : <UserCircle size={36} />}
          </div>
          <h1 className="text-h1" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h1>
          <p className="text-sub" style={{ fontSize: '0.9rem' }}>
            {isLogin ? 'Login to book services.' : 'Join BharatSeva to find local experts.'}
          </p>
        </div>

        <form onSubmit={handleAuth}>
          {!isLogin && (
            <div className="input-group">
              <label className="text-sub" style={{ fontWeight: 'var(--font-medium)', color: 'var(--text-main)' }}>Full Name</label>
              <input type="text" name='fullName' onChange={handleInputChange} className="input-field" placeholder="E.g., Rahul Verma" required />
            </div>
          )}
          <div className="input-group">
            <label className="text-sub" style={{ fontWeight: 'var(--font-medium)', color: 'var(--text-main)' }}>Email</label>
            <input type="email" name='email' onChange={handleInputChange} className="input-field" placeholder="E.g., rahul.verma@example.com" required />
          </div>

          <div className="input-group">
            <label
              className="text-sub"
              style={{ fontWeight: 'var(--font-medium)', color: 'var(--text-main)' }}
            >
              Password
            </label>

            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter your password"
                required
                style={{
                  width: '100%',
                  paddingRight: '2.5rem' // 👈 space for eye icon
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="input-group">
              <label className="text-sub" style={{ fontWeight: 'var(--font-medium)', color: 'var(--text-main)' }}>Mobile Number</label>
              <div className="flex" style={{ gap: '0.5rem' }}>
                <input type="text" className="input-field" value="+91" readOnly style={{ width: '60px', textAlign: 'center', padding: '0.75rem 0.5rem', background: 'var(--bg-color)' }} />
                <input type="tel" name='mobile' onChange={handleInputChange} className="input-field" placeholder="10-digit number" required style={{ flex: 1 }} maxLength={10} />
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '1.5rem', padding: '1rem' }} disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
            <div style={{ flex: 1, borderBottom: '1px solid #e2e8f0' }}></div>
            <span style={{ padding: '0 1rem', color: '#64748b', fontSize: '0.875rem' }}>OR</span>
            <div style={{ flex: 1, borderBottom: '1px solid #e2e8f0' }}></div>
          </div>

          <button type="button" onClick={() => window.location.href = "http://localhost:5000/auth/google"} style={{ width: '100%', padding: '1rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontWeight: 600, color: '#1e293b', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
        </form>

        <div className="text-center" style={{ marginTop: '2rem' }}>
          <span className="text-sub">{isLogin ? "Don't have an account?" : 'Already have an account?'} </span>
          <span onClick={() => setIsLogin(!isLogin)} style={{ color: 'var(--primary-color)', fontWeight: '600', cursor: 'pointer', borderBottom: '1px solid var(--primary-color)' }}>
            {isLogin ? 'Register Here' : 'Login'}
          </span>
        </div>
      </div>

      <div className="section text-center text-sub" style={{ fontSize: '0.75rem', opacity: 0.8 }}>
        By continuing, you agree to our Terms of Service <br />& Privacy Policy.
      </div>
    </div>
  );
}
