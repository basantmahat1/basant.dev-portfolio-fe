import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { FaFolderOpen, FaSignOutAlt, FaHome, FaUserCircle, FaEdit } from 'react-icons/fa';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import { fetchAbout } from '../../services/aboutService';

const navItems = [
  { to: '/admin/about', label: 'About Section', icon: FaUserCircle },
  { to: '/admin/projects', label: 'Projects', icon: FaFolderOpen },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [about, setAbout] = useState(null);

  useEffect(() => {
    const loadAbout = async () => {
      try {
        const data = await fetchAbout();
        setAbout(data);
      } catch (err) {
        console.error('Failed to load about data in admin layout', err);
      }
    };

    loadAbout();
    window.addEventListener('about-section-updated', loadAbout);
    return () => window.removeEventListener('about-section-updated', loadAbout);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/basantadmin/loginx670342');
  };

  const avatarSrc = about?.avatar || about?.heroImage;

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[rgba(249,238,217,0.6)] p-5">
        {/* Profile Card with About Me Photo */}
        <div className="shell mb-6">
          <div className="glass flex items-center gap-3 p-3">
            <div className="relative">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt="Admin Avatar"
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-tertiary shadow-sm"
                />
              ) : (
                <div className="grid h-11 w-11 place-items-center rounded-full bg-tertiary/20 font-display font-bold text-tertiary">
                  B
                </div>
              )}
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[var(--bg-main)] bg-emerald-500" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-bold text-text-primary">
                Basant Mahat
              </div>
              <div className="truncate text-[10px] font-medium text-tertiary">
                Full-Stack &amp; SaaS Developer
              </div>
            </div>


          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${isActive
                  ? 'bg-tertiary text-white'
                  : 'text-text-primary hover:bg-[rgba(214,112,73,0.1)]'
                }`
              }
            >
              <Icon size={14} /> {label}
            </NavLink>
          ))}
        </nav>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-2 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-text-primary hover:bg-[rgba(214,112,73,0.1)]"
        >
          <FaHome size={14} /> View Live Site
        </a>

        <div className="border-t border-[var(--border)] pt-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-text-primary hover:bg-[rgba(214,112,73,0.1)]"
          >
            <FaSignOutAlt size={14} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-background p-8">
        <Outlet />
      </main>
    </div>
  );
}
