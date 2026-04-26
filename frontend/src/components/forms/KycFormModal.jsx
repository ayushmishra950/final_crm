import { X } from 'lucide-react';

export default function KycFormModal({
  setShowKycForm,
  setIsKycVerified,
  showToast
}) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      
      <div className="animate-fade-in" style={{ background: 'white', width: '100%', maxWidth: '500px', borderRadius: '24px', padding: '2rem 1.5rem', position: 'relative' }}>
        
        <button onClick={() => setShowKycForm(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none' }}>
          <X size={24}/>
        </button>

        <h2>Complete KYC</h2>

        <form onSubmit={(e) => {
          e.preventDefault();
          setIsKycVerified(true);
          setShowKycForm(false);
          showToast('KYC Submitted!');
        }}>

          <input placeholder="PAN" />
          <input placeholder="Aadhar" />
          <input placeholder="Bank" />

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}