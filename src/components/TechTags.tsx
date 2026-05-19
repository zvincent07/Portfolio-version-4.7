interface TechTagsProps {
  items: string[];
  className?: string;
}

export default function TechTags({ items, className = '' }: TechTagsProps) {
  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {items.map((tech) => (
        <span
          key={tech}
          className="text-[10px] font-medium px-2 py-0.5 border border-zinc-800 rounded-none bg-zinc-900 text-zinc-400"
        >
          {tech}
        </span>
      ))}
    </div>
  );
}
