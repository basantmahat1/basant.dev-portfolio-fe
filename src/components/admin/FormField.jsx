export function FormField({ label, hint, children }) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-xs font-semibold">{label}</label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-text-secondary">{hint}</p>}
    </div>
  );
}

const baseInputClass =
  'w-full rounded-md border border-[var(--border)] bg-[color:var(--input-bg)] px-3 py-2 text-sm text-[color:var(--text-primary)] placeholder:text-[color:var(--text-secondary)] outline-none focus:border-tertiary';

export function TextInput(props) {
  return <input {...props} className={`${baseInputClass} ${props.className || ''}`} />;
}

export function TextArea(props) {
  return (
    <textarea {...props} className={`${baseInputClass} min-h-[120px] resize-y ${props.className || ''}`} />
  );
}

export function Select({ options, ...props }) {
  return (
    <select {...props} className={baseInputClass}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
