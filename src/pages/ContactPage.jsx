import { useEffect, useState } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { fetchAbout } from '../services/aboutService';

export default function ContactPage() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  useEffect(() => {
    const loadAbout = async () => {
      try {
        const data = await fetchAbout();
        if (!data || !data.contact) {
          setAbout(null);
          setLoading(false);
          return;
        }

        const contact = data.contact;
        const social = data.social || {};

        setAbout({ contact, social });

        const whatsappValue = social.whatsapp || contact.phone || '';
        if (whatsappValue) {
          if (whatsappValue.startsWith('http://') || whatsappValue.startsWith('https://')) {
            setWhatsappUrl(whatsappValue);
          } else {
            const digits = whatsappValue.replace(/[^0-9]/g, '');
            if (digits) setWhatsappUrl(`https://wa.me/${digits}`);
          }
        } else {
          setWhatsappUrl('');
        }
      } catch (error) {
        console.error('Failed to load contact page data', error);
      } finally {
        setLoading(false);
      }
    };

    loadAbout();
    window.addEventListener('about-section-updated', loadAbout);
    return () => window.removeEventListener('about-section-updated', loadAbout);
  }, []);

  const email = about?.social?.email || about?.contact?.email || '';
  const phone = about?.contact?.phone || '';
  const location = about?.contact?.city || '';

  if (loading) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16">
        <div className="mb-8 text-center">
          <div className="section-label">Contact</div>
          <h1 className="section-title mb-3 text-3xl sm:text-4xl">Let&apos;s build together</h1>
        </div>
        <div className="shell">
          <div className="glass grid gap-4 p-5 sm:gap-6 sm:p-8 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.08)] p-4" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16">
      <div className="mb-8 text-center">
        <div className="section-label">Contact</div>
        <h1 className="section-title mb-3 text-3xl sm:text-4xl">Let&apos;s build together</h1>
      </div>

      <div className="shell">
        <div className="glass grid gap-4 p-5 sm:gap-6 sm:p-8 md:grid-cols-3">
          {email && (
            <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.08)] p-4">
              <FaEnvelope className="mb-3 text-tertiary" />
              <div className="mb-1 text-xs uppercase tracking-wide text-text-secondary">Email</div>
              <a href={`mailto:${email}`} className="text-sm font-medium text-text-primary break-all">{email}</a>
            </div>
          )}

          {phone && (
            <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.08)] p-4">
              <FaPhone className="mb-3 text-tertiary" />
              <div className="mb-1 text-xs uppercase tracking-wide text-text-secondary">Phone</div>
              <a href={whatsappUrl || `tel:${phone}`} className="text-sm font-medium text-text-primary">{phone}</a>
            </div>
          )}

          {location && (
            <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.08)] p-4">
              <FaMapMarkerAlt className="mb-3 text-tertiary" />
              <div className="mb-1 text-xs uppercase tracking-wide text-text-secondary">Location</div>
              <div className="text-sm font-medium text-text-primary">{location}</div>
            </div>
          )}

          {!email && !phone && !location && (
            <div className="col-span-full text-center text-sm text-text-secondary py-4">
              Contact info not available yet. Please update from admin panel.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
