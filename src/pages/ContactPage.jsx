import { FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

export default function ContactPage() {
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
            <a href="mailto:hello@basant.dev" className="text-sm font-medium text-text-primary break-all">hello@basant.dev</a>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.08)] p-4">
            <FaPhone className="mb-3 text-tertiary" />
            <div className="mb-1 text-xs uppercase tracking-wide text-text-secondary">Phone</div>
            <a href="tel:+977984xxxxxxx" className="text-sm font-medium text-text-primary">+977 984XXXXXXX</a>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.08)] p-4">
            <FaMapMarkerAlt className="mb-3 text-tertiary" />
            <div className="mb-1 text-xs uppercase tracking-wide text-text-secondary">Location</div>
            <div className="text-sm font-medium text-text-primary">Kathmandu, Nepal</div>
          </div>
        </div>
      </div>
    </section>
  );

}
