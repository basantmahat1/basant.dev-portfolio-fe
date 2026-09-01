import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaArrowRight,
  FaDownload,
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaUsers,
  FaFolder,
  FaCalendarCheck,
  FaStar,
  FaPhone,
  FaPaperPlane,
  FaReact,
  FaNodeJs,
  FaJs,
  FaRocket,
} from 'react-icons/fa';
import { fetchAbout } from '../services/aboutService';
import { fetchProjects } from '../services/projectService';
import ProjectCard from '../components/projects/ProjectCard';

const defaultAbout = {
  title: 'About Me 👋',
  avatar: '',
  heroImage: '',
  resumeUrl: '',
  resumeName: '',
  description:
    "I'm Basant, a passionate Full-Stack Developer and AI enthusiast. I love building products that solve real problems using modern technologies. Currently focused on building AI-powered SaaS applications.",
  location: 'Based in Nepal',
  badges: ['3+ Years Experience', '10+ Projects Done', 'Problem Solver', 'Clean Code'],
  stats: [
    { icon: 'users', value: '20+', label: 'Happy Clients' },
    { icon: 'folder', value: '50+', label: 'Projects Done' },
    { icon: 'calendar', value: '3+', label: 'Years Exp.' },
    { icon: 'star', value: '100%', label: 'Satisfaction' },
  ],
  journey: [
    { year: '2022', label: 'Started Coding' },
    { year: '2023', label: 'First Freelance' },
    { year: '2024', label: 'Built AI Apps' },
    { year: '2025', label: 'Scaling SaaS' },
  ],
  testimonial: {
    quote:
      'Basant is an excellent developer. He understands requirements quickly and delivers high-quality solutions on time.',
    author: 'Suvash Thapa',
    role: 'Founder, Tech Solutions',
    avatar: '',
  },
  contact: {
    email: 'hello@basant.dev',
    phone: '+977 984XXXXXXX',
    city: 'Kathmandu, Nepal',
  },
  social: {
    github: '',
    linkedin: '',
    instagram: '',
    facebook: '',
    x: '',
    email: '',
  },
};

const iconMap = {
  users: FaUsers,
  folder: FaFolder,
  calendar: FaCalendarCheck,
  star: FaStar,
};

const floatingTech = [
  { icon: FaReact, label: 'React', className: '-left-4 top-6' },
  { icon: FaNodeJs, label: 'Node', className: '-right-4 top-2' },
  { icon: FaJs, label: 'JS', className: '-left-4 bottom-8' },
  { icon: FaRocket, label: 'Build', className: '-right-4 bottom-6' },
];

export default function Home() {
  const [about, setAbout] = useState(defaultAbout);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    const loadAbout = async () => {
      try {
        const data = await fetchAbout();
        setAbout({
          ...defaultAbout,
          ...data,
          avatar: data.avatar || '',
          heroImage: data.heroImage || '',
          resumeUrl: data.resumeUrl || '',
          resumeName: data.resumeName || '',
          contact: { ...defaultAbout.contact, ...(data.contact || {}) },
          testimonial: { ...defaultAbout.testimonial, ...(data.testimonial || {}) },
          social: { ...defaultAbout.social, ...(data.social || {}) },
        });
      } catch (error) {
        console.error('Failed to load saved about section', error);
      }
    };

    loadAbout();
    window.addEventListener('about-section-updated', loadAbout);
    return () => window.removeEventListener('about-section-updated', loadAbout);
  }, []);

  useEffect(() => {
    let active = true;
    setLoadingProjects(true);

    fetchProjects({ featured: 'true', limit: 4 })
      .then((res) => {
        if (!active) return;
        if (res?.data && res.data.length > 0) {
          setFeaturedProjects(res.data);
        } else {
          // Fallback to latest published projects if none specifically marked featured
          return fetchProjects({ limit: 4 }).then((fallbackRes) => {
            if (active && fallbackRes?.data) {
              setFeaturedProjects(fallbackRes.data);
            }
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load featured projects', err);
      })
      .finally(() => {
        if (active) setLoadingProjects(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const heroPhotoSrc = about.heroImage || about.avatar;
  const avatarPhotoSrc = about.avatar || about.heroImage;

  return (
    <>
      <Helmet>
        <title>Basant.dev — AI Software Engineer</title>
      </Helmet>

      <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-6xl grid-cols-1 items-center gap-8 px-4 py-8 sm:px-8 sm:py-14 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-tertiary sm:mb-3">
            AI Software Engineer
          </div>
          <h1 className="mb-4 font-display text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            I build <em className="italic text-tertiary">AI-powered</em> products that solve
            real-world problems.
          </h1>
          <p className="mb-6 max-w-md text-sm leading-relaxed text-text-secondary sm:mb-8 sm:text-base">
            Full-stack developer specializing in modern tech stack &amp; AI integration. I craft
            clean code and intuitive digital experiences.
          </p>

          <div className="mb-6 flex flex-wrap gap-3 sm:mb-7 sm:gap-4">
            <Link to="/projects" className="btn-primary text-xs sm:text-sm">
              View My Work <FaArrowRight size={11} />
            </Link>
            <a
              href={about.resumeUrl || '/resume.pdf'}
              download={about.resumeName || 'Basant_Resume.pdf'}
              className="btn-secondary text-xs sm:text-sm"
            >
              Download Resume <FaDownload size={11} />
            </a>
          </div>

          <div className="flex gap-2.5 sm:gap-3">
            {[
              { icon: FaGithub,    key: 'github',    color: '#333' },
              { icon: FaLinkedin,  key: 'linkedin',  color: '#0A66C2' },
              { icon: FaInstagram, key: 'instagram', color: '#E4405F' },
              { icon: FaEnvelope,  key: 'email',     color: 'var(--tertiary)' },
            ].map(({ icon: Icon, key, color }) => {
              const url = about.social?.[key];
              let href = '#';
              if (url) {
                if (key === 'email') {
                  href = `mailto:${url}`;
                } else {
                  href = url.startsWith('http') ? url : `https://${url}`;
                }
              }
              return (
                <a
                  key={key}
                  href={href}
                  target={url && key !== 'email' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="group grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] bg-[rgba(249,238,217,0.5)] transition hover:bg-tertiary hover:text-white"
                >
                  <Icon size={16} style={{ color }} className="transition group-hover:!text-white" />
                </a>
              );
            })}
          </div>

        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="relative flex items-center justify-center py-2 px-2 sm:px-4"
        >
          {heroPhotoSrc && (
            <div className="shell relative z-10 w-full max-w-[260px] sm:max-w-[320px] md:max-w-[360px] aspect-[4/4.8] !rounded-[32px] sm:!rounded-[36px] p-[2px] shadow-2xl">
              <div className="glass h-full w-full overflow-hidden !rounded-[30px] sm:!rounded-[34px] border-2 border-[var(--tertiary)] flex items-end justify-center">
                <img
                  src={heroPhotoSrc}
                  alt="Basant"
                  className="h-full w-full object-cover object-top"
                />
              </div>
            </div>
          )}
        </motion.div>
      </section>

      <section className="section-block" id="about">
        <div className="shell animate-scroll">
          <div className="glass p-4 sm:p-5 md:p-6">
            <div className="about-grid">
              <div className="avatar-card">
                {avatarPhotoSrc && (
                  <img
                    src={avatarPhotoSrc}
                    alt="Avatar"
                    className="rounded-full object-cover"
                  />
                )}
                <span className="location-badge">
                  <FaMapMarkerAlt /> {about.location}
                </span>
              </div>

              <div>
                <h3 className="about-heading">{about.title}</h3>
                <p className="about-copy">{about.description}</p>
                <div className="about-bullets">
                  {about.badges.map((badge) => (
                    <div key={badge}>
                      <FaCheckCircle /> {badge}
                    </div>
                  ))}
                </div>
                <a href="#contact" className="btn-primary inline-flex text-xs">
                  More About Me <FaArrowRight size={10} />
                </a>
              </div>

              <div className="stats-grid">
                {about.stats.map((stat) => {
                  const Icon = iconMap[stat.icon] || FaStar;
                  return (
                    <div className="stat-box" key={`${stat.label}-${stat.value}`}>
                      <div className="stat-icon">
                        <Icon />
                      </div>
                      <div>
                        <div className="stat-num">{stat.value}</div>
                        <div className="stat-lbl">{stat.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block" id="experience">
        <div className="two-cols">
          <div className="shell animate-scroll">
            <div className="glass box-card">
              <div className="journey-title">My Journey So Far</div>
              <div className="timeline">
                {about.journey.map((item) => (
                  <div className="timeline-item" key={`${item.year}-${item.label}`}>
                    <div className="timeline-dot" />
                    <div className="timeline-year">{item.year}</div>
                    <div className="timeline-txt">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="shell animate-scroll">
            <div className="glass box-card">
              <div className="journey-title">What People Say</div>
              <p className="testimonial-quote">"{about.testimonial.quote}"</p>
              <div className="stars">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <FaStar key={idx} />
                ))}
              </div>
              <div className="testimonial-person">
                <img src={about.testimonial.avatar} alt={about.testimonial.author} />
                <div>
                  <div className="testimonial-name">{about.testimonial.author}</div>
                  <div className="testimonial-role">{about.testimonial.role}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block" id="contact">
        <div className="shell animate-scroll">
          <div className="glass banner-flex">
            <div>
              <h3 className="contact-title">
                Let&apos;s build something <em>amazing</em> together
              </h3>
              <p className="contact-subtitle">
                I&apos;m currently available for freelance work or full-time opportunities.
              </p>
            </div>
            <div className="contact-pills">
              <div className="pill-item">
                <FaEnvelope /> {about.contact.email}
              </div>
              <div className="pill-item">
                <FaPhone /> {about.contact.phone}
              </div>
              <div className="pill-item">
                <FaMapMarkerAlt /> {about.contact.city}
              </div>
              <a href="mailto:hello@basant.dev" className="btn-primary text-xs">
                Get In Touch <FaPaperPlane size={10} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-8 sm:pb-20" id="featured-projects">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="section-label">Selected Works</div>
            <h2 className="section-title !mb-0 text-2xl sm:text-3xl">Featured Projects</h2>
          </div>
          <Link
            to="/projects"
            className="btn-secondary inline-flex items-center gap-2 self-start text-xs sm:self-auto"
          >
            Explore All Projects <FaArrowRight size={10} />
          </Link>
        </div>

        {loadingProjects ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="shell h-64 animate-pulse">
                <div className="glass h-full w-full rounded-2xl bg-white/10" />
              </div>
            ))}
          </div>
        ) : featuredProjects.length === 0 ? (
          <div className="shell">
            <div className="glass rounded-2xl p-8 text-center text-sm text-text-secondary sm:p-10">
              No projects found yet. Visit the{' '}
              <Link to="/projects" className="font-semibold text-tertiary">
                Projects page
              </Link>{' '}
              to explore more.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProjects.map((project, i) => (
              <ProjectCard key={project._id} project={project} index={i} />
            ))}
          </div>
        )}
      </section>

    </>
  );
}
