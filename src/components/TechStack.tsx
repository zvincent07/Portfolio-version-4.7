import { useRef } from 'react';
import { animate } from 'animejs';
import type { LucideIcon } from 'lucide-react';
import { Cloud, Cpu, GitBranch, Layout, Database, Network } from 'lucide-react';

interface TechStackCategory {
  title: string;
  items: string[];
  icon: LucideIcon;
}

const techStack: TechStackCategory[] = [
  {
    title: 'Web Development',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Zustand', 'ShadCN'],
    icon: Layout,
  },
  {
    title: 'Backend & Cloud',
    items: ['Node.js', 'Express.js', 'Flask', 'REST APIs', 'CI/CD (GitHub Actions)'],
    icon: Cloud,
  },
  {
    title: 'AI & Automation',
    items: ['Prompt Engineering', 'OpenAI API', 'LLM Integration'],
    icon: Cpu,
  },
  {
    title: 'Database',
    items: ['PostgreSQL', 'MongoDB', 'Supabase', 'SQL Optimization'],
    icon: Database,
  },
  {
    title: 'Tools & Workflow',
    items: ['Git', 'Figma', 'Postman', 'Agile / Scrum', 'Technical Documentation'],
    icon: GitBranch,
  },
  {
    title: 'IT Support & Networking',
    items: ['IT Support', 'PC Building', 'Troubleshooting', 'Active Directory', 'Windows Server', 'Networking Basics', 'Hardware & Software Support'],
    icon: Network,
  },
];

const PILL_REST = {
  scale: 1,
  translateY: 0,
  backgroundColor: '#0f172a',
  borderColor: 'rgba(255, 255, 255, 0.05)',
  color: 'rgba(209, 213, 219, 1)',
} as const;

const PILL_HOVER = {
  scale: 1.04,
  translateY: -1,
  backgroundColor: 'rgba(127, 29, 29, 0.2)',
  borderColor: 'rgba(239, 68, 68, 0.5)',
  color: 'rgba(229, 231, 235, 1)',
} as const;

const ANIM = { duration: 250, ease: 'outQuart' } as const;

function SkillPill({ skill }: { skill: string }) {
  const pillRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = () => {
    if (!pillRef.current) return;
    animate(pillRef.current, { ...PILL_HOVER, ...ANIM });
  };

  const handleMouseLeave = () => {
    if (!pillRef.current) return;
    animate(pillRef.current, { ...PILL_REST, ...ANIM });
  };

  return (
    <span
      ref={pillRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="inline-block cursor-default rounded-full border px-3 py-1 text-xs"
      style={{
        backgroundColor: PILL_REST.backgroundColor,
        borderColor: PILL_REST.borderColor,
        color: PILL_REST.color,
      }}
    >
      {skill}
    </span>
  );
}

function SkillPills({ items }: { items: string[] }) {
  return (
    <div className="flex flex-1 flex-wrap gap-2">
      {items.map((skill) => (
        <SkillPill key={skill} skill={skill} />
      ))}
    </div>
  );
}

function TechStackRow({ category }: { category: TechStackCategory }) {
  const Icon = category.icon;
  const iconRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const handleRowEnter = () => {
    if (iconRef.current) {
      animate(iconRef.current, {
        opacity: 1,
        scale: 1.12,
        duration: 300,
        ease: 'outQuart',
      });
    }
    if (titleRef.current) {
      animate(titleRef.current, {
        color: '#ffffff',
        duration: 300,
        ease: 'outQuart',
      });
    }
  };

  const handleRowLeave = () => {
    if (iconRef.current) {
      animate(iconRef.current, {
        opacity: 0.8,
        scale: 1,
        duration: 300,
        ease: 'outQuart',
      });
    }
    if (titleRef.current) {
      animate(titleRef.current, {
        color: 'rgba(156, 163, 175, 1)',
        duration: 300,
        ease: 'outQuart',
      });
    }
  };

  return (
    <div
      onMouseEnter={handleRowEnter}
      onMouseLeave={handleRowLeave}
      className="flex flex-col gap-4 border-b border-white/5 pb-6 last:border-b-0 last:pb-0 md:flex-row md:items-start"
    >
      <div className="flex w-full shrink-0 items-center gap-2 md:w-48">
        <span ref={iconRef} className="inline-flex shrink-0 text-primary" style={{ opacity: 0.8 }}>
          <Icon size={16} strokeWidth={2} aria-hidden />
        </span>
        <h4
          ref={titleRef}
          className="text-sm font-semibold"
          style={{ color: 'rgba(156, 163, 175, 1)' }}
        >
          {category.title}
        </h4>
      </div>
      <SkillPills items={category.items} />
    </div>
  );
}

export default function TechStack() {
  return (
    <section className="mt-6">
      <h3 className="mb-4 text-lg font-semibold text-white">Skills</h3>
      <div className="space-y-6">
        {techStack.map((category) => (
          <TechStackRow key={category.title} category={category} />
        ))}
      </div>
    </section>
  );
}
