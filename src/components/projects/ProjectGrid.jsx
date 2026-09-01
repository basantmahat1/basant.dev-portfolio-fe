import ProjectCard from './ProjectCard';

export default function ProjectGrid({ projects, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton h-64 w-full" />
        ))}
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="glass rounded-lg p-10 text-center text-text-secondary">
        No projects found. Try adjusting your search or filters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {projects.map((project, i) => (
        <ProjectCard key={project._id} project={project} index={i} />
      ))}
    </div>
  );
}
