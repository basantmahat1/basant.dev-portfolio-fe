import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import ProjectGrid from '../components/projects/ProjectGrid';
import { fetchProjects } from '../services/projectService';

const CATEGORIES = ['All', 'Web App', 'AI / ML', 'Mobile', 'SaaS', 'Design'];

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    fetchProjects({
      page,
      limit: 8,
      search: search || undefined,
      category: category === 'All' ? undefined : category,
    })
      .then((res) => {
        if (!active) return;
        setProjects(res.data);
        setMeta(res.meta);
      })
      .finally(() => active && setIsLoading(false));

    return () => {
      active = false;
    };
  }, [page, search, category]);

  const searchDebounced = useMemo(() => {
    let timeout;
    return (value) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setPage(1);
        setSearch(value);
      }, 350);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Projects — Basant.dev</title>
        <meta
          name="description"
          content="Browse case studies of full-stack and AI-powered products built by Basant."
        />
      </Helmet>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center sm:mb-10"
        >
          <div className="section-label justify-center">Case Studies</div>
          <h1 className="section-title justify-center text-2xl sm:text-3xl md:text-4xl">All Projects</h1>
          <p className="mx-auto max-w-lg text-xs leading-relaxed text-text-secondary sm:text-sm">
            A collection of products I&apos;ve designed, built, and shipped — from full-stack SaaS platforms to modern web applications.
          </p>
        </motion.div>


        <div className="mb-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap justify-center gap-1.5 sm:justify-start sm:gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setCategory(cat);
                  setPage(1);
                }}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition sm:px-3.5 sm:py-1.5 ${
                  category === cat
                    ? 'border-tertiary bg-tertiary text-white shadow-sm'
                    : 'border-[var(--border)] bg-[rgba(249,238,217,0.6)] text-text-primary hover:border-tertiary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search projects..."
              onChange={(e) => searchDebounced(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[color:var(--input-bg)] px-3.5 py-2 text-sm text-[color:var(--text-primary)] placeholder:text-[color:var(--text-secondary)] outline-none focus:border-tertiary sm:w-64"
            />
          </div>
        </div>

        <ProjectGrid projects={projects} isLoading={isLoading} />

        {meta.totalPages > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            {Array.from({ length: meta.totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i + 1)}
                className={`h-9 w-9 rounded-full text-sm font-semibold transition ${
                  page === i + 1
                    ? 'bg-tertiary text-white shadow-sm'
                    : 'bg-[rgba(249,238,217,0.6)] text-text-primary hover:bg-tertiary/20'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </section>

    </>
  );
}
