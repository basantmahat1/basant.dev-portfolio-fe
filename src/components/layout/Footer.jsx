import { useEffect, useState } from 'react';
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  const [avatar, setAvatar] = useState('');
  const [social, setSocial] = useState({});
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    const load = () => {
      try {
        const cached = localStorage.getItem('portfolio_about_data');
        if (cached) {
          const data = JSON.parse(cached);
          setAvatar(data.avatar || data.heroImage || '');
          setSocial(data.social || {});
          setResumeUrl(data.resumeUrl || '');
        }
      } catch (e) {}
    };

    load();
    window.addEventListener('about-section-updated', load);
    return () => window.removeEventListener('about-section-updated', load);
  }, []);

  return (
    <footer className="border-t border-[var(--border)] bg-transparent px-8 pb-6 pt-10 text-text-primary">
      <div className="mx-auto mb-8 grid max-w-5xl grid-cols-1 gap-6 text-xs md:grid-cols-5">
        <div>
          <div className="mb-2 flex items-center gap-2 font-display text-base font-bold text-text-primary">
            {avatar ? (
              <img
                src={avatar}
                alt="Basant"
                className="h-8 w-8 rounded-full border-2 border-tertiary object-cover shadow-sm"
              />
            ) : (
              <span className="h-2 w-2 rounded-full bg-tertiary" />
            )}
            Basant.dev
          </div>
          <p className="leading-relaxed text-text-secondary">
            Full-Stack Developer building modern, scalable web applications and digital experiences.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { key: 'github',    Icon: FaGithub,    color: '#333' },
              { key: 'linkedin',  Icon: FaLinkedin,  color: '#0A66C2' },
              { key: 'instagram', Icon: FaInstagram, color: '#E4405F' },
              { key: 'email',     Icon: FaEnvelope,  color: 'var(--tertiary)' },
            ].map(({ key, Icon, color }) => {
              const url = social[key];
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
                  className="group grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] bg-[rgba(249,238,217,0.5)] dark:bg-white/10 text-text-primary transition-all duration-300 hover:bg-tertiary hover:scale-110 hover:shadow-md"
                >
                  <Icon size={16} style={{ color }} className="transition-all duration-300 group-hover:!text-white" />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="mb-3 font-display text-sm font-bold text-text-primary">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <a href="/" className="inline-block text-text-secondary transition-all duration-300 hover:text-tertiary hover:translate-x-1">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="inline-block text-text-secondary transition-all duration-300 hover:text-tertiary hover:translate-x-1">
                About
              </a>
            </li>
            <li>
              <a href="/projects" className="inline-block text-text-secondary transition-all duration-300 hover:text-tertiary hover:translate-x-1">
                Projects
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-display text-sm font-bold text-text-primary">Services</h4>
          <ul className="space-y-2">
            <li>
              <a href="/projects" className="inline-block text-text-secondary transition-all duration-300 hover:text-tertiary hover:translate-x-1">
                Full-Stack Web Dev
              </a>
            </li>
            <li>
              <a href="/skills" className="inline-block text-text-secondary transition-all duration-300 hover:text-tertiary hover:translate-x-1">
                API &amp; Cloud Integration
              </a>
            </li>
          </ul>
        </div>


        <div>
          <h4 className="mb-3 font-display text-sm font-bold text-text-primary">Resources</h4>
          <ul className="space-y-2">
            <li>
              <a
                href={social.github || '#'}
                target={social.github ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="inline-block text-text-secondary transition-all duration-300 hover:text-tertiary hover:translate-x-1"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href={resumeUrl || '/resume.pdf'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-text-secondary transition-all duration-300 hover:text-tertiary hover:translate-x-1"
              >
                Resume
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-display text-sm font-bold text-text-primary">Newsletter</h4>
          <p className="mb-2 text-text-secondary">Get updates about my latest projects.</p>
          <div className="flex items-center gap-1.5">
            <input
              type="email"
              placeholder="Email"
              className="w-[160px] min-w-0 rounded-md border border-[var(--border)] bg-[color:var(--input-bg)] px-2 py-1.5 text-[11px] leading-none text-text-primary placeholder:text-text-secondary outline-none focus:border-tertiary"
            />
            <button className="btn-primary px-3 py-1.5 text-[10px] leading-none">Join</button>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-5xl justify-center text-center border-t border-[var(--border)] pt-4 text-[11px] text-text-secondary font-medium">
        <span>© {new Date().getFullYear()} Basant.dev. All rights reserved.</span>
      </div>
    </footer>
  );
}

