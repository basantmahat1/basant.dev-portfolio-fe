import { useEffect, useState } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { fetchAbout } from '../services/aboutService';

const defaultAbout = {
  contact: {
    email: 'hello@basant.dev',
    phone: '+977 984XXXXXXX',
    city: 'Kathmandu, Nepal',
  },
  social: {},
};

export default function ContactPage() {
  const [about, setAbout] = useState(defaultAbout);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  useEffect(() => {
    const loadAbout = async () => {
      try {
        const data = await fetchAbout();
        if (!data) return;

        const contact = data.contact || defaultAbout.contact;
        const social = data.social || defaultAbout.social;

        setAbout({
          contact: {
            email: contact.email || defaultAbout.contact.email,
            phone: contact.phone || defaultAbout.contact.phone,
            city: contact.city || defaultAbout.contact.city,
          },
          social,
        });

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
      }
    };

    loadAbout();
    window.addEventListener('about-section-updated', loadAbout);
    return () => window.removeEventListener('about-section-updated', loadAbout);
  }, []);

  const email = about.social?.email || about.contact?.email || defaultAbout.contact.email;
  const phone = about.contact?.phone || defaultAbout.contact.phone;
  const location = about.contact?.city || defaultAbout.contact.city;

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16">
      <div className="mb-8 text-center">
        <div className="section-label">Contact</div>
        <h1 className="section-title mb-3 text-3xl sm:text-4xl">Let&apos;s build together</h1>
      </div>

      <div className="shell">
        <div className="glass grid gap-4 p-5 sm:gap-6 sm:p-8 md:grid-cols-3">
          <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.08)] p-4">
            <FaEnvelope className="mb-3 text-tertiary" />
            <div className="mb-1 text-xs uppercase tracking-wide text-text-secondary">Email</div>
            <a href={`mailto:${email}`} className="text-sm font-medium text-text-primary break-all">{email}</a>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.08)] p-4">
            <FaPhone className="mb-3 text-tertiary" />
            <div className="mb-1 text-xs uppercase tracking-wide text-text-secondary">Phone</div>
            <a href={whatsappUrl || `tel:${phone}`} className="text-sm font-medium text-text-primary">{phone}</a>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.08)] p-4">
            <FaMapMarkerAlt className="mb-3 text-tertiary" />
            <div className="mb-1 text-xs uppercase tracking-wide text-text-secondary">Location</div>
            <div className="text-sm font-medium text-text-primary">{location}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
