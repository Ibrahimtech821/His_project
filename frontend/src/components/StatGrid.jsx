export default function StatGrid({ items }) {
  return (
    <section className="stat-grid">
      {items.map((item) => (
        <div className="stat" key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
          <p>{item.text}</p>
        </div>
      ))}
    </section>
  );
}
