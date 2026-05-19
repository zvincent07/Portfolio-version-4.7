interface SectionHeaderProps {
  title: string;
}

export default function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <h2 className="text-2xl font-bold mt-0 mb-6 text-white inline-block relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-10 after:h-1 after:bg-primary">
      {title}
    </h2>
  );
}
