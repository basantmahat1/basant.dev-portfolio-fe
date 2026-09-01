export default function ExperiencePage() {
  const timeline = [
    { year: '2022', title: 'Started coding professionally', text: 'Built my foundation in web development and problem solving.' },
    { year: '2023', title: 'Freelance projects', text: 'Delivered client work and learned how to turn requirements into real products.' },
    { year: '2024', title: 'AI-powered apps', text: 'Started building AI-enabled experiences and workflow automation tools.' },
    { year: '2025', title: 'Scalable SaaS focused', text: 'Focused on product quality, performance, and long-term maintainability.' },
  ];

  return (
    <section className="mx-auto max-w-5xl px-8 py-16">
      <div className="mb-8 text-center">
        <div className="section-label">Experience</div>
        <h1 className="section-title mb-3 text-4xl">My Journey</h1>
      </div>

      <div className="space-y-5">
        {timeline.map((item) => (
          <div key={item.year} className="shell">
            <div className="glass flex gap-5 p-6">
              <div className="min-w-[70px] text-sm font-bold text-tertiary">{item.year}</div>
              <div>
                <h3 className="mb-1 font-display text-lg font-semibold">{item.title}</h3>
                <p className="text-sm leading-6 text-text-secondary">{item.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
