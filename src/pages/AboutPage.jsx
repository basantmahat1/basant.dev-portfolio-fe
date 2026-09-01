import { useEffect, useState } from 'react';
import { FaWhatsapp, FaDownload, FaMapMarkerAlt, FaCalendarAlt, FaStar } from 'react-icons/fa';
import { fetchAbout } from '../services/aboutService';

const defaultAbout = {
  title: 'About Me 👋',
  avatar: '',
  description:
    "I'm Basant Mahat, a Full-Stack & SaaS developer focused on building elegant digital products, high-performance web platforms, and scalable SaaS applications. I enjoy turning complex ideas into simple interfaces and reliable systems.",
  location: 'Nepal',
  badges: ['Full-Stack', 'SaaS Platforms', 'Web Apps', 'Clean Code', 'Problem Solver'],
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
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16">
      <div className="mb-8 text-center">
        <div className="section-label">About</div>
        <h1 className="section-title mb-3 text-3xl sm:text-4xl">{about.title}</h1>
        {about.location && (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[rgba(214,112,73,0.08)] px-3 py-1 text-xs font-semibold text-tertiary">
            <FaMapMarkerAlt size={12} /> {about.location}
          </div>
        )}
      </div>

      <div className="shell mb-8 sm:mb-12">
        <div className="glass grid gap-6 p-5 sm:p-8 md:grid-cols-[200px_1fr] items-center">
          {about.avatar ? (
            <img
              src={about.avatar}
              alt="Basant"
              className="mx-auto h-40 w-40 rounded-full object-cover border-4 border-[var(--border)] shadow-lg sm:h-48 sm:w-48 md:mx-0"
            />
          ) : (
            <div className="mx-auto grid h-40 w-40 place-items-center rounded-full bg-tertiary/10 border-4 border-[var(--border)] font-display text-4xl font-bold text-tertiary sm:h-48 sm:w-48 md:mx-0">
              B
            </div>
          )}

          <div>
            <p className="mb-6 text-sm leading-relaxed text-text-secondary whitespace-pre-line">
              {about.description}
            </p>

            <div className="mb-6 flex flex-wrap gap-1.5 sm:mb-8 sm:gap-2">
              {about.badges.map((badge) => (
                <span key={badge} className="tag px-2.5 py-0.5 text-xs font-semibold sm:px-3 sm:py-1">
                  {badge}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2 text-xs sm:text-sm"
              >
                Let&apos;s Talk <FaWhatsapp size={14} />
              </a>

              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-flex items-center gap-2 text-xs sm:text-sm"
                >
                  Download Resume <FaDownload size={11} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {about.stats?.length > 0 && (
        <div className="mb-8 grid grid-cols-2 gap-3 sm:mb-12 sm:grid-cols-4 sm:gap-4">
          {about.stats.map((stat, i) => (
            <div key={i} className="shell">
              <div className="glass p-4 text-center sm:p-5">
                <div className="font-display text-xl font-bold text-tertiary sm:text-2xl">{stat.value}</div>
                <div className="mt-1 text-[11px] text-text-secondary sm:text-xs">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Journey Timeline */}
      {about.journey?.length > 0 && (
        <div className="shell mb-8 sm:mb-12">
          <div className="glass p-5 sm:p-8">
            <h3 className="mb-6 font-display text-lg font-bold flex items-center gap-2 sm:text-xl">
              <FaCalendarAlt className="text-tertiary" /> My Journey
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-4">
              {about.journey.map((step, i) => (
                <div key={i} className="rounded-xl border border-[var(--border)] bg-[rgba(249,238,217,0.4)] dark:bg-white/5 p-3.5 sm:p-4">
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
          <div className="glass p-6 text-center max-w-2xl mx-auto sm:p-8">
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
