import { useRef, useEffect } from 'react';
import { animate } from 'animejs';
import type { CompactProject } from '../data/projects';
import ExternalLinkIcon from './ExternalLinkIcon';
import TechTags from './TechTags';
import ProjectDomainColumn from './ProjectDomainColumn';

interface CompactProjectRowProps {
  project: CompactProject;
}

export default function CompactProjectRow({ project }: CompactProjectRowProps) {
  const rowRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    // Initial state
    el.style.opacity = '0';
    el.style.transform = 'translateY(15px)';

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(el, {
              opacity: [0, 1],
              translateY: [15, 0],
              duration: 600,
              delay: 50,
              easing: 'easeOutQuart',
            });
          } else {
            el.style.opacity = '0';
            el.style.transform = 'translateY(15px)';
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const handleMouseEnter = () => {
    if (!rowRef.current) return;
    animate(rowRef.current, {
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      duration: 300,
      easing: 'easeOutQuad',
    });
  };

  const handleMouseLeave = () => {
    if (!rowRef.current) return;
    animate(rowRef.current, {
      backgroundColor: 'rgba(255, 255, 255, 0)',
      duration: 300,
      easing: 'easeOutQuad',
    });
  };

  return (
    <article
      ref={rowRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="grid grid-cols-1 md:grid-cols-[2fr_10fr] gap-x-8 gap-y-3 pt-5 pb-5 border-b border-white/5 transition-colors duration-300 px-4 -mx-4"
    >
      <ProjectDomainColumn label={project.domain.label} icon={project.domain.icon} />

      <div className="min-w-0 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 mb-1.5">
            <h3 className="text-sm font-semibold text-white m-0">{project.title}</h3>
            <TechTags items={project.tech} />
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed m-0">{project.description}</p>
        </div>
        <ExternalLinkIcon
          href={project.href}
          label={`Open ${project.title}`}
          className="shrink-0 self-start sm:mt-0.5"
        />
      </div>
    </article>
  );
}
