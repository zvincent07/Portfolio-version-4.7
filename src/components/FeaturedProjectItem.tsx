import { useRef, useEffect } from 'react';
import { animate } from 'animejs';
import type { FeaturedProject } from '../data/projects';
import ExternalLinkIcon from './ExternalLinkIcon';
import TechTags from './TechTags';
import ProjectDomainColumn from './ProjectDomainColumn';

interface FeaturedProjectItemProps {
  project: FeaturedProject;
}

export default function FeaturedProjectItem({ project }: FeaturedProjectItemProps) {
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = articleRef.current;
    if (!el) return;

    // Initial state
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(el, {
              opacity: [0, 1],
              translateY: [20, 0],
              duration: 800,
              delay: 100,
              easing: 'easeOutQuart',
            });
          } else {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const handleMouseEnter = () => {
    if (!articleRef.current) return;
    animate(articleRef.current, {
      scale: 1.01,
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      duration: 300,
      easing: 'easeOutQuad',
    });
  };

  const handleMouseLeave = () => {
    if (!articleRef.current) return;
    animate(articleRef.current, {
      scale: 1,
      backgroundColor: 'rgba(255, 255, 255, 0)',
      duration: 300,
      easing: 'easeOutQuad',
    });
  };

  return (
    <article
      ref={articleRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="grid grid-cols-1 md:grid-cols-[2fr_10fr] gap-x-8 gap-y-4 pt-6 pb-6 border-b border-white/5 transition-colors duration-300 px-4 -mx-4"
    >
      <ProjectDomainColumn label={project.domain.label} icon={project.domain.icon} />

      <div className="min-w-0">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <h3 className="text-base font-semibold text-white m-0">{project.title}</h3>
            {project.badge && (
              <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-400 border border-red-500/40 rounded-none">
                {project.badge}
              </span>
            )}
          </div>
          <ExternalLinkIcon href={project.href} label={`Open ${project.title}`} className="shrink-0 mt-0.5" />
        </div>

        <TechTags items={project.tech} className="mb-3" />

        <p className="text-sm text-zinc-500 leading-relaxed m-0 mb-4">{project.description}</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
          <div className="border-l border-red-500/40 pl-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-red-400">Challenge</span>
            <p className="text-zinc-500 leading-relaxed m-0 mt-1">{project.challenge}</p>
          </div>
          <div className="border-l border-white/10 pl-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Fix</span>
            <p className="text-zinc-500 leading-relaxed m-0 mt-1">{project.fix}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
