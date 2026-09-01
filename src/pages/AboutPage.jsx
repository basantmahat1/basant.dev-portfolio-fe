import { useEffect, useState } from 'react';
import { FaWhatsapp, FaDownload, FaMapMarkerAlt, FaCalendarAlt, FaStar } from 'react-icons/fa';
import { fetchAbout } from '../services/aboutService';

const defaultAbout = {
  title: 'About Me 👋',
  avatar: '',
  description:
    "I'm Basant, a full-stack developer focused on building elegant digital products, AI-powered workflows, and scalable SaaS experiences. I enjoy turning complex ideas into simple interfaces and reliable systems that help people work smarter.",
  location: 'Nepal',
  badges: ['Full-Stack', 'AI Products', 'SaaS', 'Problem Solver'],
  stats: [],
  journey: [],
  testimonial: null,
};

export default function AboutPage() {
  const [about, setAbout] = useState(defaultAbout);
  const [whatsappUrl, setWhatsappUrl] = useState('https://wa.me/');
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    const loadAbout = async () => {
      try {
        const data = await fetchAbout();
        if (data) {
          setAbout({
            ...defaultAbout,
            ...data,
            avatar: data.avatar || data.heroImage || '',
            badges: data.badges?.length ? data.badges : defaultAbout.badges,
          });

          setResumeUrl(data.resumeUrl || '');

          const wa = data.social?.whatsapp || data.contact?.phone || '';
          if (wa) {
            if (wa.startsWith('http://') || wa.startsWith('https://')) {
              setWhatsappUrl(wa);
            } else {
              const digits = wa.replace(/[^0-9]/g, '');
              if (digits) {
                setWhatsappUrl(`https://wa.me/${digits}`);
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to load about page data', error);
      }
    };

    loadAbout();
    window.addEventListener('about-section-updated', loadAbout);
    return () => window.removeEventListener('about-section-updated', loadAbout);
  }, []);

  return (
    <section className="mx-auto max-w-5xl px-8 py-16">
      <div className="mb-8 text-center">
        <div className="section-label">About</div>
        <h1 className="section-title mb-3 text-4xl">{about.title}</h1>
        {about.location && (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[rgba(214,112,73,0.08)] px-3 py-1 text-xs font-semibold text-tertiary">
            <FaMapMarkerAlt size={12} /> {about.location}
          </div>
        )}
      </div>

      <div className="shell mb-12">
        <div className="glass grid gap-8 p-8 md:grid-cols-[220px_1fr] items-center">
          {about.avatar ? (
            <img
              src={about.avatar}
              alt="Basant"
              className="mx-auto h-52 w-52 rounded-full object-cover border-4 border-[var(--border)] shadow-lg md:mx-0"
            />
          ) : (
            <div className="mx-auto grid h-52 w-52 place-items-center rounded-full bg-tertiary/10 border-4 border-[var(--border)] font-display text-4xl font-bold text-tertiary md:mx-0">
              B
            </div>
          )}

          <div>
            <p className="mb-6 text-sm leading-relaxed text-text-secondary whitespace-pre-line">
              {about.description}
            </p>

            <div className="mb-8 flex flex-wrap gap-2">
              {about.badges.map((badge) => (
                <span key={badge} className="tag px-3 py-1 text-xs font-semibold">
                  {badge}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2"
              >
                Let&apos;s Talk <FaWhatsapp size={15} />
              </a>

              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-flex items-center gap-2 text-xs"
                >
                  Download Resume <FaDownload size={12} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {about.stats?.length > 0 && (
        <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {about.stats.map((stat, i) => (
            <div key={i} className="shell">
              <div className="glass p-5 text-center">
                <div className="font-display text-2xl font-bold text-tertiary">{stat.value}</div>
                <div className="mt-1 text-xs text-text-secondary">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Journey Timeline */}
      {about.journey?.length > 0 && (
        <div className="shell mb-12">
          <div className="glass p-8">
            <h3 className="mb-6 font-display text-xl font-bold flex items-center gap-2">
              <FaCalendarAlt className="text-tertiary" /> My Journey
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {about.journey.map((step, i) => (
                <div key={i} className="rounded-xl border border-[var(--border)] bg-[rgba(249,238,217,0.4)] dark:bg-white/5 p-4">
                  <div className="font-display text-sm font-bold text-tertiary">{step.year}</div>
                  <div className="mt-1 text-xs text-text-secondary">{step.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Testimonial */}
      {about.testimonial?.quote && (
        <div className="shell">
          <div className="glass p-8 text-center max-w-2xl mx-auto">
            <div className="mb-3 flex justify-center text-amber-500 gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} size={14} />
              ))}
            </div>
            <p className="mb-4 italic text-sm text-text-primary">
              &quot;{about.testimonial.quote}&quot;
            </p>
            <div className="font-bold text-xs text-tertiary">{about.testimonial.author}</div>
            {about.testimonial.role && (
              <div className="text-[11px] text-text-secondary">{about.testimonial.role}</div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
