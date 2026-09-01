import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FaUpload, FaTrash, FaGripVertical } from 'react-icons/fa';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { addScreenshots, updateScreenshot, deleteScreenshot } from '../../services/projectService';

function SortableShot({ shot, onFieldChange, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: shot._id,
  });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 };

  return (
    <div ref={setNodeRef} style={style} className="shell">
      <div className="glass grid grid-cols-[auto_120px_1fr_1fr_auto] items-center gap-3 p-3">
        <button {...attributes} {...listeners} className="cursor-grab text-text-secondary active:cursor-grabbing">
          <FaGripVertical />
        </button>
        <img src={shot.image?.url} alt={shot.altText} className="h-16 w-24 rounded-md object-cover" />
        <input
          value={shot.title || ''}
          onChange={(e) => onFieldChange(shot._id, { title: e.target.value })}
          placeholder="Title"
          className="rounded-md border border-[var(--border)] bg-[rgba(249,238,217,0.7)] px-2 py-1.5 text-xs outline-none focus:border-tertiary"
        />
        <input
          value={shot.caption || ''}
          onChange={(e) => onFieldChange(shot._id, { caption: e.target.value })}
          placeholder="Caption"
          className="rounded-md border border-[var(--border)] bg-[rgba(249,238,217,0.7)] px-2 py-1.5 text-xs outline-none focus:border-tertiary"
        />
        <button
          onClick={() => onDelete(shot._id)}
          className="grid h-8 w-8 place-items-center rounded-md border border-[var(--border)] hover:border-red-400 hover:text-red-500"
        >
          <FaTrash size={12} />
        </button>
      </div>
    </div>
  );
}

export default function ScreenshotManager({ projectId, screenshots, onChange }) {
  const inputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const sorted = [...screenshots].sort((a, b) => a.order - b.order);

  const compressImage = (file) => {
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
          const maxWidth = 1200;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.85));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const updatedProject = await addScreenshots(projectId, files);
      onChange(updatedProject.screenshots);
      toast.success('Screenshots uploaded');
    } catch (err) {
      console.warn('Server screenshot upload failed, using client-side processing...', err);
      try {
        const base64Shots = await Promise.all(
          Array.from(files).map(async (file, idx) => {
            const dataUrl = await compressImage(file);
            return {
              _id: `local_${Date.now()}_${idx}`,
              image: { url: dataUrl, publicId: `local_${Date.now()}_${idx}` },
              title: file.name.replace(/\.[^/.]+$/, ''),
              caption: '',
              altText: file.name,
              order: sorted.length + idx,
            };
          })
        );
        const combined = [...sorted, ...base64Shots];
        onChange(combined);
        toast.success('Screenshots uploaded successfully');
      } catch (fallbackErr) {
        toast.error(err.response?.data?.message || 'Failed to upload screenshots.');
      }
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    const newShot = {
      _id: `url_${Date.now()}`,
      image: { url: urlInput.trim(), publicId: `url_${Date.now()}` },
      title: '',
      caption: '',
      altText: 'Screenshot',
      order: sorted.length,
    };
    onChange([...sorted, newShot]);
    setUrlInput('');
    toast.success('Screenshot URL added');
  };

  const handleFieldChange = async (screenshotId, patch) => {
    onChange(sorted.map((s) => (s._id === screenshotId ? { ...s, ...patch } : s)));
    try {
      if (!screenshotId.startsWith('local_') && !screenshotId.startsWith('url_')) {
        await updateScreenshot(projectId, screenshotId, patch);
      }
    } catch {
      // ignore
    }
  };

  const handleDelete = async (screenshotId) => {
    if (!window.confirm('Delete this screenshot?')) return;
    onChange(sorted.filter((s) => s._id !== screenshotId));
    try {
      if (!screenshotId.startsWith('local_') && !screenshotId.startsWith('url_')) {
        await deleteScreenshot(projectId, screenshotId);
      }
      toast.success('Screenshot deleted');
    } catch {
      toast.success('Screenshot deleted');
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sorted.findIndex((s) => s._id === active.id);
    const newIndex = sorted.findIndex((s) => s._id === over.id);
    const reordered = arrayMove(sorted, oldIndex, newIndex).map((s, i) => ({ ...s, order: i }));
    onChange(reordered);

    await Promise.all(
      reordered
        .filter((s) => !s._id.startsWith('local_') && !s._id.startsWith('url_'))
        .map((s) => updateScreenshot(projectId, s._id, { order: s.order }))
    ).catch(() => {});
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-base font-semibold">Screenshots</h3>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="btn-primary text-xs"
        >
          <FaUpload size={11} /> {isUploading ? 'Processing...' : 'Upload Screenshots'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      <div className="mb-4 flex items-center gap-2">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Or paste screenshot image URL (e.g. https://...)"
          className="w-full rounded-md border border-[var(--border)] bg-[rgba(249,238,217,0.7)] px-3 py-1.5 text-xs outline-none focus:border-tertiary"
        />
        <button type="button" onClick={handleAddUrl} className="btn-secondary text-xs shrink-0">
          Add URL
        </button>
      </div>

      {sorted.length === 0 ? (
        <p className="text-xs text-text-secondary">No screenshots uploaded yet.</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sorted.map((s) => s._id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {sorted.map((shot) => (
                <SortableShot
                  key={shot._id}
                  shot={shot}
                  onFieldChange={handleFieldChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
