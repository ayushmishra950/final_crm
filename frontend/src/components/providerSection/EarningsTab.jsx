export default function EarningsTab({ completedJobs, showToast }) {
  return (
    <div className="animate-fade-in">
      <h2>Earnings</h2>

      <button onClick={() => showToast('Withdrawal request sent')}>
        Withdraw
      </button>

      {completedJobs.map(job => (
        <div key={job.id}>
          <p>{job.customer}</p>
          <p>{job.amount}</p>
        </div>
      ))}
    </div>
  );
}