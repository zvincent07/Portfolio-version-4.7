import { Code2, LineChart, Wrench } from 'lucide-react';

export default function ServicesHighlight() {
  const services = [
    {
      title: 'Developer',
      icon: Code2,
      description: 'Building scalable, high-performance web and desktop applications using modern frameworks.'
    },
    {
      title: 'Business Analyst',
      icon: LineChart,
      description: 'Translating complex business requirements into intuitive workflows and robust system architectures.'
    },
    {
      title: 'IT Support',
      icon: Wrench,
      description: 'Diagnosing, troubleshooting, and maintaining IT infrastructure to ensure zero operational downtime.'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 mb-4">
      {services.map((svc) => {
        const Icon = svc.icon;
        return (
          <div key={svc.title} className="bg-zinc-900/40 border border-white/5 rounded-xl p-5 hover:bg-zinc-900/80 hover:border-primary/30 transition-all duration-300 flex flex-col gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
              <Icon size={20} />
            </div>
            <h3 className="text-white font-bold text-base m-0">{svc.title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed m-0">
              {svc.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
