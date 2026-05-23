import { useRef, useLayoutEffect } from 'react';
import { animate, stagger } from 'animejs';
import SectionHeader from './SectionHeader';
import { SECTION_SHELL } from '../constants/layout';

interface EducationEntry {
  period: string;
  degree: string;
  major?: string;
  school: string;
  details: string;
  courses?: string[];
}

const education: EducationEntry[] = [
  {
    period: '2022 — 2026',
    degree: 'Bachelor of Science in Information Technology',
    major: 'Major in Business Analytics',
    school: 'Batangas State University',
    details: 'Specialized in data-driven decision making and software engineering. Bridged the gap between raw data and actionable business insights through full-stack development.',
    courses: [
      'Fundamentals of Business Analytics',
      'Fundamentals of Analytics Modeling',
      'Fundamentals of Enterprise Data Management',
      'Analytics Techniques & Tools',
      'Analytics Application'
    ]
  },
  {
    period: '2020 — 2022',
    degree: 'Senior High School Diploma',
    major: 'Science, Technology, Engineering & Mathematics (STEM)',
    school: 'The Mabini Academy',
    details: 'Built a strong foundation in logic, calculus, and scientific research methods, preparing for intensive technical coursework in university.'
  }
];

interface EducationItemProps {
  entry: EducationEntry;
}

function EducationItem({ entry }: EducationItemProps) {
  const itemRef = useRef<HTMLLIElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (itemRef.current) {
      animate(itemRef.current, {
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        paddingLeft: '38px',
        duration: 300,
        easing: 'easeOutQuad',
      });
    }
    if (markerRef.current) {
      animate(markerRef.current, {
        translateX: '-50%',
        scale: 1.3,
        backgroundColor: '#ff4654',
        duration: 300,
        easing: 'easeOutQuad',
      });
    }
  };

  const handleMouseLeave = () => {
    if (itemRef.current) {
      animate(itemRef.current, {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        paddingLeft: '32px',
        duration: 300,
        easing: 'easeOutQuad',
      });
    }
    if (markerRef.current) {
      animate(markerRef.current, {
        translateX: '-50%',
        scale: 1,
        backgroundColor: '#ff4654',
        duration: 300,
        easing: 'easeOutQuad',
      });
    }
  };

  return (
    <li
      ref={itemRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative pl-8 py-3 pr-4 rounded-r-lg"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0)',
      }}
    >
      {/* Timeline Marker */}
      <div
        ref={markerRef}
        className="absolute left-0 top-[20px] w-2.5 h-2.5 bg-primary rounded-full border-4 border-[#111823] box-content"
        style={{
          transform: 'translateX(-50%) scale(1)',
          transformOrigin: 'center',
        }}
      />
      
      <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider m-0 mb-1">{entry.period}</p>
      <h3 className="text-lg font-bold text-white m-0 leading-snug">{entry.degree}</h3>
      {entry.major && <p className="text-sm font-medium text-white/50 m-0 mb-1">{entry.major}</p>}
      <p className="text-sm font-medium text-red-400 m-0 mb-2">{entry.school}</p>
      <p className="text-sm text-zinc-400 leading-relaxed w-full m-0">{entry.details}</p>
      
      {entry.courses && (
        <div className="mt-3.5 flex flex-wrap gap-2 w-full">
          {entry.courses.map((course) => (
            <span
              key={course}
              className="inline-block rounded-full bg-white/[0.03] border border-white/5 px-2.5 py-0.5 text-xs text-white/60"
            >
              {course}
            </span>
          ))}
        </div>
      )}
    </li>
  );
}

export default function EducationSection() {
  const listRef = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    if (!listRef.current) return;

    const items = Array.from(listRef.current.children) as HTMLElement[];
    
    // Initial state
    items.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(items, {
              opacity: [0, 1],
              translateY: [20, 0],
              duration: 800,
              delay: stagger(150),
              easing: 'easeOutQuart',
            });
          } else {
            items.forEach(item => {
              item.style.opacity = '0';
              item.style.transform = 'translateY(20px)';
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(listRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="education" className={SECTION_SHELL}>
      <SectionHeader title="Education" />
      <div className="w-full py-4">
        <ul ref={listRef} className="relative border-l border-zinc-800 list-none p-0 m-0 ml-3 space-y-12 w-full">
          {education.map((entry) => (
            <EducationItem key={`${entry.school}-${entry.period}`} entry={entry} />
          ))}
        </ul>
      </div>
    </section>
  );
}
