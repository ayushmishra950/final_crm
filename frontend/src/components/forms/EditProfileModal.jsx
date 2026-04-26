import { X } from 'lucide-react';

export default function EditProfileModal({
  vendorUser,
  setVendorUser,
  setIsEditing,
  showToast
}) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      
      <div className="animate-fade-in" style={{ background: 'white', width: '100%', maxWidth: '400px', borderRadius: '24px', padding: '2rem 1.5rem', position: 'relative' }}>
        
        <button onClick={() => setIsEditing(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none' }}>
          <X size={24}/>
        </button>

        <h2>Edit Profile</h2>

        <form onSubmit={(e) => {
          e.preventDefault();
          setIsEditing(false);
          showToast('Profile Updated Successfully!');
        }}>

          <input 
            value={vendorUser.name}
            onChange={(e) => setVendorUser({...vendorUser, name: e.target.value})}
          />

          <input 
            value={vendorUser.phone}
            onChange={(e) => setVendorUser({...vendorUser, phone: e.target.value})}
          />

          <textarea 
            value={vendorUser.about}
            onChange={(e) => setVendorUser({...vendorUser, about: e.target.value})}
          />

          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
}