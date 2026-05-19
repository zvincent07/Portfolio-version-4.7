import { useState, useEffect, useRef } from 'react';
import { animate } from 'animejs';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Footer from './Footer';
import { User, Briefcase, GraduationCap, Mail, Building2, Snowflake } from 'lucide-react';
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
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'experience', label: 'Experience', icon: Building2 },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  // Sync pathname change (direct URL navigation, back/forward, or sidebar clicks)
  useEffect(() => {
    const handlePathChange = () => {
      const path = window.location.pathname.replace(/^\//, '');
      const sectionIds = ['profile', 'projects', 'experience', 'education', 'contact'];
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
        translateY: -15,
        scale: 0.98,
        duration: 300,
        easing: 'easeInQuad',
        complete: () => {
          fromEl.style.display = 'none';
          
          // 2. Prepare the new section
          toEl.style.display = 'block';
          toEl.style.opacity = '0';
          toEl.style.transform = 'translateY(15px) scale(0.98)';
          window.scrollTo(0, 0);

          // 3. Fade in the new section
          animate(toEl, {
            opacity: [0, 1],
            translateY: [15, 0],
            scale: [0.98, 1],
            duration: 400,
            easing: 'easeOutQuad',
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
    const sectionIds = ['profile', 'projects', 'experience', 'education', 'contact'];
    let lastTime = 0;

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastTime < 1000) return; // transition throttle
      if (isTransitioningRef.current) return;

      const activeEl = document.getElementById(activeNav);
      if (!activeEl) return;

      // Determine scroll boundaries
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5;
      const isAtTop = window.scrollY <= 5;

      const currentIndex = sectionIds.indexOf(activeNav);

      if (e.deltaY > 0) {
        // Scroll down
        if (isAtBottom && currentIndex < sectionIds.length - 1) {
          const nextSection = sectionIds[currentIndex + 1];
          setActiveNav(nextSection);
          const path = nextSection === 'profile' ? '/' : `/${nextSection}`;
          window.history.pushState(null, '', path);
          window.dispatchEvent(new PopStateEvent('popstate'));
          lastTime = now;
        }
      } else if (e.deltaY < 0) {
        // Scroll up
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
        <main className="flex-1 px-4 sm:px-8 pt-6 sm:pt-8 pb-24 md:pb-12 flex flex-col gap-8 md:gap-12 w-full">
          {children}
        </main>
        <Footer />
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#111823]/95 backdrop-blur-md border-t border-white/5 px-4 flex items-center justify-around z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <a
              key={item.id}
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
          );
        })}
        
        {/* Divider */}
        <div className="h-6 w-[1px] bg-white/10" />

        {/* Download CV */}
        <a
          href="/john-vincent-laylo-cv.pdf"
          download="john-vincent-laylo-cv.pdf"
          onClick={() => {
            showToast({
              message: 'Curriculum Vitae downloaded successfully.',
              variant: 'success',
              duration: 3000,
            });
          }}
          className="flex items-center justify-center w-12 h-12 rounded-xl text-white/80 hover:text-primary active:scale-95 transition-all duration-300 bg-white/5 border border-white/5 hover:border-primary/30"
          title="Download CV"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
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
