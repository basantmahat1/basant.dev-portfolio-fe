import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaPaperPlane, FaMoon, FaSun, FaWhatsapp } from 'react-icons/fa';
import { fetchAbout } from '../../services/aboutService';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/skills', label: 'Skills' },
  { to: '/projects', label: 'Projects' },
  { to: '/experience', label: 'Experience' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [avatar, setAvatar] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('https://wa.me/');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('portfolio-theme');
    return saved ? saved === 'dark' : false;
  });

  useEffect(() => {
    const loadAvatar = async () => {
      try {
        const data = await fetchAbout();
        if (data.avatar || data.heroImage) {
          setAvatar(data.avatar || data.heroImage);
        }
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
      } catch (err) {
        console.error('Failed to load avatar in navbar', err);
      }
    };

    loadAvatar();
    window.addEventListener('about-section-updated', loadAvatar);
    return () => window.removeEventListener('about-section-updated', loadAvatar);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('portfolio-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <nav className="sticky top-0 z-[100] flex items-center justify-between border-b border-[var(--border)] bg-[color:var(--panel)] px-8 py-5 backdrop-blur-md shadow-[0_4px_12px_rgba(214,112,73,0.04)] dark-mode:shadow-none">
      <Link to="/" className="flex items-center gap-2.5 font-display text-xl font-semibold text-[color:var(--text-primary)] transition hover:opacity-90">
        {avatar ? (
          <img
            src={avatar}
            alt="Basant"
            className="h-8 w-8 rounded-full border-2 border-tertiary object-cover shadow-sm"
          />
        ) : (
          <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-tertiary shadow-glow" />
        )}
        Basant.dev
      </Link>

      <div className="hidden gap-6 text-sm font-semibold md:flex">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `relative rounded-full px-3 py-1.5 transition-all duration-200 ${
                isActive
                  ? darkMode
                    ? 'bg-[rgba(242,154,114,0.22)] text-[color:var(--tertiary)] shadow-[0_0_0_1px_rgba(242,154,114,0.28)]'
                    : 'bg-[rgba(214,112,73,0.12)] text-tertiary shadow-[0_0_0_1px_rgba(214,112,73,0.15)]'
                  : darkMode
                    ? 'text-[color:var(--text-primary)] opacity-80 hover:bg-[#1d242d] hover:text-[color:var(--accent)] hover:opacity-100'
                    : 'text-[color:var(--text-primary)] opacity-80 hover:bg-[rgba(242,154,114,0.18)] hover:text-[color:var(--tertiary)] hover:opacity-100'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 text-[11px] font-semibold md:hidden">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-full border px-2.5 py-1.5 transition ${
                isActive
                  ? 'border-tertiary bg-tertiary text-white'
                  : 'border-[var(--border)] bg-[color:var(--panel)] text-[color:var(--text-primary)]'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Toggle dark mode"
          onClick={() => setDarkMode((prev) => !prev)}
          className={`grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] bg-[color:var(--panel)] text-[color:var(--text-primary)] transition-all duration-200 hover:-translate-y-0.5 ${
            darkMode
              ? 'hover:bg-[#1d242d] hover:text-[color:var(--accent)] hover:shadow-[0_8px_18px_rgba(15,18,22,0.35)]'
              : 'hover:bg-[color:var(--tertiary)] hover:text-white hover:shadow-[0_8px_18px_rgba(242,154,114,0.35)]'
          }`}
        >
          {darkMode ? <FaSun size={14} /> : <FaMoon size={14} />}
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn-primary ${
            darkMode
              ? 'shadow-[0_10px_20px_rgba(15,18,22,0.35)] hover:bg-[#1d242d] hover:shadow-[0_10px_20px_rgba(15,18,22,0.45)]'
              : 'shadow-[0_10px_20px_rgba(242,154,114,0.3)] hover:brightness-110'
          } hover:-translate-y-0.5`}
        >
          Let&apos;s Talk <FaWhatsapp size={14} />
        </a>
      </div>
    </nav>
  );
}
