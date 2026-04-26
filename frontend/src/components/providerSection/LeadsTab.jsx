export default function LeadsTab({ newLeads, handleAccept, handleDecline }) {
  return (
    <div className="animate-fade-in">
      <h2>Available Bookings</h2>

      {newLeads.length === 0 ? (
        <div>No new leads</div>
      ) : (
        newLeads.map(lead => (
          <div key={lead.id}>
            <p>{lead.issue}</p>

            <button onClick={() => handleDecline(lead.id)}>Decline</button>
            <button onClick={() => handleAccept(lead.id)}>Accept</button>
          </div>
        ))
      )}
    </div>
  );
}