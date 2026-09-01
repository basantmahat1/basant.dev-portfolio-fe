import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaGripVertical, FaEdit, FaTrash, FaStar, FaRegStar, FaEye, FaEyeSlash } from 'react-icons/fa';

const statusColors = {
  completed: 'bg-[rgba(74,173,103,0.15)] text-[#3d8b56]',
  ongoing: 'bg-[rgba(214,166,73,0.18)] text-[#8a6d1f]',
  archived: 'bg-[rgba(140,117,103,0.15)] text-text-secondary',
};

export default function SortableProjectRow({
  project,
  onEdit,
  onDelete,
  onTogglePublish,
  onToggleFeatured,
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style} className="border-b border-[var(--border)] bg-white/30">
      <td className="w-8 px-3 py-3 text-text-secondary">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing" aria-label="Drag to reorder">
          <FaGripVertical />
        </button>
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-3">
          <img
            src={project.thumbnail?.url || 'https://via.placeholder.com/48'}
            alt={project.title}
            className="h-10 w-10 rounded-md object-cover"
          />
          <div>
            <div className="text-sm font-semibold">{project.title}</div>
            <div className="text-xs text-text-secondary">{project.category}</div>
          </div>
        </div>
      </td>
      <td className="px-3 py-3">
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusColors[project.status]}`}>
          {project.status}
        </span>
      </td>
      <td className="px-3 py-3">
        <button
          onClick={() => onTogglePublish(project)}
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            project.publishState === 'published'
              ? 'bg-[rgba(74,173,103,0.15)] text-[#3d8b56]'
              : 'bg-[rgba(140,117,103,0.15)] text-text-secondary'
          }`}
        >
          {project.publishState === 'published' ? <FaEye size={10} /> : <FaEyeSlash size={10} />}
          {project.publishState}
        </button>
      </td>
      <td className="px-3 py-3">
        <button onClick={() => onToggleFeatured(project)} className="text-tertiary">
          {project.isFeatured ? <FaStar /> : <FaRegStar />}
        </button>
      </td>
      <td className="px-3 py-3 text-right">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onEdit(project)}
            className="grid h-8 w-8 place-items-center rounded-md border border-[var(--border)] hover:border-tertiary hover:text-tertiary"
            aria-label="Edit"
          >
            <FaEdit size={13} />
          </button>
          <button
            onClick={() => onDelete(project)}
            className="grid h-8 w-8 place-items-center rounded-md border border-[var(--border)] hover:border-red-400 hover:text-red-500"
            aria-label="Delete"
          >
            <FaTrash size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
}
