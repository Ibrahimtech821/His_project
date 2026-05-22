export default function PageHeader({ badge, title, text, image }) {
  return (
    <section className="page-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(8, 31, 61, .88), rgba(8, 31, 61, .42)), url(${image})` }}>
      <div>
        <span>{badge}</span>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
    </section>
  );
}
