export default function EmptyState({ title = "No data yet", text = "Nothing to show right now." }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
