import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import EditorTabs from '../../components/admin/EditorTabs';
import { FormField, TextInput, TextArea, Select } from '../../components/admin/FormField';
import FeatureListEditor from '../../components/admin/FeatureListEditor';
import TechStackEditor from '../../components/admin/TechStackEditor';
import MediaUploader from '../../components/admin/MediaUploader';
import ScreenshotManager from '../../components/admin/ScreenshotManager';
import {
  createProject,
  updateProject,
  fetchAdminProjectById,
  uploadHeroBanner,
  uploadThumbnail,
  uploadLogo,
} from '../../services/projectService';

const emptyProject = {
  title: '',
  shortDescription: '',
  fullDescription: '',
  overview: '',
  category: '',
  status: 'completed',
  publishState: 'draft',
  clientName: '',
  teamSize: '',
  myRole: '',
  links: { github: '', liveDemo: '', figma: '', apiDocs: '', videoDemo: '' },
  problemStatement: '',
  solution: '',
  details: {
    objective: '',
    targetAudience: '',
    keyFeatures: '',
    developmentProcess: '',
    systemArchitecture: '',
    databaseDesign: '',
    apiIntegration: '',
    authenticationFlow: '',
    performanceOptimizations: '',
    securityFeatures: '',
    challengesFaced: '',
    lessonsLearned: '',
    futureImprovements: '',
    resultsAndImpact: '',
  },
  features: [],
  techStack: [],
  technologies: [],
  isFeatured: false,
  completionDate: '',
};

const TABS = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'media', label: 'Media' },
  { id: 'content', label: 'Problem & Solution' },
  { id: 'details', label: 'Deep Dive' },
  { id: 'features', label: 'Features' },
  { id: 'tech', label: 'Tech Stack' },
  { id: 'screenshots', label: 'Screenshots' },
];

export default function ProjectEditor() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();

  const [project, setProject] = useState(emptyProject);
  const [activeTab, setActiveTab] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!isNew);

  useEffect(() => {
    if (isNew) return;
    fetchAdminProjectById(id)
      .then((data) =>
        setProject({
          ...emptyProject,
          ...data,
          completionDate: data.completionDate ? data.completionDate.substring(0, 10) : '',
          technologies: data.technologies || [],
        })
      )
      .catch(() => toast.error('Failed to load project.'))
      .finally(() => setIsLoading(false));
  }, [id, isNew]);

  const update = (patch) => setProject((prev) => ({ ...prev, ...patch }));
  const updateNested = (key, patch) =>
    setProject((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...project,
        teamSize: project.teamSize ? Number(project.teamSize) : undefined,
        completionDate: project.completionDate || undefined,
      };

      if (isNew) {
        const created = await createProject(payload);
        toast.success('Project created. You can now add media & screenshots.');
        navigate(`/admin/projects/${created._id}/edit`, { replace: true });
      } else {
        const updated = await updateProject(id, payload);
        setProject((prev) => ({ ...prev, ...updated }));
        toast.success('Project saved');
      }
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors?.length) {
        errors.forEach((e) => toast.error(`${e.field}: ${e.message}`));
      } else {
        toast.error(err.response?.data?.message || 'Failed to save project.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-sm text-text-secondary">Loading project...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <button
        onClick={() => navigate('/admin/projects')}
        className="mb-4 flex items-center gap-2 text-sm font-semibold text-tertiary hover:opacity-75"
      >
        <FaArrowLeft size={12} /> Back to Projects
      </button>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">
          {isNew ? 'New Project' : `Edit: ${project.title}`}
        </h1>
        <button onClick={handleSave} disabled={isSaving} className="btn-primary">
          <FaSave size={12} /> {isSaving ? 'Saving...' : 'Save Project'}
        </button>
      </div>

      <EditorTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'basic' && (
        <div className="shell">
          <div className="glass grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FormField label="Project Title">
                <TextInput value={project.title} onChange={(e) => update({ title: e.target.value })} />
              </FormField>
            </div>
            <div className="sm:col-span-2">
              <FormField label="Short Description" hint="Shown on project cards. Max 200 characters.">
                <TextArea
                  value={project.shortDescription}
                  onChange={(e) => update({ shortDescription: e.target.value })}
                  maxLength={200}
                  className="min-h-[70px]"
                />
              </FormField>
            </div>
            <div className="sm:col-span-2">
              <FormField label="Full Description">
                <TextArea
                  value={project.fullDescription}
                  onChange={(e) => update({ fullDescription: e.target.value })}
                />
              </FormField>
            </div>
            <FormField label="Category">
              <TextInput
                value={project.category}
                onChange={(e) => update({ category: e.target.value })}
                placeholder="Web App, AI / ML, SaaS..."
              />
            </FormField>
            <FormField label="Status">
              <Select
                value={project.status}
                onChange={(e) => update({ status: e.target.value })}
                options={[
                  { value: 'completed', label: 'Completed' },
                  { value: 'ongoing', label: 'Ongoing' },
                  { value: 'archived', label: 'Archived' },
                ]}
              />
            </FormField>
            <FormField label="Publish State">
              <Select
                value={project.publishState}
                onChange={(e) => update({ publishState: e.target.value })}
                options={[
                  { value: 'draft', label: 'Draft' },
                  { value: 'published', label: 'Published' },
                ]}
              />
            </FormField>
            <FormField label="Featured">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={project.isFeatured}
                  onChange={(e) => update({ isFeatured: e.target.checked })}
                />
                Show in featured projects
              </label>
            </FormField>
            <FormField label="Client Name (optional)">
              <TextInput value={project.clientName} onChange={(e) => update({ clientName: e.target.value })} />
            </FormField>
            <FormField label="Team Size">
              <TextInput
                type="number"
                min="1"
                value={project.teamSize}
                onChange={(e) => update({ teamSize: e.target.value })}
              />
            </FormField>
            <FormField label="My Role">
              <TextInput value={project.myRole} onChange={(e) => update({ myRole: e.target.value })} />
            </FormField>
            <FormField label="Completion Date">
              <TextInput
                type="date"
                value={project.completionDate}
                onChange={(e) => update({ completionDate: e.target.value })}
              />
            </FormField>
            <div className="sm:col-span-2">
              <FormField label="Technologies (comma separated)" hint="Shown as tags on the project card.">
                <TextInput
                  value={(project.technologies || []).join(', ')}
                  onChange={(e) =>
                    update({ technologies: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })
                  }
                  placeholder="React, Node.js, MongoDB, OpenAI"
                />
              </FormField>
            </div>

            <div className="sm:col-span-2 border-t border-[var(--border)] pt-4">
              <h3 className="mb-3 font-display text-base font-semibold">Links</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="GitHub URL">
                  <TextInput
                    value={project.links.github}
                    onChange={(e) => updateNested('links', { github: e.target.value })}
                  />
                </FormField>
                <FormField label="Live Demo URL">
                  <TextInput
                    value={project.links.liveDemo}
                    onChange={(e) => updateNested('links', { liveDemo: e.target.value })}
                  />
                </FormField>
                <FormField label="Figma URL">
                  <TextInput
                    value={project.links.figma}
                    onChange={(e) => updateNested('links', { figma: e.target.value })}
                  />
                </FormField>
                <FormField label="API Docs URL">
                  <TextInput
                    value={project.links.apiDocs}
                    onChange={(e) => updateNested('links', { apiDocs: e.target.value })}
                  />
                </FormField>
                <FormField label="Video Demo URL">
                  <TextInput
                    value={project.links.videoDemo}
                    onChange={(e) => updateNested('links', { videoDemo: e.target.value })}
                  />
                </FormField>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'media' && (
        <div className="shell">
          <div className="glass space-y-6 p-6">
            {isNew ? (
              <p className="text-sm text-text-secondary">
                Save the project first to unlock media uploads.
              </p>
            ) : (
              <>
                <MediaUploader
                  label="Hero Banner"
                  currentUrl={project.heroBanner?.url}
                  uploadFn={(file) => uploadHeroBanner(id, file)}
                  onUploaded={(updated) => update({ heroBanner: updated.heroBanner })}
                />
                <MediaUploader
                  label="Project Thumbnail"
                  currentUrl={project.thumbnail?.url}
                  uploadFn={(file) => uploadThumbnail(id, file)}
                  onUploaded={(updated) => update({ thumbnail: updated.thumbnail })}
                  aspect="aspect-[4/3]"
                />
                <MediaUploader
                  label="Project Logo (optional)"
                  currentUrl={project.logo?.url}
                  uploadFn={(file) => uploadLogo(id, file)}
                  onUploaded={(updated) => update({ logo: updated.logo })}
                  aspect="aspect-square"
                />
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="shell">
          <div className="glass space-y-4 p-6">
            <FormField label="Overview">
              <TextArea value={project.overview} onChange={(e) => update({ overview: e.target.value })} />
            </FormField>
            <FormField
              label="Problem Statement"
              hint="User pain points, business problems, why this project was necessary. HTML supported."
            >
              <TextArea
                value={project.problemStatement}
                onChange={(e) => update({ problemStatement: e.target.value })}
                className="min-h-[160px]"
              />
            </FormField>
            <FormField
              label="Solution"
              hint="How the project solves the problem, technical approach, business value. HTML supported."
            >
              <TextArea
                value={project.solution}
                onChange={(e) => update({ solution: e.target.value })}
                className="min-h-[160px]"
              />
            </FormField>
          </div>
        </div>
      )}

      {activeTab === 'details' && (
        <div className="shell">
          <div className="glass grid grid-cols-1 gap-4 p-6">
            {Object.keys(emptyProject.details).map((key) => (
              <FormField key={key} label={key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}>
                <TextArea
                  value={project.details[key] || ''}
                  onChange={(e) => updateNested('details', { [key]: e.target.value })}
                />
              </FormField>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'features' && (
        <div className="shell">
          <div className="glass p-6">
            <FeatureListEditor
              features={project.features}
              onChange={(features) => update({ features })}
            />
          </div>
        </div>
      )}

      {activeTab === 'tech' && (
        <div className="shell">
          <div className="glass p-6">
            <TechStackEditor
              techStack={project.techStack}
              onChange={(techStack) => update({ techStack })}
            />
          </div>
        </div>
      )}

      {activeTab === 'screenshots' && (
        <div className="shell">
          <div className="glass p-6">
            {isNew ? (
              <p className="text-sm text-text-secondary">
                Save the project first to unlock screenshot uploads.
              </p>
            ) : (
              <ScreenshotManager
                projectId={id}
                screenshots={project.screenshots || []}
                onChange={(screenshots) => update({ screenshots })}
              />
            )}
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button onClick={handleSave} disabled={isSaving} className="btn-primary">
          <FaSave size={12} /> {isSaving ? 'Saving...' : 'Save Project'}
        </button>
      </div>
    </div>
  );
}
