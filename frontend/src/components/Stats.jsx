export default function Stats({ items }) {
  return (
    <section className="stats-grid">
      {items.map((item) => (
        <div className="stat-card" key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
          <p>{item.text}</p>
        </div>
      ))}
    </section>
  );
}
