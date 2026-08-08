export type DomainIconId = 'monitor' | 'database' | 'door-open' | 'smartphone' | 'shield' | 'globe';

export interface ProjectDomain {
  label: string;
  icon: DomainIconId;
}

export interface FeaturedProject {
  type: 'featured';
  title: string;
  badge?: string;
  domain: ProjectDomain;
  tech: string[];
  description: string;
  challenge: string;
  fix: string;
  href: string;
}

export interface CompactProject {
  type: 'compact';
  title: string;
  domain: ProjectDomain;
  tech: string[];
  description: string;
  href: string;
}

export type Project = FeaturedProject | CompactProject;

/** Manually ordered — Dayframe first (latest). */
export const projects: Project[] = [
  {
    type: 'featured',
    title: 'Kasapi Connect',
    badge: 'Startup',
    domain: { label: 'Desktop App', icon: 'monitor' },
    tech: ['Tauri', 'React', 'SQLite', 'Tailwind CSS'],
    description: 'The ultimate smart gym management software built to arm independent gyms with enterprise firepower.',
    challenge: 'Local gyms were being bled dry by expensive SaaS subscriptions while struggling with outdated pen-and-paper tracking.',
    fix: 'Developed an offline-first desktop application with a lifetime license, featuring automated QR attendance, Point of Sale, and secure SQLite data storage.',
    href: 'https://kasapi-connect.vercel.app/',
  },
  {
    type: 'compact',
    title: 'Kasapi Connect Landing Page',
    domain: { label: 'Marketing', icon: 'monitor' },
    tech: ['React 19', 'Tailwind v4', 'Anime.js'],
    description: 'High-conversion marketing landing page with custom scroll animations and a premium glassmorphism design.',
    href: 'https://kasapi-connect.vercel.app/',
  },
  {
    type: 'featured',
    title: 'Dayframe',
    badge: 'New',
    domain: { label: 'Desktop App', icon: 'monitor' },
    tech: ['Next.js 15', 'Tauri', 'Rust', 'MongoDB', 'TypeScript', 'Tailwind', 'Shadcn'],
    description:
      'A desktop-native productivity app built for personal use that uses Next.js as a local daemon and Tauri as the native wrapper for a seamless journaling experience.',
    challenge:
      'Web-first journaling tools feel disconnected from the OS—slow launches, no offline-native feel, and poor desktop integration.',
    fix: 'Bridged Next.js with Tauri and Rust so the UI stays modern while the shell is truly native: fast startup, local daemon architecture, and a focused writing flow.',
    href: 'https://github.com/zvincent07/dayframe',
  },
  {
    type: 'featured',
    title: 'InvenTrack',
    domain: { label: 'Web App', icon: 'globe' },
    tech: ['PostgreSQL', 'Express', 'React', 'Node', 'Tailwind', 'RBAC'],
    description:
      'Centralized asset lifecycle management system designed to eliminate manual tracking and auditing bottlenecks.',
    challenge:
      'Asset records lived in spreadsheets with no audit trail, causing mismatches during inventory cycles and slow approvals.',
    fix: 'Built a centralized GSO inventory platform with RBAC, structured lifecycle states, and a single source of truth for auditors and staff.',
    href: '/Updated CAPSTONE - Inventrack Manuscript.docx.pdf',
  },
  {
    type: 'featured',
    title: 'QRoom',
    domain: { label: 'Web App', icon: 'globe' },
    tech: ['MySQL', 'Express', 'React', 'Node', 'Bootstrap', 'QR'],
    description:
      'Real-time room availability dashboard featuring QR scanning for rapid check-ins and check-outs.',
    challenge:
      'Students and professors were struggling with double bookings and inaccurate whiteboard schedules.',
    fix: 'Designed dynamic database schemas and live REST endpoints to instantly reflect classroom bookings, improving space utilization across campus.',
    href: 'https://qroom-omega.vercel.app/',
  },

  {
    type: 'compact',
    title: 'SoundSprint',
    domain: { label: 'Mobile', icon: 'smartphone' },
    tech: ['Flutter', 'Dart'],
    description:
      'Mobile productivity app. Contributed to UI state management and cross-platform responsive layouts.',
    href: 'https://github.com/xKobeni/SoundSprint',
  },
  {
    type: 'compact',
    title: 'RBAC Admin Dashboard',
    domain: { label: 'Security', icon: 'shield' },
    tech: ['MERN', 'JWT', 'Security'],
    description:
      'Open-source MERN boilerplate focused on secure Role-Based Access Control and authentication.',
    href: 'https://github.com/zvincent07/Login-Admin-Dashboard-Themeplate',
  },
];
