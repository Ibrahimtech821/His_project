export default function Hero({ eyebrow, title, text, image }) {
  return (
    <section
      className="hero-card"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(5, 20, 42, .88), rgba(5, 20, 42, .35)), url(${image})`,
      }}
    >
      <div>
        <span>{eyebrow}</span>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
    </section>
  );
}
