import { FaPlus, FaTrash } from 'react-icons/fa';
import { TextInput, TextArea } from './FormField';

export default function FeatureListEditor({ features, onChange }) {
  const addFeature = () => {
    onChange([
      ...features,
      { icon: 'fa-solid fa-bolt', title: '', description: '', order: features.length },
    ]);
  };

  const updateFeature = (index, patch) => {
    onChange(features.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  };

  const removeFeature = (index) => {
    onChange(features.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold">Key Features</h3>
        <button type="button" onClick={addFeature} className="btn-secondary text-xs">
          <FaPlus size={10} /> Add Feature
        </button>
      </div>

      {features.length === 0 && (
        <p className="text-xs text-text-secondary">No features added yet.</p>
      )}

      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="shell">
            <div className="glass grid grid-cols-1 gap-3 p-4 sm:grid-cols-[100px_1fr_1fr_auto]">
              <TextInput
                value={feature.icon}
                onChange={(e) => updateFeature(index, { icon: e.target.value })}
                placeholder="fa-solid fa-bolt"
                title="Font Awesome class"
              />
              <TextInput
                value={feature.title}
                onChange={(e) => updateFeature(index, { title: e.target.value })}
                placeholder="Feature title"
              />
              <TextArea
                value={feature.description}
                onChange={(e) => updateFeature(index, { description: e.target.value })}
                placeholder="Short description"
                className="min-h-[42px] sm:min-h-0"
              />
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="grid h-9 w-9 place-items-center self-start rounded-md border border-[var(--border)] hover:border-red-400 hover:text-red-500"
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
