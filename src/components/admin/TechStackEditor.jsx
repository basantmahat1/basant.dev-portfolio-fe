import { FaPlus, FaTrash } from 'react-icons/fa';
import { TextInput, Select } from './FormField';

const CATEGORIES = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'database', label: 'Database' },
  { value: 'api', label: 'API' },
  { value: 'library', label: 'Library' },
  { value: 'deployment', label: 'Deployment' },
];

export default function TechStackEditor({ techStack, onChange }) {
  const addItem = () => {
    onChange([...techStack, { name: '', icon: '', category: 'frontend' }]);
  };

  const updateItem = (index, patch) => {
    onChange(techStack.map((t, i) => (i === index ? { ...t, ...patch } : t)));
  };

  const removeItem = (index) => {
    onChange(techStack.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold">Tech Stack Badges</h3>
        <button type="button" onClick={addItem} className="btn-secondary text-xs">
          <FaPlus size={10} /> Add Tech
        </button>
      </div>

      {techStack.length === 0 && <p className="text-xs text-text-secondary">No tech stack items yet.</p>}

      <div className="space-y-3">
        {techStack.map((item, index) => (
          <div key={index} className="shell">
            <div className="glass grid grid-cols-1 gap-3 p-4 sm:grid-cols-[1fr_1fr_140px_auto]">
              <TextInput
                value={item.name}
                onChange={(e) => updateItem(index, { name: e.target.value })}
                placeholder="React"
              />
              <TextInput
                value={item.icon}
                onChange={(e) => updateItem(index, { icon: e.target.value })}
                placeholder="fa-brands fa-react"
              />
              <Select
                value={item.category}
                onChange={(e) => updateItem(index, { category: e.target.value })}
                options={CATEGORIES}
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="grid h-9 w-9 place-items-center rounded-md border border-[var(--border)] hover:border-red-400 hover:text-red-500"
              >
                <FaTrash size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
