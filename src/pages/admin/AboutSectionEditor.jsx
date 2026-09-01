import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FaArrowLeft,
  FaSave,
  FaGithub,
  FaLinkedinIn,
  FaInstagram,
  FaEnvelope,
  FaWhatsapp,
  FaFilePdf,
  FaEye,
  FaDownload,
  FaTrash,
  FaUpload,
} from 'react-icons/fa';
import { fetchAbout, updateAbout } from '../../services/aboutService';

const defaultData = {
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
    whatsapp: '',
    email: '',
  },
};

export default function AboutSectionEditor() {
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultData);

  useEffect(() => {
    const loadAbout = async () => {
      try {
        const about = await fetchAbout();
        setForm({
          ...defaultData,
          ...about,
          contact: { ...defaultData.contact, ...(about.contact || {}) },
          testimonial: { ...defaultData.testimonial, ...(about.testimonial || {}) },
          social: { ...defaultData.social, ...(about.social || {}) },
        });
      } catch (error) {
        console.error('Unable to load about section', error);
        toast.error('Failed to load about section');
      }
    };

    loadAbout();
  }, []);

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const updateNested = (group, field, value) =>
    setForm((prev) => ({
      ...prev,
      [group]: { ...prev[group], [field]: value },
    }));

  const compressImage = (file, maxWidth = 1200, quality = 0.9) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (file.type === 'image/png' && file.size < 3 * 1024 * 1024) {
          resolve(e.target.result);
          return;
        }

        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          const isPng = file.type === 'image/png' || (!file.type && file.name?.endsWith('.png'));
          const mimeType = isPng ? 'image/png' : 'image/webp';
          resolve(canvas.toDataURL(mimeType, quality));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file, 800, 0.85);
      updateField('avatar', compressed);
      toast.success('Profile photo selected');
    } catch (err) {
      console.error('Photo processing failed', err);
      toast.error('Failed to process image');
    }
    event.target.value = '';
  };

  const handleHeroImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file, 1000, 0.85);
      updateField('heroImage', compressed);
      toast.success('Hero photo selected');
    } catch (err) {
      console.error('Hero photo processing failed', err);
      toast.error('Failed to process hero image');
    }
    event.target.value = '';
  };

  const handleTestimonialAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file, 400, 0.85);
      updateNested('testimonial', 'avatar', compressed);
      toast.success('Testimonial avatar selected');
    } catch (err) {
      console.error('Testimonial avatar processing failed', err);
      toast.error('Failed to process testimonial photo');
    }
    event.target.value = '';
  };

  const handleResumeUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      toast.error('Resume file must be less than 20MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      updateField('resumeUrl', e.target.result);
      updateField('resumeName', file.name);
      toast.success(`Resume uploaded: ${file.name}`);
    };
    reader.onerror = () => {
      toast.error('Failed to read resume file');
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleRemoveResume = () => {
    updateField('resumeUrl', '');
    updateField('resumeName', '');
    toast.success('Resume removed');
  };

  const handleSave = async () => {
    try {
      await updateAbout(form);
      window.dispatchEvent(new Event('about-section-updated'));
      toast.success('About section saved');
    } catch (error) {
      console.error('Failed to save about section', error);
      toast.error('Unable to save about section');
    }
  };

  const addBadge = () => updateField('badges', [...form.badges, 'New Highlight']);
  const updateBadge = (index, value) => {
    const next = [...form.badges];
    next[index] = value;
    updateField('badges', next);
  };

  const addStat = () =>
    updateField('stats', [...form.stats, { icon: 'star', value: 'New', label: 'Metric' }]);
  const updateStat = (index, field, value) => {
    const next = [...form.stats];
    next[index] = { ...next[index], [field]: value };
    updateField('stats', next);
  };

  const addJourney = () => updateField('journey', [...form.journey, { year: '2026', label: 'New milestone' }]);
  const updateJourney = (index, field, value) => {
    const next = [...form.journey];
    next[index] = { ...next[index], [field]: value };
    updateField('journey', next);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <button
        onClick={() => navigate('/admin/projects')}
        className="mb-4 flex items-center gap-2 text-sm font-semibold text-tertiary hover:opacity-75"
      >
        <FaArrowLeft size={12} /> Back to Projects
      </button>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">About Section Editor</h1>
        <button onClick={handleSave} className="btn-primary">
          <FaSave size={12} /> Save Changes
        </button>
      </div>

      <div className="space-y-6">
        <div className="shell">
          <div className="glass space-y-4 p-6">
            <h2 className="font-display text-lg font-semibold">Photos & Info</h2>

            <div className="grid gap-6 rounded-xl border border-[var(--border)] bg-white/10 p-5 md:grid-cols-2">
              <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-[var(--border)] bg-white/20 p-4 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Profile Photo</span>
                <img
                  src={form.avatar}
                  alt="Profile preview"
                  className="h-28 w-28 rounded-full object-cover ring-2 ring-[var(--border)] shadow-sm"
                />
                <label className="btn-secondary mt-1 cursor-pointer px-4 py-2 text-xs font-medium">
                  Choose Profile Photo
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>

              <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-[var(--border)] bg-white/20 p-4 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Hero Section Photo</span>
                <img
                  src={form.heroImage || form.avatar}
                  alt="Hero preview"
                  className="h-28 w-24 rounded-2xl object-cover ring-2 ring-[var(--border)] shadow-sm"
                />
                <label className="btn-secondary mt-1 cursor-pointer px-4 py-2 text-xs font-medium">
                  Choose Hero Photo
                  <input type="file" accept="image/*" className="hidden" onChange={handleHeroImageUpload} />
                </label>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm">
                <span className="mb-2 block text-text-secondary">Title</span>
                <input
                  className="w-full rounded-lg border border-[var(--border)] bg-[color:var(--input-bg)] px-3 py-2 text-sm text-[color:var(--text-primary)] placeholder:text-[color:var(--text-secondary)] outline-none focus:border-tertiary"
                  value={form.title}
                  onChange={(e) => updateField('title', e.target.value)}
                />
              </label>
              <label className="text-sm">
                <span className="mb-2 block text-text-secondary">Location</span>
                <input
                  className="w-full rounded-lg border border-[var(--border)] bg-white/30 px-3 py-2 text-sm outline-none focus:border-tertiary"
                  value={form.location}
                  onChange={(e) => updateField('location', e.target.value)}
                />
              </label>
            </div>

            <label className="block text-sm">
              <span className="mb-2 block text-text-secondary">Description</span>
              <textarea
                className="min-h-[110px] w-full rounded-lg border border-[var(--border)] bg-white/30 px-3 py-2 text-sm outline-none focus:border-tertiary"
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
              />
            </label>
          </div>
        </div>

        {/* Resume Management Section */}
        <div className="shell">
          <div className="glass space-y-4 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-semibold flex items-center gap-2">
                  <FaFilePdf className="text-tertiary" /> Resume / CV (PDF)
                </h2>
                <p className="text-xs text-text-secondary mt-1">
                  Upload your CV (PDF or document) or paste an external link (Google Drive/Cloudinary).
                </p>
              </div>
              <label className="btn-primary cursor-pointer px-3.5 py-2 text-xs font-medium inline-flex items-center gap-2">
                <FaUpload size={11} /> Upload New Resume
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf"
                  className="hidden"
                  onChange={handleResumeUpload}
                />
              </label>
            </div>

            {form.resumeUrl ? (
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-white/20 p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-tertiary/15 text-tertiary">
                    <FaFilePdf size={22} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[color:var(--text-primary)]">
                      {form.resumeName || 'Uploaded Resume (PDF)'}
                    </div>
                    <div className="text-xs text-text-secondary">Ready for view and download</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={form.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary px-3 py-1.5 text-xs inline-flex items-center gap-1.5"
                  >
                    <FaEye size={11} /> View Resume
                  </a>
                  <a
                    href={form.resumeUrl}
                    download={form.resumeName || 'Basant_Resume.pdf'}
                    className="btn-secondary px-3 py-1.5 text-xs inline-flex items-center gap-1.5"
                  >
                    <FaDownload size={11} /> Download
                  </a>
                  <button
                    type="button"
                    onClick={handleRemoveResume}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-red-300/40 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition"
                    title="Remove Resume"
                  >
                    <FaTrash size={11} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[var(--border)] bg-white/10 p-6 text-center">
                <FaFilePdf className="mx-auto mb-2 text-3xl text-text-secondary/50" />
                <p className="text-xs text-text-secondary">No custom resume uploaded yet. Default /resume.pdf is being used.</p>
              </div>
            )}

            <div className="pt-2">
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Or Direct Resume URL (e.g. Google Drive or CDN link):
              </label>
              <input
                className="w-full rounded-lg border border-[var(--border)] bg-white/30 px-3 py-2 text-xs outline-none focus:border-tertiary"
                value={form.resumeUrl?.startsWith('data:') ? '' : form.resumeUrl || ''}
                onChange={(e) => updateField('resumeUrl', e.target.value)}
                placeholder="https://drive.google.com/file/d/... or custom PDF URL"
              />
            </div>
          </div>
        </div>

        <div className="shell">
          <div className="glass space-y-4 p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Highlights</h2>
              <button className="btn-secondary px-3 py-1.5 text-xs" onClick={addBadge}>Add badge</button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {form.badges.map((badge, index) => (
                <input
                  key={`${badge}-${index}`}
                  className="w-full rounded-lg border border-[var(--border)] bg-white/30 px-3 py-2 text-sm outline-none focus:border-tertiary"
                  value={badge}
                  onChange={(e) => updateBadge(index, e.target.value)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="shell">
          <div className="glass space-y-4 p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Stats</h2>
              <button className="btn-secondary px-3 py-1.5 text-xs" onClick={addStat}>Add stat</button>
            </div>
            <div className="space-y-3">
              {form.stats.map((stat, index) => (
                <div key={`${stat.label}-${index}`} className="grid gap-3 md:grid-cols-4">
                  <input
                    className="rounded-lg border border-[var(--border)] bg-white/30 px-3 py-2 text-sm outline-none focus:border-tertiary"
                    value={stat.icon}
                    onChange={(e) => updateStat(index, 'icon', e.target.value)}
                    placeholder="icon"
                  />
                  <input
                    className="rounded-lg border border-[var(--border)] bg-white/30 px-3 py-2 text-sm outline-none focus:border-tertiary"
                    value={stat.value}
                    onChange={(e) => updateStat(index, 'value', e.target.value)}
                    placeholder="Value"
                  />
                  <input
                    className="rounded-lg border border-[var(--border)] bg-white/30 px-3 py-2 text-sm outline-none focus:border-tertiary md:col-span-2"
                    value={stat.label}
                    onChange={(e) => updateStat(index, 'label', e.target.value)}
                    placeholder="Label"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="shell">
          <div className="glass space-y-4 p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Journey timeline</h2>
              <button className="btn-secondary px-3 py-1.5 text-xs" onClick={addJourney}>Add item</button>
            </div>
            <div className="space-y-3">
              {form.journey.map((item, index) => (
                <div key={`${item.year}-${index}`} className="grid gap-3 md:grid-cols-2">
                  <input
                    className="rounded-lg border border-[var(--border)] bg-white/30 px-3 py-2 text-sm outline-none focus:border-tertiary"
                    value={item.year}
                    onChange={(e) => updateJourney(index, 'year', e.target.value)}
                    placeholder="Year"
                  />
                  <input
                    className="rounded-lg border border-[var(--border)] bg-white/30 px-3 py-2 text-sm outline-none focus:border-tertiary"
                    value={item.label}
                    onChange={(e) => updateJourney(index, 'label', e.target.value)}
                    placeholder="Milestone"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="shell">
          <div className="glass space-y-4 p-6">
            <h2 className="font-display text-lg font-semibold">Testimonial</h2>
            <label className="block text-sm">
              <span className="mb-2 block text-text-secondary">Quote</span>
              <textarea
                className="min-h-[80px] w-full rounded-lg border border-[var(--border)] bg-white/30 px-3 py-2 text-sm outline-none focus:border-tertiary"
                value={form.testimonial.quote}
                onChange={(e) => updateNested('testimonial', 'quote', e.target.value)}
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="rounded-lg border border-[var(--border)] bg-white/30 px-3 py-2 text-sm outline-none focus:border-tertiary"
                value={form.testimonial.author}
                onChange={(e) => updateNested('testimonial', 'author', e.target.value)}
                placeholder="Author name"
              />
              <input
                className="rounded-lg border border-[var(--border)] bg-white/30 px-3 py-2 text-sm outline-none focus:border-tertiary"
                value={form.testimonial.role}
                onChange={(e) => updateNested('testimonial', 'role', e.target.value)}
                placeholder="Role"
              />
            </div>
            <div className="flex items-center gap-4 pt-2">
              {form.testimonial.avatar && (
                <img
                  src={form.testimonial.avatar}
                  alt="Testimonial avatar"
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-[var(--border)]"
                />
              )}
              <label className="btn-secondary cursor-pointer px-3 py-1.5 text-xs font-medium">
                Choose Testimonial Photo
                <input type="file" accept="image/*" className="hidden" onChange={handleTestimonialAvatarUpload} />
              </label>
            </div>
          </div>
        </div>

        <div className="shell">
          <div className="glass space-y-4 p-6">
            <h2 className="font-display text-lg font-semibold">Contact banner</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <input
                className="rounded-lg border border-[var(--border)] bg-white/30 px-3 py-2 text-sm outline-none focus:border-tertiary"
                value={form.contact.email}
                onChange={(e) => updateNested('contact', 'email', e.target.value)}
                placeholder="Email"
              />
              <input
                className="rounded-lg border border-[var(--border)] bg-white/30 px-3 py-2 text-sm outline-none focus:border-tertiary"
                value={form.contact.phone}
                onChange={(e) => updateNested('contact', 'phone', e.target.value)}
                placeholder="Phone"
              />
              <input
                className="rounded-lg border border-[var(--border)] bg-white/30 px-3 py-2 text-sm outline-none focus:border-tertiary"
                value={form.contact.city}
                onChange={(e) => updateNested('contact', 'city', e.target.value)}
                placeholder="City"
              />
            </div>
          </div>
        </div>
        <div className="shell">
          <div className="glass space-y-4 p-6">
            <h2 className="font-display text-lg font-semibold">Social Links</h2>
            <p className="text-xs text-text-secondary">Enter full URLs (e.g. https://github.com/yourname). Leave blank to hide the icon.</p>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                { key: 'github',    Icon: FaGithub,     label: 'GitHub URL' },
                { key: 'linkedin',  Icon: FaLinkedinIn, label: 'LinkedIn URL' },
                { key: 'instagram', Icon: FaInstagram,  label: 'Instagram URL' },
                { key: 'whatsapp',  Icon: FaWhatsapp,   label: 'WhatsApp (e.g. +977 984... or wa.me/..)' },
                { key: 'email',     Icon: FaEnvelope,   label: 'Email Address' },
              ].map(({ key, Icon, label }) => (
                <label key={key} className="flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[rgba(214,112,73,0.1)] text-[color:var(--tertiary)]">
                    <Icon size={13} />
                  </span>
                  <input
                    className="w-full rounded-lg border border-[var(--border)] bg-white/30 px-3 py-2 text-sm outline-none focus:border-tertiary"
                    value={form.social?.[key] || ''}
                    onChange={(e) => updateNested('social', key, e.target.value)}
                    placeholder={label}
                    type={key === 'email' ? 'email' : 'url'}
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
