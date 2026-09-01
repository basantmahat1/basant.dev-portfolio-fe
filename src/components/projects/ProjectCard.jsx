import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

export default function ProjectCard({ project, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: 'easeOut' }}
      className="shell"
    >
      <Link to={`/projects/${project.slug}`} className="glass block overflow-hidden">
        <div className="h-36 overflow-hidden border-b border-[var(--border)]">
          <img
            src={project.thumbnail?.url || '/placeholder-thumbnail.jpg'}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <div className="mb-1 font-display text-base font-semibold">{project.title}</div>
          <p className="mb-3 text-xs leading-relaxed text-text-secondary">
            {project.shortDescription}
          </p>
          <div className="mb-3 flex flex-wrap gap-1">
            {(project.technologies || []).slice(0, 4).map((tech) => (
              <span key={tech} className="tag">
                {tech}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-tertiary">
            View Case Study <FaArrowRight size={10} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
