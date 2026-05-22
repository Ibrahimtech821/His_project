export default function StatusMessage({ status }) {
  if (!status?.message) return null;

  return (
    <div className={`status-message ${status.type || "info"}`}>
      {status.message}
    </div>
  );
}
