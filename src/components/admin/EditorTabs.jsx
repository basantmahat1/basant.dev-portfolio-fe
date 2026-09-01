export default function EditorTabs({ tabs, active, onChange }) {
  return (
    <div className="mb-6 flex flex-wrap gap-2 border-b border-[var(--border)] pb-3">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
            active === tab.id
              ? 'bg-tertiary text-white'
              : 'bg-[rgba(249,238,217,0.6)] text-text-primary hover:border-tertiary'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
