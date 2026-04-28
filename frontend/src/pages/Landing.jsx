import { useState, useEffect } from 'react';
import { User, Briefcase, ShieldCheck, Star, Shield, Zap, Wrench, CheckCircle, Droplets, Sparkles, Scissors, Paintbrush, Wind, Clock } from 'lucide-react';
import { getCategories } from '../service/categoryService';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
       try {
          const res = await getCategories();
          if (res.success) setCategories(res.data);
       } catch (error) { console.log(error); }
    }
    fetchCats();
  }, []);

  const getCategoryIcon = (categoryName) => {
    const name = categoryName?.toLowerCase() || '';
    if (name.includes('repair')) return Wrench;
    if (name.includes('clean')) return Sparkles;
    if (name.includes('plumb')) return Droplets;
    if (name.includes('electric')) return Zap;
    if (name.includes('paint')) return Paintbrush;
    if (name.includes('salon') || name.includes('hair')) return Scissors;
    return Wrench; // Default
  };

  return (
    <div className="landing-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--surface-color)' }}>
      
      {/* HEADER / NAVBAR */}
      <nav style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', zIndex: 100 }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={28} color="var(--primary-color)" />
            <h1 className="text-h1" style={{ margin: 0, color: 'var(--primary-color)', fontSize: '1.5rem', fontWeight: 600 }}>BharatSeva</h1>
         </div>
         <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-outline" style={{ display: 'none' }} id="desktop-login" onClick={() => navigate('/user-auth')}>Log In</button>
            <button className="btn btn-primary" onClick={() => navigate('/user-auth')}>Find a Pro</button>
         </div>
      </nav>

      {/* HERO SECTION */}
      <div className="section" style={{ padding: '4rem 2rem', textAlign: 'center', background: 'linear-gradient(180deg, var(--primary-light) 0%, var(--surface-color) 100%)' }}>
         <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 className="text-h1" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 600, color: '#1e293b', lineHeight: 1.2, marginBottom: '1.5rem' }}>
               Trusted Local Experts,<br/> <span style={{ color: 'var(--primary-color)' }}>Just a Click Away.</span>
            </h1>
            <p className="text-sub" style={{ fontSize: '1.125rem', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem auto', color: '#64748b' }}>
               India's fastest-growing hyperlocal network. Get top-rated electricians, plumbers, and mechanics at your doorstep in tier-2 and tier-3 cities.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
               <button className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }} onClick={() => navigate('/user-auth')}>
                  <User size={20} /> Hire a Professional
               </button>
               <button className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.125rem', backgroundColor: 'white' }} onClick={() => navigate('/vendor-auth')}>
                  <Briefcase size={20} /> Join as a Partner
               </button>
            </div>
         </div>
         
         <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center' }}>
            <img 
               src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop" 
               alt="Professionals at work" 
               style={{ width: '100%', maxWidth: '1000px', height: '400px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }} 
            />
         </div>
      </div>

      {/* SERVICES DISPLAY */}
      <div className="section" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
         <div className="text-center" style={{ marginBottom: '3rem' }}>
            <h2 className="text-h1" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Popular Services</h2>
            <p className="text-sub">Whatever you need, we've got you covered.</p>
         </div>

         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
            {categories.length > 0 ? categories.slice(0, 6).map((cat, idx) => {
               const Icon = getCategoryIcon(cat.name);
               return (
                  <div key={idx} className="card text-center" style={{ cursor: 'pointer', transition: 'transform 0.2s', padding: '2rem 1rem' }} onClick={() => navigate('/user-auth')}>
                     <div style={{ width: 64, height: 64, margin: '0 auto 1rem auto', background: 'var(--primary-light)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                        <Icon size={32} />
                     </div>
                     <h3 className="text-h2" style={{ fontSize: '1rem', margin: 0 }}>{cat.name}</h3>
                  </div>
               );
            }) : (
               <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#94a3b8' }}>Loading categories...</div>
            )}
         </div>
      </div>

      {/* WHY CHOOSE US / FEATURES */}
      <div className="section" style={{ padding: '4rem 2rem', background: '#f8fafc' }}>
         <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
               <div>
                  <h2 className="text-h1" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Why choose BharatSeva?</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                     <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flexShrink: 0, width: 48, height: 48, background: '#dcfce7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534' }}>
                           <Shield size={24} />
                        </div>
                        <div>
                           <h4 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem' }}>100% Verified Experts</h4>
                           <p className="text-sub">Every service provider undergoes a strict KYC and police verification process before listing.</p>
                        </div>
                     </div>
                     <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flexShrink: 0, width: 48, height: 48, background: '#fef9c3', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#854d0e' }}>
                           <Star size={24} />
                        </div>
                        <div>
                           <h4 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Transparent Pricing</h4>
                           <p className="text-sub">No hidden charges. Check ratings and reviews before finalizing the cost locally.</p>
                        </div>
                     </div>
                     <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flexShrink: 0, width: 48, height: 48, background: 'var(--primary-light)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                           <Zap size={24} />
                        </div>
                        <div>
                           <h4 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Lightning Fast Response</h4>
                           <p className="text-sub">Connect via WhatsApp or direct call immediately after booking. Service delivered fast.</p>
                        </div>
                     </div>
                  </div>
               </div>
               <div style={{ position: 'relative' }}>
                  <img src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop" style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }} alt="Trust" />
                  <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                     <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>4.8</div>
                     <div>
                        <div style={{ display: 'flex', color: 'var(--warning-color)' }}><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} /></div>
                        <div className="text-sub" style={{ fontSize: '0.75rem', marginTop: '2px' }}>Average Rating</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* TESTIMONIALS WITH DUMMY DATA */}
      <div className="section" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
         <div className="text-center" style={{ marginBottom: '3rem' }}>
            <h2 className="text-h1" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Voices of our Community</h2>
            <p className="text-sub">Hear what users and partners say about us.</p>
         </div>

         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ padding: '2rem', background: 'var(--bg-color)', border: 'none' }}>
               <p style={{ fontStyle: 'italic', color: '#475569', marginBottom: '1.5rem', lineHeight: 1.6 }}>"Finding a plumber in my area used to be a nightmare. BharatSeva connected me with Suresh in 2 minutes. Outstanding app for small cities!"</p>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src="https://i.pravatar.cc/150?img=32" style={{ width: 48, height: 48, borderRadius: '50%' }} alt="User" />
                  <div>
                     <div style={{ fontWeight: 600 }}>Anita Desai</div>
                     <div className="text-sub">Customer, Meerut</div>
                  </div>
               </div>
            </div>
            
            <div className="card" style={{ padding: '2rem', background: 'var(--bg-color)', border: 'none' }}>
               <p style={{ fontStyle: 'italic', color: '#475569', marginBottom: '1.5rem', lineHeight: 1.6 }}>"As an electrician, I struggled to find regular work. Since I joined as a partner, my daily leads have doubled. Fast and zero commission!"</p>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src="https://i.pravatar.cc/150?img=11" style={{ width: 48, height: 48, borderRadius: '50%' }} alt="User" />
                  <div>
                     <div style={{ fontWeight: 600 }}>Ramesh Sharma</div>
                     <div className="text-sub">Electrician, Kanpur</div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* CALL TO ACTION */}
      <div className="section" style={{ padding: '4rem 2rem', background: 'var(--primary-color)', color: 'white', textAlign: 'center' }}>
         <h2 className="text-h1" style={{ color: 'white', fontSize: '2rem', marginBottom: '1rem' }}>Ready to simplify your day?</h2>
         <p style={{ opacity: 0.9, marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>Join the fastest-growing local services ecosystem in India.</p>
         <button className="btn" style={{ background: 'white', color: 'var(--primary-color)', padding: '1rem 2.5rem', fontSize: '1.125rem' }} onClick={() => navigate('/user-auth')}>
            Explore App
         </button>
      </div>

      {/* FOOTER */}
      <footer style={{ padding: '2rem', background: '#1e293b', color: '#94a3b8', textAlign: 'center' }}>
         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
               <Zap size={20} /> <span style={{ fontWeight: 600, fontSize: '1.25rem' }}>BharatSeva</span>
            </div>
            <div>
               <span style={{ margin: '0 10px', cursor: 'pointer' }}>About</span>
               <span style={{ margin: '0 10px', cursor: 'pointer' }}>Careers</span>
               <span style={{ margin: '0 10px', cursor: 'pointer' }}>Terms</span>
            </div>
         </div>
         <div style={{ borderTop: '1px solid #334155', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span>&copy; 2026 BharatSeva Technologies. All rights reserved.</span>
            <span style={{ cursor: 'pointer', color: '#64748b', fontSize: '0.875rem' }} onClick={() => navigate('/admin-login')}>
               <ShieldCheck size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/> Secured Admin Portal
            </span>
         </div>
      </footer>
      
      <style>{`
         @media(min-width: 768px) {
            #desktop-login { display: inline-flex !important; }
         }
      `}</style>
    </div>
  );
}
