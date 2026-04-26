export default function ProfileTab({
  vendorUser,
  setIsEditing,
  isKycVerified,
  setShowKycForm,
  navigate
}) {
  return (
    <div className="animate-fade-in">
      <h2>{vendorUser.name}</h2>

      <button onClick={() => setIsEditing(true)}>Edit</button>

      {!isKycVerified && (
        <button onClick={() => setShowKycForm(true)}>
          Complete KYC
        </button>
      )}

      <button onClick={() => navigate('/user-profile')}>
        Switch Mode
      </button>
    </div>
  );
}