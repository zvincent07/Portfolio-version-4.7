import type { LucideIcon } from 'lucide-react';
import { Database, DoorOpen, MonitorSmartphone, ShieldCheck, Smartphone } from 'lucide-react';
import type { DomainIconId } from '../data/projects';

const iconMap: Record<DomainIconId, LucideIcon> = {
  monitor: MonitorSmartphone,
  database: Database,
  'door-open': DoorOpen,
  smartphone: Smartphone,
  shield: ShieldCheck,
};

interface ProjectDomainColumnProps {
  label: string;
  icon: DomainIconId;
}

export default function ProjectDomainColumn({ label, icon }: ProjectDomainColumnProps) {
  const Icon = iconMap[icon];

  return (
    <div className="flex items-start gap-2.5 md:pr-2">
      <Icon size={18} strokeWidth={2} className="shrink-0 text-red-400 mt-0.5" aria-hidden />
      <span className="text-sm font-bold text-white leading-snug tracking-tight">{label}</span>
    </div>
  );
}
