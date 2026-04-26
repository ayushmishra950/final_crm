export default function HomeTab({ isOnline, activeJobs, newLeads, showToast }) {
  return (
    <div className="animate-fade-in">
      {!isOnline && (
        <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '12px' }}>
          You are currently offline. Go online to receive daily job leads.
        </div>
      )}

      <h3>Active Jobs</h3>

      {activeJobs.length === 0 ? (
        <div>No active jobs</div>
      ) : (
        activeJobs.map(job => (
          <div key={job.id}>
            <p>{job.customer}</p>
            <button onClick={() => showToast('Marked as Completed!')}>
              Complete
            </button>
          </div>
        ))
      )}
    </div>
  );
}