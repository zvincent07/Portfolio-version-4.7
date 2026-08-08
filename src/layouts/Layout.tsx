import React, { useState, useEffect, useRef } from 'react';
import { animate } from 'animejs';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Footer from './Footer';
import { User, Briefcase, GraduationCap, Mail, Building2, Snowflake, IdCard } from 'lucide-react';
import { useToast } from '../components/Toast';
import Snowflakes from '../components/Snowflakes';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState('profile');
  const prevActiveNavRef = useRef('profile');
  const isTransitioningRef = useRef(false);
  const { showToast } = useToast();
  const [showSnow, setShowSnow] = useState(() => {
    const saved = localStorage.getItem('show-snowflakes');
    return saved !== 'false';
  });

  const navItems = [
    { id: 'profile', label: 'About', icon: User },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'experience', label: 'Experience', icon: Building2 },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'business-card', label: 'Business Card', icon: IdCard },
  ];

  // Sync pathname change (direct URL navigation, back/forward, or sidebar clicks)
  useEffect(() => {
    const handlePathChange = () => {
      const path = window.location.pathname.replace(/^\//, '');
      const sectionIds = ['profile', 'projects', 'experience', 'education', 'contact', 'business-card'];
      if (path === '' || path === 'profile') {
        setActiveNav('profile');
      } else if (sectionIds.includes(path)) {
        setActiveNav(path);
      }
    };
    handlePathChange();
    window.addEventListener('popstate', handlePathChange);
    return () => window.removeEventListener('popstate', handlePathChange);
  }, []);

  // Show drag-to-scroll tip once for desktop users
  useEffect(() => {
    if (window.innerWidth >= 768) {
      const hasSeenDragTip = localStorage.getItem('hasSeenDragTip');
      if (!hasSeenDragTip) {
        const timer = setTimeout(() => {
          showToast({
            message: '💡 Tip: You can click and drag anywhere to scroll!',
            duration: 6000,
          });
          localStorage.setItem('hasSeenDragTip', 'true');
        }, 3500);
        return () => clearTimeout(timer);
      }
    }
  }, [showToast]);

  // Smooth fade-out and fade-in transition when activeNav changes
  useEffect(() => {
    const fromId = prevActiveNavRef.current;
    const toId = activeNav;

    // Handle initial load (when the page first renders or no transition is needed)
    if (fromId === toId) {
      const sections = document.querySelectorAll<HTMLElement>('section[id]');
      sections.forEach((section) => {
        if (section.id === toId) {
          section.style.display = 'block';
          section.style.opacity = '1';
          section.style.transform = 'translateY(0px) scale(1)';
        } else {
          section.style.display = 'none';
          section.style.opacity = '0';
          section.style.transform = 'translateY(15px) scale(0.98)';
        }
      });
      return;
    }

    const fromEl = document.getElementById(fromId);
    const toEl = document.getElementById(toId);

    if (fromEl && toEl) {
      isTransitioningRef.current = true;
      
      // 1. Fade out the old section
      animate(fromEl, {
        opacity: 0,
        translateY: -20,
        duration: 300,
        easing: 'easeInQuad',
        complete: () => {
          fromEl.style.display = 'none';
          
          // 2. Prepare the new section
          toEl.style.display = 'block';
          toEl.style.opacity = '0';
          toEl.style.transform = 'translateY(20px)';
          window.scrollTo(0, 0);

          // 3. Fade in the new section
          animate(toEl, {
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 600,
            easing: 'easeOutQuart',
            complete: () => {
              prevActiveNavRef.current = toId;
              isTransitioningRef.current = false;
            }
          });
        }
      });
    } else {
      // Fallback in case element is not found
      const sections = document.querySelectorAll<HTMLElement>('section[id]');
      sections.forEach((section) => {
        if (section.id === toId) {
          section.style.display = 'block';
          section.style.opacity = '1';
          section.style.transform = 'translateY(0px) scale(1)';
        } else {
          section.style.display = 'none';
          section.style.opacity = '0';
          section.style.transform = 'translateY(15px) scale(0.98)';
        }
      });
      prevActiveNavRef.current = toId;
    }
  }, [activeNav]);

  // Handle scroll wheel and touch swipe to switch sections at boundaries
  useEffect(() => {
    const sectionIds = ['profile', 'projects', 'experience', 'education', 'contact', 'business-card'];
    const accumulatedDeltaRef = { current: 0 };
    let lastTime = 0;

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastTime < 1000) {
        accumulatedDeltaRef.current = 0;
        return; // transition throttle
      }
      if (isTransitioningRef.current) return;

      const activeEl = document.getElementById(activeNav);
      if (!activeEl) return;

      // Determine scroll boundaries
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5;
      const isAtTop = window.scrollY <= 5;

      if (!isAtBottom && !isAtTop) {
        accumulatedDeltaRef.current = 0;
      }

      const currentIndex = sectionIds.indexOf(activeNav);

      if (e.deltaY > 0) {
        // Scroll down
        if (isAtBottom && currentIndex < sectionIds.length - 1) {
          accumulatedDeltaRef.current += e.deltaY;
          if (accumulatedDeltaRef.current > 150) {
            const nextSection = sectionIds[currentIndex + 1];
            setActiveNav(nextSection);
            const path = nextSection === 'profile' ? '/' : `/${nextSection}`;
            window.history.pushState(null, '', path);
            window.dispatchEvent(new PopStateEvent('popstate'));
            lastTime = now;
            accumulatedDeltaRef.current = 0;
          }
        } else {
          accumulatedDeltaRef.current = 0;
        }
      } else if (e.deltaY < 0) {
        // Scroll up
        if (isAtTop && currentIndex > 0) {
          accumulatedDeltaRef.current -= e.deltaY;
          if (accumulatedDeltaRef.current > 150) {
            const prevSection = sectionIds[currentIndex - 1];
            setActiveNav(prevSection);
            const path = prevSection === 'profile' ? '/' : `/${prevSection}`;
            window.history.pushState(null, '', path);
            window.dispatchEvent(new PopStateEvent('popstate'));
            lastTime = now;
            accumulatedDeltaRef.current = 0;
          }
        } else {
          accumulatedDeltaRef.current = 0;
        }
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchStartY - touchEndY;
      const now = Date.now();
      if (now - lastTime < 1000) return;
      if (isTransitioningRef.current) return;

      const activeEl = document.getElementById(activeNav);
      if (!activeEl) return;

      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5;
      const isAtTop = window.scrollY <= 5;

      const currentIndex = sectionIds.indexOf(activeNav);

      if (diffY > 50) {
        // Swipe up -> scroll down
        if (isAtBottom && currentIndex < sectionIds.length - 1) {
          const nextSection = sectionIds[currentIndex + 1];
          setActiveNav(nextSection);
          const path = nextSection === 'profile' ? '/' : `/${nextSection}`;
          window.history.pushState(null, '', path);
          window.dispatchEvent(new PopStateEvent('popstate'));
          lastTime = now;
        }
      } else if (diffY < -50) {
        // Swipe down -> scroll up
        if (isAtTop && currentIndex > 0) {
          const prevSection = sectionIds[currentIndex - 1];
          setActiveNav(prevSection);
          const path = prevSection === 'profile' ? '/' : `/${prevSection}`;
          window.history.pushState(null, '', path);
          window.dispatchEvent(new PopStateEvent('popstate'));
          lastTime = now;
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeNav]);

  // Desktop Drag-to-Scroll
  useEffect(() => {
    let isDown = false;
    let startY = 0;
    let scrollTop = 0;

    const mouseDownHandler = (e: MouseEvent) => {
      // Ignore interactive elements
      if ((e.target as HTMLElement).closest('a, button, input, textarea, .cursor-pointer')) return;
      // Only enable on desktop screens
      if (window.innerWidth < 768) return;

      // Clear any annoying text selection immediately when clicking to drag
      window.getSelection()?.removeAllRanges();

      isDown = true;
      startY = e.clientY;
      scrollTop = window.scrollY;
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    };

    const mouseLeaveHandler = () => {
      if (!isDown) return;
      isDown = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    const mouseUpHandler = () => {
      if (!isDown) return;
      isDown = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    const mouseMoveHandler = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      window.getSelection()?.removeAllRanges(); // Keep selection clear during drag

      const y = e.clientY;
      const walk = (y - startY) * 1.5; // Scroll speed multiplier
      const intendedScrollY = scrollTop - walk;
      
      window.scrollTo(0, intendedScrollY);

      // Handle page switching by calculating overscroll (dragging past the boundaries)
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const overscrollDown = intendedScrollY - maxScroll;
      const overscrollUp = 0 - intendedScrollY;
      
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5;
      const isAtTop = window.scrollY <= 5;

      const sectionIds = ['profile', 'projects', 'experience', 'education', 'contact', 'business-card'];
      const currentIndex = sectionIds.indexOf(activeNav);

      if (isAtBottom && overscrollDown > 150 && currentIndex < sectionIds.length - 1) {
        const nextSection = sectionIds[currentIndex + 1];
        window.history.pushState(null, '', nextSection === 'profile' ? '/' : `/${nextSection}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
        
        isDown = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      } else if (isAtTop && overscrollUp > 150 && currentIndex > 0) {
        const prevSection = sectionIds[currentIndex - 1];
        window.history.pushState(null, '', prevSection === 'profile' ? '/' : `/${prevSection}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
        
        isDown = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    document.addEventListener('mousedown', mouseDownHandler);
    document.addEventListener('mouseleave', mouseLeaveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
    document.addEventListener('mousemove', mouseMoveHandler, { passive: false });

    return () => {
      document.removeEventListener('mousedown', mouseDownHandler);
      document.removeEventListener('mouseleave', mouseLeaveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
      document.removeEventListener('mousemove', mouseMoveHandler);
    };
  }, [activeNav]);

  return (
    <div className="relative flex min-h-screen w-full md:w-[95%] md:max-w-[1400px] mx-auto bg-[#111823]/70 md:border-x border-white/5 md:shadow-[0_0_30px_rgba(0,0,0,0.3)]">
      {showSnow && <Snowflakes />}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar />
        
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 w-full h-14 bg-[#111823]/95 backdrop-blur-md border-b border-white/5 z-40 px-5 flex items-center justify-end">
          <div className="flex items-center gap-4">
            <a href="https://github.com/zvincent07" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/john-vincent-laylo-322b023a6/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#0077b5] transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-8 pt-6 sm:pt-8 pb-32 md:pb-16 flex flex-col gap-8 md:gap-12 w-full">
          {children}
        </main>
        <Footer />
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#111823]/95 backdrop-blur-md border-t border-white/5 px-4 flex items-center justify-start gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <React.Fragment key={item.id}>
              {item.id === 'business-card' && (
                <div className="h-6 w-[1px] bg-white/10 mx-1 shrink-0" />
              )}
              <a
              href={item.id === 'profile' ? '/' : `/${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveNav(item.id);
                const path = item.id === 'profile' ? '/' : `/${item.id}`;
                window.history.pushState(null, '', path);
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 relative ${
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-white/60 hover:text-white active:scale-95'
              }`}
            >
              <Icon size={20} className="transition-transform duration-300" />
            </a>
            </React.Fragment>
          );
        })}
        
        {/* Divider */}
        <div className="h-6 w-[1px] bg-white/10" />

        {/* Open CV */}
        <a
          href="/john-vincent-laylo-cv.pdf"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            showToast({
              message: 'Opening Curriculum Vitae...',
              variant: 'success',
              duration: 3000,
            });
          }}
          className="flex flex-col items-center justify-center w-12 h-12 rounded-xl text-white/60 hover:text-white hover:bg-white/5 active:scale-95 transition-all duration-300"
          title="Open CV"
        >
          <span className="text-[11px] font-mono font-bold">CV</span>
        </a>

        {/* Open Resume */}
        <a
          href="/john-vincent-laylo-resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            showToast({
              message: 'Opening Resume...',
              variant: 'success',
              duration: 3000,
            });
          }}
          className="flex flex-col items-center justify-center w-12 h-12 rounded-xl text-white/60 hover:text-white hover:bg-white/5 active:scale-95 transition-all duration-300"
          title="Open Resume"
         >
           <span className="text-[11px] font-mono font-bold">RES</span>
         </a>
      </nav>

      {/* Snowflakes Toggle Button */}
      <button
        onClick={() => {
          const nextVal = !showSnow;
          setShowSnow(nextVal);
          localStorage.setItem('show-snowflakes', String(nextVal));
        }}
        className="fixed right-4 bottom-20 md:right-6 md:bottom-6 z-50 p-2.5 rounded-full bg-[#1c2330]/90 border border-white/10 hover:border-primary/50 text-white/80 hover:text-primary backdrop-blur-md shadow-lg transition-all duration-300 active:scale-95 flex items-center justify-center"
        title={showSnow ? "Disable Snowflakes" : "Enable Snowflakes"}
      >
        <Snowflake size={16} className={showSnow ? "text-primary animate-pulse" : "text-white/40"} />
      </button>
    </div>
  );
}
