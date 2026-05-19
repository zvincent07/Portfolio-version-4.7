export type DomainIconId = 'monitor' | 'database' | 'door-open' | 'smartphone' | 'shield';

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
    title: 'Dayframe',
    badge: 'New',
    domain: { label: 'Desktop', icon: 'monitor' },
    tech: ['Next.js 15', 'Tauri', 'Rust', 'MongoDB', 'TypeScript', 'Tailwind', 'Shadcn'],
    description:
      'A desktop-native productivity app that uses Next.js as a local daemon and Tauri as the native wrapper for a seamless journaling experience.',
    challenge:
      'Web-first journaling tools feel disconnected from the OS—slow launches, no offline-native feel, and poor desktop integration.',
    fix: 'Bridged Next.js with Tauri and Rust so the UI stays modern while the shell is truly native: fast startup, local daemon architecture, and a focused writing flow.',
    href: 'https://github.com/zvincent07/dayframe',
  },
  {
    type: 'featured',
    title: 'InvenTrack',
    domain: { label: 'Data & RBAC', icon: 'database' },
    tech: ['PostgreSQL', 'Express', 'React', 'Node', 'Tailwind', 'RBAC'],
    description:
      'Centralized asset lifecycle management system designed to eliminate manual tracking and auditing bottlenecks.',
    challenge:
      'Asset records lived in spreadsheets with no audit trail, causing mismatches during inventory cycles and slow approvals.',
    fix: 'Built a centralized GSO inventory platform with RBAC, structured lifecycle states, and a single source of truth for auditors and staff.',
    href: 'https://inventrackgso.onrender.com',
  },
  {
    type: 'featured',
    title: 'QRoom',
    domain: { label: 'Campus', icon: 'door-open' },
    tech: ['MySQL', 'Express', 'React', 'Node', 'Bootstrap', 'QR'],
    description:
      'Real-time room availability dashboard featuring QR scanning for instant status checks and condition reporting.',
    challenge:
      'Room status was updated manually on whiteboards, so students and staff had no reliable real-time view of availability.',
    fix: 'Delivered a live dashboard with QR-based check-ins so anyone can verify room state and report issues in seconds.',
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
