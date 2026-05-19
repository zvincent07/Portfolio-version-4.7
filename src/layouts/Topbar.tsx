import { useRef } from 'react';
import { Mail } from 'lucide-react';
import { animate } from 'animejs';

export default function Topbar() {
  const mailBtnRef = useRef<HTMLAnchorElement>(null);

  const handleMouseEnter = () => {
    if (!mailBtnRef.current) return;
    animate(mailBtnRef.current, {
      y: -2,
      backgroundColor: '#ba3a46', // secondary
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      duration: 300,
      ease: 'outQuart'
    });
  };

  const handleMouseLeave = () => {
    if (!mailBtnRef.current) return;
    animate(mailBtnRef.current, {
      y: 0,
      backgroundColor: '#ff4654', // primary
      boxShadow: '0 0px 0px 0px rgba(0, 0, 0, 0)',
      duration: 300,
      ease: 'outQuart'
    });
  };

  return (
    <header className="hidden md:block sticky top-0 bg-[#111823]/70 backdrop-blur-md border-b border-white/10 z-50">
      <div className="w-full h-14 px-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5 bg-gray-900/50 px-3.5 py-1.5 rounded-xl border border-white/5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-50"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-sm text-white/80 font-medium">Open for freelance work</span>
        </div>

        <a 
          ref={mailBtnRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          href="https://mail.google.com/mail/?view=cm&fs=1&to=zvincent.dev@gmail.com" 
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-none"
        >
          <Mail size={16} />
          <span>Mail Me</span>
        </a>
      </div>
    </header>
  );
}
