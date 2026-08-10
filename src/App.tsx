import { useRef, useEffect, useState } from 'react';
import { animate, splitText, stagger, createTimeline } from 'animejs';
import Layout from './layouts/Layout';
import ProjectsSection from './components/ProjectsSection';
import TechStack from './components/TechStack';
import ServicesHighlight from './components/ServicesHighlight';
import SectionHeader from './components/SectionHeader';
import ExperienceSection from './components/ExperienceSection';
import EducationSection from './components/EducationSection';
import ContactSection from './components/ContactSection';
import BusinessCardSection from './components/BusinessCardSection';
import { BadgeCheck } from 'lucide-react';
import { SCROLL_MT } from './constants/layout';
import bannerGif from './assets/Jinx Fishbones GIF by League of Legends.gif';
import loadingPic from './assets/Joan of Arc.png';
import profilePic from './assets/1x1 size picture.png';
import { ToastProvider } from './components/Toast';

function App() {
  const textRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<SVGSVGElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactSectionRef = useRef<HTMLElement>(null);
  const bannerContainerRef = useRef<HTMLDivElement>(null);
  const avatarContainerRef = useRef<HTMLDivElement>(null);

  const loadingAvatarRef = useRef<HTMLDivElement>(null);
  const loadingTextRef = useRef<HTMLParagraphElement>(null);
  const loadingOverlayRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasLoadedRef = useRef(false);

  // Initial loading screen & transition
  useEffect(() => {
    if (hasLoadedRef.current) return;

    const timer = setTimeout(() => {
      if (!loadingOverlayRef.current) {
        setIsLoading(false);
        hasLoadedRef.current = true;
        return;
      }

      // Smoothly fade out the entire loading screen at once
      animate(loadingOverlayRef.current, {
        opacity: 0,
        duration: 800,
        easing: 'easeOutSine',
        complete: () => {
          setIsLoading(false);
          hasLoadedRef.current = true;
        }
      });
    }, 1200); // Balanced initial load

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Restart typewriter and animate banner/avatar when Profile section becomes active
  useEffect(() => {
    if (isLoading) return; // Wait for initial loading animation to complete

    const handlePathChange = () => {
      const path = window.location.pathname.replace(/^\//, '');
      if (path === '' || path === 'profile') {
        // Restart typewriter if timeline is loaded
        if (textRef.current && (textRef.current as any)._tl) {
          (textRef.current as any)._tl.restart();
        }

        // Animate banner container
        if (bannerContainerRef.current) {
          animate(bannerContainerRef.current, {
            opacity: [0, 1],
            translateY: [-20, 0],
            duration: 1000,
            delay: 150,
            easing: 'easeOutQuart',
          });
        }

        // Only run normal avatar animate if it wasn't just animated by the loader
        if (avatarContainerRef.current && hasLoadedRef.current) {
          animate(avatarContainerRef.current, {
            opacity: [0, 1],
            scale: [0.8, 1],
            duration: 1000,
            delay: 350,
            easing: 'easeOutBack',
          });
        }
      }
    };

    handlePathChange();
    window.addEventListener('popstate', handlePathChange);
    return () => {
      window.removeEventListener('popstate', handlePathChange);
    };
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) return;
    if (!textRef.current) return;

    // We need to delay the animation slightly to ensure React has fully painted the DOM,
    // otherwise splitText might calculate lines incorrectly or fail to render.
    const timer = setTimeout(() => {
      // Remove the 'invisible' class directly
      textRef.current!.classList.remove('invisible');
      textRef.current!.style.opacity = '1';
      textRef.current!.style.visibility = 'visible';

      // Ensure the child text spans are visible before splitting
      const spans = textRef.current!.querySelectorAll('span');
      spans.forEach(span => {
        span.style.opacity = '1';
        span.style.visibility = 'visible';
      });

      // Exact code from Anime.js example
      const { words, chars } = splitText(textRef.current!, {
        words: { wrap: 'clip' },
        chars: true
      });

      const tl = createTimeline({
        loop: true,
        defaults: { ease: 'inOut(3)', duration: 650 }
      })
        .add(words, {
          opacity: [0, 1], // Ensure words start from invisible
          y: [(el: HTMLElement) => {
            const line = el.dataset.line ? parseInt(el.dataset.line) : 0;
            return line % 2 ? '100%' : '-100%';
          }, '0%'],
        }, stagger(125))
        .add(chars, {
          opacity: [0, 1], // Ensure chars start from invisible
          y: [(el: HTMLElement) => {
            const line = el.dataset.line ? parseInt(el.dataset.line) : 0;
            return line % 2 ? '100%' : '-100%';
          }, '0%'],
        }, stagger(10, { from: 'random' }))

      // Add badge animation
      if (badgeRef.current) {
        tl.add(badgeRef.current, {
          opacity: [0, 1],
          scale: [0, 1],
          rotate: [45, 0],
        }, '-=400');
      }

      // Fade out to loop cleanly after staying visible for 8 seconds
      const fadeOutTargets: any[] = [chars];
      if (badgeRef.current) fadeOutTargets.push(badgeRef.current);

      tl.add(fadeOutTargets, {
        opacity: 0,
        y: -10,
        duration: 500,
        delay: 4000,
        easing: 'easeInOutSine'
      })
        .init();

      // Store timeline for cleanup
      (textRef.current as any)._tl = tl;
    }, 50);

    return () => {
      clearTimeout(timer);
      if (textRef.current && (textRef.current as any)._tl) {
        (textRef.current as any)._tl.pause();
      }
    };
  }, [isLoading]);

  // About Me & Contact Scroll Animations
  useEffect(() => {
    if (isLoading) return;

    const targets = [aboutRef.current, contactSectionRef.current].filter(Boolean) as HTMLElement[];

    const observers = targets.map(target => {
      // Initial state
      target.style.opacity = '0';
      target.style.transform = 'translateY(20px)';

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animate(target, {
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 600,
                easing: 'easeOutQuart',
              });
            } else {
              target.style.opacity = '0';
              target.style.transform = 'translateY(20px)';
            }
          });
        },
        { threshold: 0.05 }
      );
      observer.observe(target);
      return observer;
    });

    return () => observers.forEach(o => o.disconnect());
  }, [isLoading]);

  return (
    <ToastProvider>
      {isLoading && (
        <div
          ref={loadingOverlayRef}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
        >
          {/* Solid background overlay that we animate separately */}
          <div
            id="loading-bg"
            className="absolute inset-0 bg-[#111823]"
          />

          {/* Content overlay containing the avatar and letter-by-letter loading text */}
          <div className="relative flex flex-col items-center z-10 pointer-events-none">
            <div className="relative flex items-center justify-center">
              {/* The Avatar */}
              <div
                ref={loadingAvatarRef}
                className="w-[86px] h-[86px] rounded-full bg-slate-800 flex items-center justify-center text-white relative z-20 overflow-hidden"
              >
                <img src={loadingPic} alt="Loading..." className="w-full h-full object-cover" />
              </div>

              {/* Ring and Text that fade out */}
              <div ref={loadingTextRef} className="absolute flex flex-col items-center justify-center z-10 w-[200px] h-[200px]">
                {/* Sleek Spinner Ring */}
                <div className="w-[106px] h-[106px] rounded-full border-[2px] border-white/5 border-t-primary border-l-primary animate-spin" />
                
                {/* Text below */}
                <span className="absolute bottom-[20px] text-white/40 font-mono text-[10px] tracking-[0.3em] uppercase pl-1">
                  Loading
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      <Layout>
        <section id="profile" className={`${SCROLL_MT} mb-0`}>
          <div ref={bannerContainerRef} className="w-full h-[220px] overflow-hidden relative rounded-xl shadow-lg" style={{ opacity: 0 }}>
            <img
              src={bannerGif}
              alt="Profile Banner"
              className="w-full h-full object-cover block scale-100 [object-position:68%_26%]"
            />
            
            {/* Mobile floating social icons over banner */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-20 md:hidden">
              <a href="https://github.com/zvincent07" target="_blank" rel="noopener noreferrer" className="bg-black/40 backdrop-blur-md text-white/80 hover:text-white p-2 rounded-full border border-white/10 transition-all active:scale-95 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/john-vincent-laylo-322b023a6/" target="_blank" rel="noopener noreferrer" className="bg-black/40 backdrop-blur-md text-white/80 hover:text-white p-2 rounded-full border border-white/10 transition-all active:scale-95 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center px-4 sm:px-8 py-0 relative -mt-[60px] z-10 mb-10 md:mb-12">
            <div ref={avatarContainerRef} className="relative w-[120px] h-[120px] flex items-center justify-center shrink-0 sm:mr-8 mb-4 sm:mb-0" style={{ opacity: 0 }}>
              <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-white relative z-10 shadow-[0_0_15px_rgba(255,70,84,0.2)] border-[3px] border-primary overflow-hidden">
                <img src={profilePic} alt="Profile Picture" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-start relative">
              <p ref={textRef} className="text-[1.35rem] sm:text-[1.8rem] m-0 text-white font-bold tracking-[0.06em] leading-[1.35] text-center sm:text-left" style={{ opacity: 0 }}>
                <span className="relative inline-block pr-7 sm:pr-8 whitespace-nowrap">
                  John Vincent G. Laylo
                  <BadgeCheck ref={badgeRef} className="text-primary fill-white opacity-0 absolute right-0 top-1/2 -translate-y-1/2" size={20} />
                </span>
                <br />
                <span className="text-[0.85rem] sm:text-[1.1rem] text-white/60 font-medium mt-1 sm:mt-0 inline-block whitespace-nowrap">Developer &bull; Business Analyst &bull; IT Support</span>
              </p>
            </div>
          </div>

          <div ref={aboutRef} className="px-4 sm:px-8 pt-0 pb-0" style={{ opacity: 0 }}>
            <SectionHeader title="About me" />
            <p className="hidden sm:block text-[1rem] leading-relaxed text-white/80">
              I'm a BSIT graduate focused on software development, business analysis, and IT support. I enjoy building practical applications that solve real problems, improving workflows, and learning new technologies along the way.
            </p>
            <p className="block sm:hidden text-[1rem] leading-relaxed text-white/80">
              BSIT graduate focused on software development, business analysis, and IT support. I enjoy building practical applications and learning new technologies.
            </p>

            <ServicesHighlight />

            <TechStack />
          </div>
        </section>

        <ProjectsSection />

        <ExperienceSection />
        <EducationSection />

        <ContactSection ref={contactSectionRef} />
        <BusinessCardSection />
      </Layout>
    </ToastProvider>
  );
}

export default App;
