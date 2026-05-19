import { ExternalLink } from 'lucide-react';

interface ExternalLinkIconProps {
  href: string;
  label: string;
  className?: string;
}

export default function ExternalLinkIcon({ href, label, className = '' }: ExternalLinkIconProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`inline-flex items-center justify-center text-zinc-500 transition-colors duration-200 hover:text-red-400 ${className}`}
    >
      <ExternalLink size={16} strokeWidth={2} />
    </a>
  );
}
