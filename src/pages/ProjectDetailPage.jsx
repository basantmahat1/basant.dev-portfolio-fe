import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  FaArrowLeft,
  FaArrowRight,
  FaGithub,
  FaExternalLinkAlt,
  FaFigma,
  FaBook,
  FaPlayCircle,
  FaRocket,
  FaExclamationTriangle,
  FaCheckCircle,
  FaUserTie,
  FaUserFriends,
  FaCalendarAlt,
  FaCogs,
  FaDatabase,
  FaShieldAlt,
  FaBolt,
  FaLightbulb,
} from 'react-icons/fa';
import { fetchProjectBySlug } from '../services/projectService';
import ScreenshotGallery from '../components/projects/ScreenshotGallery';
import { FeatureCards, TechStackBadges } from '../components/projects/FeatureCards';
import GlassCard from '../components/ui/GlassCard';

const statusLabels = {
  completed: 'Completed',
  ongoing: 'In Progress',
  archived: 'Archived',
};

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: 'easeOut' },
};

function SectionHeader({ icon: Icon, label, title }) {
  return (
    <div className="mb-6">
      {label && <div className="section-label">{label}</div>}
      {title && (
        <h2 className="section-title flex items-center gap-2.5 text-2xl md:text-3xl font-bold">
          {Icon && <Icon className="text-tertiary text-xl" />}
          {title}
        </h2>
      )}
    </div>
  );
}

function RichBlock({ html }) {
  if (!html) return null;
  return (
    <div
      className="prose prose-sm max-w-none text-text-secondary leading-relaxed [&_h3]:font-display [&_h3]:text-text-primary [&_strong]:text-text-primary [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [payload, setPayload] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    fetchProjectBySlug(slug)
      .then((res) => active && setPayload(res))
      .catch(() => active && setError('Project not found.'))
      .finally(() => active && setIsLoading(false));
    return () => {
      active = false;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-8 py-16">
        <div className="skeleton mb-6 h-80 w-full rounded-3xl" />
        <div className="skeleton mb-3 h-8 w-2/3" />
        <div className="skeleton h-4 w-full" />
      </div>
    );
  }

  if (error || !payload) {
    return (
      <div className="mx-auto max-w-xl px-8 py-24 text-center">
        <h1 className="mb-3 font-display text-2xl">Project not found</h1>
        <p className="mb-6 text-text-secondary">
          The case study you&apos;re looking for doesn&apos;t exist or was unpublished.
        </p>
        <button onClick={() => navigate('/projects')} className="btn-primary mx-auto">
          Back to Projects
        </button>
      </div>
    );
  }

  const { project, prev, next, related } = payload;
  const heroImage = project.heroBanner?.url || project.thumbnail?.url;

  const deepDiveItems = [
    { key: 'developmentProcess', title: 'Development Process', icon: FaCogs, content: project.details?.developmentProcess },
    { key: 'systemArchitecture', title: 'System Architecture', icon: FaRocket, content: project.details?.systemArchitecture },
    { key: 'databaseDesign', title: 'Database Design', icon: FaDatabase, content: project.details?.databaseDesign },
    { key: 'performanceOptimizations', title: 'Performance Optimizations', icon: FaBolt, content: project.details?.performanceOptimizations },
    { key: 'securityFeatures', title: 'Security Features', icon: FaShieldAlt, content: project.details?.securityFeatures },
  ].filter((item) => item.content);

  return (
    <>
      <Helmet>
        <title>{project.title} — Case Study — Basant.dev</title>
        <meta name="description" content={project.shortDescription} />
      </Helmet>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 md:px-8">
        {/* Back Link */}
        <Link
          to="/projects"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel)] px-3.5 py-1.5 text-xs font-semibold text-tertiary transition hover:bg-tertiary hover:text-white"
        >
          <FaArrowLeft size={11} /> Back to All Projects
        </Link>

        {/* Hero Header Banner Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="shell mb-8 sm:mb-12"
        >
          <div className="glass overflow-hidden p-4 sm:p-6 md:p-8">
            {/* Banner Image */}
            {heroImage && (
              <div className="relative mb-6 aspect-[16/10] w-full overflow-hidden rounded-xl border border-[var(--border)] shadow-md sm:mb-8 sm:aspect-[16/8] sm:rounded-2xl">
                <img
                  src={heroImage}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-1.5 sm:bottom-4 sm:left-4 sm:gap-2">
                  <span className="rounded-full bg-tertiary px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm sm:px-3 sm:py-1 sm:text-xs">
                    {project.category}
                  </span>
                  <span className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-semibold text-white sm:px-3 sm:py-1 sm:text-xs">
                    {statusLabels[project.status]}
                  </span>
                </div>
              </div>
            )}

            {/* Title & Short Description */}
            <h1 className="mb-3 font-display text-2xl font-extrabold leading-tight text-text-primary sm:mb-4 sm:text-3xl md:text-4xl">
              {project.title}
            </h1>
            <p className="mb-6 max-w-3xl text-sm leading-relaxed text-text-secondary sm:text-base">
              {project.shortDescription}
            </p>

            {/* Technologies Tags */}
            <div className="mb-6 flex flex-wrap gap-1.5 sm:mb-8 sm:gap-2">
              {(project.technologies || []).map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-[var(--border)] bg-[rgba(249,238,217,0.5)] px-2.5 py-0.5 text-[11px] font-semibold text-text-primary sm:px-3 sm:py-1 sm:text-xs"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Action Links */}
            <div className="flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-5 sm:gap-3 sm:pt-6">
              {project.links?.liveDemo && (
                <a
                  href={project.links.liveDemo}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary inline-flex items-center gap-2 text-xs sm:text-sm"
                >
                  Live Demo <FaExternalLinkAlt size={11} />
                </a>
              )}
              {project.links?.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary inline-flex items-center gap-2 text-xs sm:text-sm"
                >
                  <FaGithub size={14} /> Source Code
                </a>
              )}
              {project.links?.figma && (
                <a
                  href={project.links.figma}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary inline-flex items-center gap-2 text-xs sm:text-sm"
                >
                  <FaFigma size={14} /> Figma Design
                </a>
              )}
              {project.links?.apiDocs && (
                <a
                  href={project.links.apiDocs}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary inline-flex items-center gap-2 text-xs sm:text-sm"
                >
                  <FaBook size={14} /> API Docs
                </a>
              )}
              {project.links?.videoDemo && (
                <a
                  href={project.links.videoDemo}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary inline-flex items-center gap-2 text-xs sm:text-sm"
                >
                  <FaPlayCircle size={14} /> Video Demo
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Screenshots Gallery - Right Below Hero Banner */}
        {project.screenshots?.length > 0 && (
          <motion.section {...fadeUp} className="mb-8 sm:mb-12">
            <SectionHeader icon={FaPlayCircle} label="Visual Tour" title="Screenshots & Showcase" />
            <ScreenshotGallery screenshots={project.screenshots} />
          </motion.section>
        )}

        {/* Project Quick Meta Cards */}
        {(project.clientName || project.myRole || project.teamSize || project.completionDate) && (
          <motion.div {...fadeUp} className="shell mb-8 sm:mb-12">
            <div className="glass grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:gap-4 sm:p-6 md:grid-cols-4">
              {project.clientName && (
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-tertiary/15 text-tertiary">
                    <FaUserTie size={16} />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Client</div>
                    <div className="text-sm font-semibold text-text-primary">{project.clientName}</div>
                  </div>
                </div>
              )}
              {project.myRole && (
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-tertiary/15 text-tertiary">
                    <FaCogs size={16} />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">My Role</div>
                    <div className="text-sm font-semibold text-text-primary">{project.myRole}</div>
                  </div>
                </div>
              )}
              {project.teamSize && (
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-tertiary/15 text-tertiary">
                    <FaUserFriends size={16} />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Team Size</div>
                    <div className="text-sm font-semibold text-text-primary">{project.teamSize} Member{project.teamSize > 1 ? 's' : ''}</div>
                  </div>
                </div>
              )}
              {project.completionDate && (
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-tertiary/15 text-tertiary">
                    <FaCalendarAlt size={16} />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Completed</div>
                    <div className="text-sm font-semibold text-text-primary">
                      {new Date(project.completionDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Overview Section */}
        {(project.overview || project.fullDescription) && (
          <motion.section {...fadeUp} className="mb-8 sm:mb-12">
            <SectionHeader icon={FaLightbulb} label="Introduction" title="Project Overview" />
            <div className="shell">
              <div className="glass p-5 sm:p-6 md:p-8">
                <RichBlock html={project.overview || project.fullDescription} />
              </div>
            </div>
          </motion.section>
        )}

        {/* Challenge & Solution Side-by-Side Cards */}
        {(project.problemStatement || project.solution) && (
          <motion.section {...fadeUp} className="mb-8 sm:mb-12">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {project.problemStatement && (
                <div className="shell">
                  <div className="glass h-full p-5 sm:p-6 md:p-8">
                    <div className="mb-4 flex items-center gap-2.5 text-amber-600 dark:text-amber-400">
                      <FaExclamationTriangle size={18} />
                      <h3 className="font-display text-base font-bold text-text-primary sm:text-lg">The Challenge</h3>
                    </div>
                    <RichBlock html={project.problemStatement} />
                  </div>
                </div>
              )}
              {project.solution && (
                <div className="shell">
                  <div className="glass h-full p-5 sm:p-6 md:p-8">
                    <div className="mb-4 flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
                      <FaCheckCircle size={18} />
                      <h3 className="font-display text-base font-bold text-text-primary sm:text-lg">The Solution</h3>
                    </div>
                    <RichBlock html={project.solution} />
                  </div>
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* Key Features */}
        {project.features?.length > 0 && (
          <motion.section {...fadeUp} className="mb-8 sm:mb-12">
            <SectionHeader icon={FaRocket} label="Capabilities" title="Key Features" />
            <FeatureCards features={project.features} />
          </motion.section>
        )}

        {/* Tech Stack */}
        {project.techStack?.length > 0 && (
          <motion.section {...fadeUp} className="mb-8 sm:mb-12">
            <SectionHeader icon={FaCogs} label="Under the Hood" title="Tech Stack Architecture" />
            <div className="shell">
              <div className="glass p-5 sm:p-6 md:p-8">
                <TechStackBadges techStack={project.techStack} />
              </div>
            </div>
          </motion.section>
        )}

        {/* Technical Deep Dive Section Cards */}
        {deepDiveItems.length > 0 && (
          <motion.section {...fadeUp} className="mb-8 sm:mb-12">
            <SectionHeader icon={FaCogs} label="Architecture & Implementation" title="Technical Deep Dive" />
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {deepDiveItems.map(({ key, title, icon: Icon, content }) => (
                <div key={key} className="shell">
                  <div className="glass h-full p-5 sm:p-6">
                    <div className="mb-3 flex items-center gap-2.5 text-tertiary font-semibold text-sm sm:text-base font-display">
                      <Icon size={16} />
                      {title}
                    </div>
                    <RichBlock html={content} />
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Lessons Learned & Impact */}
        {(project.details?.lessonsLearned || project.details?.resultsAndImpact) && (
          <motion.section {...fadeUp} className="mb-8 sm:mb-12">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {project.details?.lessonsLearned && (
                <div className="shell">
                  <div className="glass h-full p-5 sm:p-6">
                    <h3 className="mb-3 font-display text-sm sm:text-base font-bold text-text-primary flex items-center gap-2">
                      <FaLightbulb className="text-amber-500" /> Lessons Learned
                    </h3>
                    <RichBlock html={project.details.lessonsLearned} />
                  </div>
                </div>
              )}
              {project.details?.resultsAndImpact && (
                <div className="shell">
                  <div className="glass h-full p-5 sm:p-6">
                    <h3 className="mb-3 font-display text-sm sm:text-base font-bold text-text-primary flex items-center gap-2">
                      <FaCheckCircle className="text-emerald-500" /> Results & Impact
                    </h3>
                    <RichBlock html={project.details.resultsAndImpact} />
                  </div>
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* Related Projects */}
        {related?.length > 0 && (
          <motion.section {...fadeUp} className="mb-10 sm:mb-14">
            <SectionHeader label="Explore More" title="Related Projects" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link key={r._id} to={`/projects/${r.slug}`} className="shell group">
                  <div className="glass overflow-hidden transition-transform duration-300 group-hover:-translate-y-1">
                    <img src={r.thumbnail?.url || r.heroBanner?.url} alt={r.title} className="h-36 w-full object-cover" />
                    <div className="p-4">
                      <div className="text-sm font-semibold text-text-primary group-hover:text-tertiary transition">
                        {r.title}
                      </div>
                      <div className="mt-1 text-xs text-text-secondary line-clamp-2">
                        {r.shortDescription}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {/* Prev / Next navigation */}
        <div className="mb-12 flex flex-col gap-4 border-t border-[var(--border)] pt-6 sm:mb-16 sm:flex-row sm:items-center sm:justify-between sm:pt-8">
          {prev ? (
            <Link to={`/projects/${prev.slug}`} className="group inline-flex items-center gap-2 text-xs font-semibold text-text-primary hover:text-tertiary sm:text-sm">
              <FaArrowLeft size={11} className="transition group-hover:-translate-x-1" /> {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link to={`/projects/${next.slug}`} className="group inline-flex items-center gap-2 text-xs font-semibold text-text-primary hover:text-tertiary sm:text-sm sm:self-end">
              {next.title} <FaArrowRight size={11} className="transition group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </div>

    </>
  );
}
