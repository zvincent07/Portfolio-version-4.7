import { useRef, useLayoutEffect, useState } from 'react';
import COEImage from '../assets/COE.jpg';
import { animate, stagger } from 'animejs';
import SectionHeader from './SectionHeader';
import { SECTION_SHELL } from '../constants/layout';
import ImageModal from './ImageModal';

interface BulletPoint {
  title: string;
  text: string;
}

interface Experience {
  period: string;
  role: string;
  company: string;
  details: BulletPoint[];
  certificateImage?: string;
}

const experiences: Experience[] = [
  {
    period: '2026 - Present',
    role: 'Founder & Lead Developer',
    company: 'Kasapi Connect',
    details: [
      {
        title: 'System Architecture',
        text: 'Architected and built an offline-first smart gym management desktop application using Tauri and React.',
      },
      {
        title: 'Backend & Database',
        text: 'Designed robust data models and integrated local SQLite storage for seamless, lightning-fast offline operation.',
      },
      {
        title: 'Core Features',
        text: 'Developed automated QR check-ins, an integrated Point of Sale (POS) system, and instant analytics dashboards.',
      },
      {
        title: 'Product Strategy',
        text: 'Directed the UI/UX design of a high-conversion landing page and orchestrated the product launch.',
      },
    ],
  },
  {
    period: '2026',
    role: 'Technical Intern',
    company: 'COMELEC (Government/Public Sector)',
    certificateImage: COEImage,
    details: [
      {
        title: 'System Operations',
        text: 'Facilitated voter registration processes and managed certificate issuance, ensuring 100% data accuracy and efficient document turnaround.',
      },
      {
        title: 'Technical Support',
        text: 'Provided Tier-1 IT support, resolving hardware and software issues for staff and public-facing workstations to minimize operational downtime.',
      },
      {
        title: 'Workstation Setup',
        text: 'Assisted in assembling, configuring, and deploying PC hardware and workstations for staff and public use.',
      },
      {
        title: 'Service Management',
        text: 'Managed public inquiries and form-based service requests, acting as a bridge between technical systems and user-friendly service delivery.',
      },
    ],
  },
  {
    period: '2022 - Present',
    role: 'Freelance Technical Consultant',
    company: 'Self-Employed',
    details: [
      {
        title: 'Web Development',
        text: 'Designed, built, and deployed responsive web applications and custom user interfaces for various clients.',
      },
      {
        title: 'IT Support & Troubleshooting',
        text: 'Provided freelance technical support, troubleshooting hardware, software, and configuration issues for local clients.',
      },
      {
        title: 'Technical Research',
        text: 'Conducted detailed domain research and system requirements analysis for academic and business projects.',
      },
      {
        title: 'Technical Documentation',
        text: 'Authored comprehensive technical documentation, project specifications, and user guides for various clients.',
      },
      {
        title: 'Network Engineering',
        text: 'Designed and simulated complex network topologies using Cisco Packet Tracer to support academic infrastructure projects.',
      },
      {
        title: 'Scripting & Automation',
        text: 'Developed Python-based data processing scripts in Google Colab to automate repetitive tasks for various clients.',
      },
      {
        title: 'UI/UX Design',
        text: 'Translated business requirements into intuitive wireframes and interactive prototypes using Figma.',
      },
    ],
  },
];

interface ExperienceItemProps {
  job: Experience;
}

function ExperienceItem({ job }: ExperienceItemProps) {
  const itemRef = useRef<HTMLLIElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMouseEnter = () => {
    if (!itemRef.current) return;
    animate(itemRef.current, {
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      paddingLeft: '24px',
      borderLeftColor: '#ff4654',
      duration: 300,
      easing: 'easeOutQuad',
    });
  };

  const handleMouseLeave = () => {
    if (!itemRef.current) return;
    animate(itemRef.current, {
      backgroundColor: 'rgba(255, 255, 255, 0)',
      paddingLeft: '20px',
      borderLeftColor: 'rgba(255, 70, 84, 0.4)',
      duration: 300,
      easing: 'easeOutQuad',
    });
  };

  return (
    <li
      ref={itemRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="border-l-2 pl-4 sm:pl-5 py-3 pr-2 sm:pr-4 rounded-r-lg"
      style={{
        borderLeftColor: 'rgba(255, 70, 84, 0.4)',
        backgroundColor: 'rgba(255, 255, 255, 0)',
      }}
    >
      <p className="text-xs font-medium text-primary m-0 mb-1">{job.period}</p>
      <div className="flex items-center gap-3 mb-1">
        <h3 className="text-lg font-semibold text-white m-0">{job.role}</h3>
        {job.certificateImage && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-white/40 hover:text-primary transition-colors focus:outline-none"
            title="View Certificate"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </button>
        )}
      </div>
      <p className="text-sm text-white/60 m-0 mb-3">{job.company}</p>
      <ul className="list-none p-0 m-0 flex flex-col gap-3 sm:gap-2.5">
        {job.details.map((detail, idx) => (
          <li key={idx} className="text-sm text-white/80 leading-relaxed block sm:flex sm:flex-row sm:items-start gap-1">
            <span className="text-white font-semibold shrink-0 inline sm:inline-block sm:min-w-[150px] md:min-w-[200px] mr-1.5 sm:mr-0">
              {detail.title}:
            </span>
            <span className="inline">{detail.text}</span>
          </li>
        ))}
      </ul>

      {job.certificateImage && (
        <ImageModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          imageSrc={job.certificateImage}
          altText={`${job.role} Certificate`}
        />
      )}
    </li>
  );
}

export default function ExperienceSection() {
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
    <section id="experience" className={SECTION_SHELL}>
      <SectionHeader title="Experience" />
      <ul ref={listRef} className="list-none p-0 m-0 flex flex-col gap-8 w-full">
        {experiences.map((job) => (
          <ExperienceItem key={`${job.company}-${job.period}`} job={job} />
        ))}
      </ul>
    </section>
  );
}
