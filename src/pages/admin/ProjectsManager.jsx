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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Projects</h1>
          <p className="text-sm text-text-secondary">
            Drag rows to reorder. Order here controls the public projects grid.
          </p>
        </div>
        <Link to="/admin/projects/new" className="btn-primary">
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
            <table className="w-full text-left">
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
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={projects.map((p) => p._id)}
                  strategy={verticalListSortingStrategy}
                >
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
                </SortableContext>
              </DndContext>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
