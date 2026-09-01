import { motion } from 'framer-motion';

export function FeatureCards({ features = [] }) {
  if (!features.length) return null;
  const sorted = [...features].sort((a, b) => a.order - b.order);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sorted.map((feature, i) => (
        <motion.div
          key={feature._id || i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          className="shell"
        >
          <div className="glass p-5">
            <div className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-[rgba(214,112,73,0.15)] text-tertiary">
              <i className={feature.icon || 'fa-solid fa-bolt'} />
            </div>
            <div className="mb-1 font-display text-base font-semibold">{feature.title}</div>
            <p className="text-xs leading-relaxed text-text-secondary">{feature.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

const categoryLabels = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  api: 'APIs',
  library: 'Libraries',
  deployment: 'Deployment',
};

export function TechStackBadges({ techStack = [] }) {
  if (!techStack.length) return null;

  const grouped = techStack.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-tertiary">
            {categoryLabels[category] || category}
          </div>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <span
                key={item.name}
                className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[rgba(249,238,217,0.6)] px-3 py-1.5 text-xs font-semibold"
              >
                {item.icon && <i className={item.icon} />}
                {item.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
