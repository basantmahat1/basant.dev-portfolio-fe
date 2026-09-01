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

      {/* Mobile Drawer — slides in from RIGHT side */}
      {/* Backdrop */}
      <div
        onClick={() => setMobileMenuOpen(false)}
        className={`fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 z-[95] flex h-full w-[280px] flex-col border-l border-[var(--border)] bg-[color:var(--panel)] shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <span className="font-display text-base font-bold text-text-primary">Menu</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
            className="grid h-8 w-8 place-items-center rounded-xl border border-[var(--border)] text-text-primary hover:bg-tertiary/10 hover:text-tertiary transition"
          >
            <FaTimes size={14} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-tertiary text-white shadow-sm'
                    : 'text-[color:var(--text-primary)] hover:bg-tertiary/10 hover:text-tertiary'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Drawer Footer */}
        <div className="border-t border-[var(--border)] p-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-tertiary px-4 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-110 transition"
          >
            <FaWhatsapp size={16} /> Let&apos;s Talk on WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}

