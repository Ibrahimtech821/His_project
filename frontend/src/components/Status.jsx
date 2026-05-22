export default function Status({ status }) {
  if (!status?.message) return null;
  return <div className={`status ${status.type}`}>{status.message}</div>;
}
