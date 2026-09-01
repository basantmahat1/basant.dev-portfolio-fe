import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { FaPlus } from 'react-icons/fa';
import {
  fetchAdminProjects,
  deleteProject,
  togglePublish,
  toggleFeatured,
  reorderProjects,
} from '../../services/projectService';
import SortableProjectRow from '../../components/admin/SortableProjectRow';

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetchAdminProjects({ limit: 100 });
      setProjects(res.data);
    } catch {
      toast.error('Failed to load projects.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex((p) => p._id === active.id);
    const newIndex = projects.findIndex((p) => p._id === over.id);
    const reordered = arrayMove(projects, oldIndex, newIndex);
    setProjects(reordered);

    const order = reordered.map((p, i) => ({ id: p._id, displayOrder: i }));
    try {
      await reorderProjects(order);
    } catch {
      toast.error('Failed to save new order.');
      loadProjects();
    }
  };

  const handleEdit = (project) => navigate(`/admin/projects/${project._id}/edit`);

  const handleDelete = async (project) => {
    if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) return;
    try {
      await deleteProject(project._id);
      toast.success('Project deleted');
      setProjects((prev) => prev.filter((p) => p._id !== project._id));
    } catch {
      toast.error('Failed to delete project.');
    }
  };

  const handleTogglePublish = async (project) => {
    try {
      const updated = await togglePublish(project._id);
      setProjects((prev) => prev.map((p) => (p._id === project._id ? updated : p)));
      toast.success(
        updated.publishState === 'published' ? 'Project published' : 'Moved to draft'
      );
    } catch {
      toast.error('Failed to update publish state.');
    }
  };

  const handleToggleFeatured = async (project) => {
    try {
      const updated = await toggleFeatured(project._id);
      setProjects((prev) => prev.map((p) => (p._id === project._id ? updated : p)));
    } catch {
      toast.error('Failed to update featured flag.');
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-semibold sm:text-2xl">Projects</h1>
          <p className="text-xs text-text-secondary sm:text-sm">
            Drag rows to reorder. Order controls the public projects grid.
          </p>
        </div>
        <Link to="/admin/projects/new" className="btn-primary shrink-0">
          <FaPlus size={12} /> New Project
        </Link>
      </div>

      <div className="shell">
        <div className="glass overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-sm text-text-secondary">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="p-8 text-center text-sm text-text-secondary">
              No projects yet. Create your first one.
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={projects.map((p) => p._id)}
                strategy={verticalListSortingStrategy}
              >
                {/* Desktop table */}
                <table className="hidden w-full text-left sm:table">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-text-secondary">
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3">Project</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3">Publish</th>
                      <th className="px-3 py-3">Featured</th>
                      <th className="px-3 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <SortableProjectRow
                        key={project._id}
                        project={project}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onTogglePublish={handleTogglePublish}
                        onToggleFeatured={handleToggleFeatured}
                      />
                    ))}
                  </tbody>
                </table>

                {/* Mobile card list */}
                <div className="flex flex-col divide-y divide-[var(--border)] sm:hidden">
                  {projects.map((project) => (
                    <div key={project._id} className="flex items-center gap-3 p-3">
                      <img
                        src={project.thumbnail?.url || 'https://via.placeholder.com/48'}
                        alt={project.title}
                        className="h-12 w-12 shrink-0 rounded-md object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold">{project.title}</div>
                        <div className="text-xs text-text-secondary">{project.category}</div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            project.publishState === 'published'
                              ? 'bg-[rgba(74,173,103,0.15)] text-[#3d8b56]'
                              : 'bg-[rgba(140,117,103,0.15)] text-text-secondary'
                          }`}>
                            {project.publishState}
                          </span>
                          <span className="rounded-full bg-[rgba(214,112,73,0.12)] px-2 py-0.5 text-[10px] font-semibold text-tertiary">
                            {project.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col gap-1.5">
                        <button
                          onClick={() => handleEdit(project)}
                          className="grid h-8 w-8 place-items-center rounded-md border border-[var(--border)] hover:border-tertiary hover:text-tertiary"
                          aria-label="Edit"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button
                          onClick={() => handleDelete(project)}
                          className="grid h-8 w-8 place-items-center rounded-md border border-[var(--border)] hover:border-red-400 hover:text-red-500"
                          aria-label="Delete"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </div>
  );
}
