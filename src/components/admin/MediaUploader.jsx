import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FaUpload } from 'react-icons/fa';

export default function MediaUploader({ label, currentUrl, uploadFn, onUploaded, aspect = 'aspect-video' }) {
  const inputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const updatedProject = await uploadFn(file);
      onUploaded(updatedProject);
      toast.success(`${label} updated`);
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to upload ${label.toLowerCase()}.`);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div>
      <label className="mb-1 block text-xs font-semibold">{label}</label>
      <div
        className={`relative flex ${aspect} w-full max-w-sm items-center justify-center overflow-hidden rounded-lg border border-dashed border-[var(--border)] bg-[rgba(249,238,217,0.5)]`}
      >
        {currentUrl ? (
          <img src={currentUrl} alt={label} className="h-full w-full object-cover" />
        ) : (
          <span className="text-xs text-text-secondary">No image uploaded</span>
        )}
        {isUploading && (
          <div className="absolute inset-0 grid place-items-center bg-black/30">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="btn-secondary mt-2 text-xs"
        disabled={isUploading}
      >
        <FaUpload size={10} /> {currentUrl ? 'Replace' : 'Upload'}
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </div>
  );
}
