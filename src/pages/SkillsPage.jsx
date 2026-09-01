import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaReact,
  FaNodeJs,
  FaJs,
  FaHtml5,
  FaCss3Alt,
  FaGitAlt,
  FaAws,
  FaJava,
  FaDatabase,
  FaServer,
  FaCloud,
  FaRobot,
  FaRocket,
  FaLayerGroup,
} from 'react-icons/fa';

const categories = ['All', 'Frontend', 'Backend', 'Database & Cloud', 'AI & System'];

const skillsData = [
  // Frontend
  { name: 'React', category: 'Frontend', icon: FaReact, color: '#61DAFB', desc: 'Modern SPA & Component Architecture' },
  { name: 'JavaScript (ES6+)', category: 'Frontend', icon: FaJs, color: '#F7DF1E', desc: 'Core Language & Async Programming' },
  { name: 'Tailwind CSS', category: 'Frontend', icon: FaCss3Alt, color: '#38BDF8', desc: 'Utility-first Responsive UI' },
  { name: 'HTML5 & CSS3', category: 'Frontend', icon: FaHtml5, color: '#E34F26', desc: 'Semantic & Accessible Web Standards' },

  // Backend
  { name: 'Java', category: 'Backend', icon: FaJava, color: '#E76F00', desc: 'OOP, Core Java & Enterprise Backend' },
  { name: 'Node.js', category: 'Backend', icon: FaNodeJs, color: '#68A063', desc: 'Event-driven Server Applications' },
  { name: 'Express.js', category: 'Backend', icon: FaServer, color: '#999999', desc: 'Microservices & Routing Middleware' },

  // Database & Cloud
  { name: 'SQL', category: 'Database & Cloud', icon: FaDatabase, color: '#00758F', desc: 'Relational Database, Schema & Queries' },
  { name: 'MongoDB', category: 'Database & Cloud', icon: FaDatabase, color: '#47A248', desc: 'NoSQL Document Store & Aggregations' },
  { name: 'AWS & Cloud', category: 'Database & Cloud', icon: FaAws, color: '#FF9900', desc: 'Cloud Infrastructure & S3 Storage' },
  { name: 'Git & GitHub', category: 'Database & Cloud', icon: FaGitAlt, color: '#F05032', desc: 'Version Control & Team Collaboration' },
  { name: 'Cloud Deployment', category: 'Database & Cloud', icon: FaCloud, color: '#0EA5E9', desc: 'Vercel, Render & CI/CD Pipelines' },

  // AI & System
  { name: 'AI Integration', category: 'AI & System', icon: FaRobot, color: '#8B5CF6', desc: 'LLM APIs & AI-Powered Workflows' },
  { name: 'System Design', category: 'AI & System', icon: FaLayerGroup, color: '#EC4899', desc: 'Scalable & Maintainable Architecture' },
  { name: 'Product Engineering', category: 'AI & System', icon: FaRocket, color: 'var(--tertiary)', desc: 'End-to-end Solution Delivery' },
];

export default function SkillsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredSkills = selectedCategory === 'All'
    ? skillsData
    : skillsData.filter((s) => s.category === selectedCategory);

  return (
    <section className="mx-auto max-w-6xl px-8 py-16">
      <div className="mb-10 text-center">
        <div className="section-label">Skills &amp; Tech Stack</div>
        <h1 className="section-title mb-3 text-4xl">What I work with</h1>
        <p className="mx-auto max-w-lg text-sm text-text-secondary">
          A curated collection of languages, frameworks, databases, and tools I use to build robust digital products.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              selectedCategory === cat
                ? 'bg-tertiary text-white shadow-sm'
                : 'border border-[var(--border)] bg-[var(--panel)] text-text-primary hover:border-tertiary hover:text-tertiary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredSkills.map(({ name, icon: Icon, color, category, desc }) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              key={name}
              className="shell"
            >
              <div className="glass flex items-center gap-4 p-5 transition-transform hover:-translate-y-1">
                <div
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[var(--border)] bg-white/20 shadow-sm"
                  style={{ color }}
                >
                  <Icon size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="truncate font-display text-sm font-semibold text-text-primary">
                      {name}
                    </h3>
                    <span className="rounded-full bg-[rgba(214,112,73,0.12)] px-2 py-0.5 text-[10px] font-semibold text-tertiary">
                      {category}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-xs text-text-secondary">{desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
