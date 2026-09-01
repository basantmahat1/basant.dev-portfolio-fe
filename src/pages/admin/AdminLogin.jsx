import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaLock } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import { fetchAbout } from '../../services/aboutService';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aboutPhoto, setAboutPhoto] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchAbout()
      .then((data) => {
        if (data?.avatar || data?.heroImage) {
          setAboutPhoto(data.avatar || data.heroImage);
        }
      })
      .catch(() => {});
  }, []);

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await login(values.email, values.password);
      toast.success('Welcome back!');
      navigate(location.state?.from || '/admin/projects', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="shell w-full max-w-sm">
        <div className="glass p-8">
          <div className="mb-6 text-center">
            {aboutPhoto ? (
              <div className="relative mx-auto mb-4 h-20 w-20">
                <img
                  src={aboutPhoto}
                  alt="Admin"
                  className="h-full w-full rounded-full object-cover ring-4 ring-tertiary shadow-lg"
                />
                <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-[var(--bg-main)] bg-emerald-500" />
              </div>
            ) : (
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-tertiary/20 ring-4 ring-tertiary/30 text-tertiary">
                <FaLock size={22} />
              </div>
            )}
            <h1 className="font-display text-xl font-bold">Basant Mahat</h1>
            <p className="text-xs font-semibold text-tertiary">Full-Stack Developer — Admin Portal</p>
          </div>


          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold">Email</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="w-full rounded-md border border-[var(--border)] bg-[rgba(249,238,217,0.7)] px-3 py-2 text-sm outline-none focus:border-tertiary"
                placeholder="admin@basant.dev"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold">Password</label>
              <input
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="w-full rounded-md border border-[var(--border)] bg-[rgba(249,238,217,0.7)] px-3 py-2 text-sm outline-none focus:border-tertiary"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center">
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary transition hover:text-tertiary"
            >
              <FaArrowLeft size={10} /> Back to Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
