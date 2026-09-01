import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FaMoon, FaSun, FaWhatsapp, FaBars, FaTimes } from 'react-icons/fa';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('portfolio-theme');
    return saved ? saved === 'dark' : false;
  });

  // Close mobile menu on page navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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
    <header className="sticky top-0 z-[100] border-b border-[var(--border)] bg-[color:var(--panel)] backdrop-blur-md shadow-[0_4px_12px_rgba(214,112,73,0.04)] dark-mode:shadow-none">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8 sm:py-4">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 font-display text-lg font-bold text-[color:var(--text-primary)] transition hover:opacity-90 sm:text-xl"
        >
          {avatar ? (
            <img
              src={avatar}
              alt="Basant"
              className="h-8 w-8 rounded-full border-2 border-tertiary object-cover shadow-sm"
            />
          ) : (
            <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-tertiary shadow-glow" />
          )}
          <span>Basant.dev</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-1 text-sm font-semibold md:flex lg:gap-2">
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

        {/* Action Buttons & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark Mode Toggle */}
          <button
            type="button"
            aria-label="Toggle dark mode"
            onClick={() => setDarkMode((prev) => !prev)}
            className={`grid h-8 w-8 place-items-center rounded-full border border-[var(--border)] bg-[color:var(--panel)] text-[color:var(--text-primary)] transition-all duration-200 sm:h-9 sm:w-9 ${
              darkMode
                ? 'hover:bg-[#1d242d] hover:text-[color:var(--accent)]'
                : 'hover:bg-[color:var(--tertiary)] hover:text-white'
            }`}
          >
            {darkMode ? <FaSun size={13} /> : <FaMoon size={13} />}
          </button>

          {/* WhatsApp / Contact Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-xl bg-tertiary px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:brightness-110 sm:inline-flex sm:px-4 sm:py-2"
          >
            <span>Let&apos;s Talk</span>
            <FaWhatsapp size={14} />
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            aria-label="Open navigation menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="grid h-8 w-8 place-items-center rounded-xl border border-[var(--border)] bg-[color:var(--panel)] text-[color:var(--text-primary)] transition hover:bg-tertiary/10 md:hidden"
          >
            {mobileMenuOpen ? <FaTimes size={15} /> : <FaBars size={15} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-[var(--border)] bg-[color:var(--panel)] px-4 py-4 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1.5">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-tertiary text-white shadow-sm'
                      : 'text-[color:var(--text-primary)] hover:bg-tertiary/10'
                  }`
                }
              >
                <span>{link.label}</span>
              </NavLink>
            ))}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-tertiary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-110"
            >
              <FaWhatsapp size={16} /> Let&apos;s Talk on WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

