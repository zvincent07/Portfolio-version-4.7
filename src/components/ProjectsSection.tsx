import SectionHeader from './SectionHeader';
import FeaturedProjectItem from './FeaturedProjectItem';
import CompactProjectRow from './CompactProjectRow';
import { projects } from '../data/projects';
import { SECTION_SHELL } from '../constants/layout';

const featuredProjects = projects.filter((p) => p.type === 'featured');
const compactProjects = projects.filter((p) => p.type === 'compact');

export default function ProjectsSection() {
  return (
    <section id="projects" className={SECTION_SHELL}>
      <div className="w-full max-w-[1400px] mx-auto">
        <SectionHeader title="Featured Projects" />

        <div className="mt-6 w-full">
          {featuredProjects.map((project) => (
            <FeaturedProjectItem key={project.title} project={project} />
          ))}

          {compactProjects.length > 0 && (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 m-0 pt-4 pb-2 border-b border-white/5">
                More projects
              </p>
              {compactProjects.map((project) => (
                <CompactProjectRow key={project.title} project={project} />
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
