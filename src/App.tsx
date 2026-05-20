import { useRef, useEffect, useState } from 'react';
import { animate, splitText, stagger, createTimeline } from 'animejs';
import Layout from './layouts/Layout';
import ProjectsSection from './components/ProjectsSection';
import TechStack from './components/TechStack';
import SectionHeader from './components/SectionHeader';
import ExperienceSection from './components/ExperienceSection';
import EducationSection from './components/EducationSection';
import ContactSection from './components/ContactSection';
import { BadgeCheck } from 'lucide-react';
import { SCROLL_MT } from './constants/layout';
import bannerGif from './assets/Jinx Fishbones GIF by League of Legends.gif';
import profilePic from './assets/Joan of Arc.png';
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

  // Initial loading screen & flying avatar transition
  useEffect(() => {
    if (hasLoadedRef.current) return;

    // Start staggered letters animation for "Loading ..."
    const textAnim = animate('.loading-char', {
      translateY: [0, -8, 0],
      opacity: [0.5, 1, 0.5],
      duration: 900,
      delay: stagger(75),
      loop: true,
      easing: 'easeInOutSine'
    });

    const timer = setTimeout(() => {
      if (!loadingAvatarRef.current || !avatarContainerRef.current || !loadingOverlayRef.current) {
        setIsLoading(false);
        hasLoadedRef.current = true;
        return;
      }

      // Stop the letters looping animation
      if (textAnim) {
        textAnim.pause();
      }

      // Measure positions to perform the FLIP fly-in animation
      const targetRect = avatarContainerRef.current.getBoundingClientRect();
      const startRect = loadingAvatarRef.current.getBoundingClientRect();

      if (targetRect.width === 0) {
        // Fallback: fade out text and overlay together if target is not visible (e.g. loaded other routes)
        const fallbackTl = createTimeline();

        fallbackTl.add(loadingTextRef.current!, {
          opacity: 0,
          translateY: 10,
          duration: 300,
          easing: 'easeOutQuad'
        });

        fallbackTl.add('#loading-bg', {
          opacity: 0,
          duration: 500,
          easing: 'easeOutQuad',
          complete: () => {
            setIsLoading(false);
            hasLoadedRef.current = true;
          }
        });
        return;
      }

      const startCenterX = startRect.left + startRect.width / 2;
      const startCenterY = startRect.top + startRect.height / 2;
      const targetCenterX = targetRect.left + targetRect.width / 2;
      const targetCenterY = targetRect.top + targetRect.height / 2;

      const deltaX = targetCenterX - startCenterX;
      const deltaY = targetCenterY - startCenterY;
      const scale = targetRect.width / startRect.width;

      // Prepare target avatar hidden initially
      avatarContainerRef.current.style.opacity = '0';
      avatarContainerRef.current.style.transform = 'scale(0.8)';

      // Create sequential timeline: Text fade -> Bg fade -> Avatar fly
      const mainTl = createTimeline();

      // Step 1: Fade out loading text
      mainTl.add(loadingTextRef.current!, {
        opacity: 0,
        translateY: 15,
        duration: 500,
        easing: 'easeOutQuad'
      });

      // Step 2: Fade out the background to reveal the page contents underneath
      mainTl.add('#loading-bg', {
        opacity: 0,
        duration: 1100,
        easing: 'easeOutQuad'
      });

      // Step 3: Fly the loading avatar to its target layout location
      mainTl.add(loadingAvatarRef.current!, {
        translateX: deltaX,
        translateY: deltaY,
        scale: scale,
        duration: 1500,
        easing: 'cubicBezier(0.22, 1, 0.36, 1)', // Smooth easeOutQuart deceleration
        begin: () => {
          if (avatarContainerRef.current) {
            avatarContainerRef.current.style.opacity = '0';
          }
        },
        complete: () => {
          // Show the real avatar on landing
          if (avatarContainerRef.current) {
            avatarContainerRef.current.style.opacity = '1';
            avatarContainerRef.current.style.transform = 'scale(1)';
          }
          // Remove loading overlay entirely
          setIsLoading(false);
          hasLoadedRef.current = true;
        }
      });
    }, 2200);

    return () => {
      clearTimeout(timer);
      if (textAnim) textAnim.pause();
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
            duration: 700,
            easing: 'easeOutQuart',
          });
        }

        // Only run normal avatar animate if it wasn't just animated by the loader
        if (avatarContainerRef.current && hasLoadedRef.current) {
          animate(avatarContainerRef.current, {
            opacity: [0, 1],
            scale: [0.8, 1],
            duration: 700,
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
                duration: 800,
                delay: 100,
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
            <div
              ref={loadingAvatarRef}
              className="w-[160px] h-[160px] rounded-full bg-slate-800 flex items-center justify-center text-white relative shadow-[0_8px_30px_rgba(0,0,0,0.5)] border-2 border-primary/60 overflow-hidden"
            >
              <img src={profilePic} alt="Loading..." className="w-full h-full object-cover" />
            </div>

            <div
              ref={loadingTextRef}
              className="text-white font-mono text-sm tracking-widest mt-6 flex gap-1 justify-center"
            >
              {"Loading ...".split("").map((char, idx) => (
                <span key={idx} className="loading-char inline-block">
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      <Layout>
        <section id="profile" className={`${SCROLL_MT} mb-0`}>
          <div ref={bannerContainerRef} className="w-full h-[220px] overflow-hidden relative rounded-xl shadow-lg">
            <img
              src={bannerGif}
              alt="Profile Banner"
              className="w-full h-full object-cover block scale-100 [object-position:68%_26%]"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center px-4 sm:px-8 py-0 relative -mt-[60px] z-10 mb-10 md:mb-12">
            <div ref={avatarContainerRef} className="relative w-[120px] h-[120px] flex items-center justify-center shrink-0 sm:mr-8 mb-4 sm:mb-0">
              <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-white relative z-10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] border-2 border-primary/60 overflow-hidden">
                <img src={profilePic} alt="Profile Picture" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-start relative">
              <p ref={textRef} className="text-[1.8rem] m-0 text-white font-bold tracking-[0.06em] leading-[1.35] text-center sm:text-left">
                <span className="relative inline-block pr-7">
                  John Vincent
                  <BadgeCheck ref={badgeRef} className="text-primary fill-white opacity-0 absolute right-0 top-1/2 -translate-y-1/2" size={20} />
                </span>
                <br />
                <span className="text-[1.1rem] text-white/60 font-medium">Dev, Analyst & IT Support</span>
              </p>
            </div>
          </div>

          <div ref={aboutRef} className="px-4 sm:px-8 pt-0 pb-0">
            <SectionHeader title="About me" />
            <p className="hidden sm:block text-[1rem] leading-relaxed text-white/80">
              I am a Developer, Business Analyst, and IT Support professional who bridges technical complexity and business objectives by building scalable, user-focused applications. I leverage AI-powered workflows and modern development practices to deliver reliable and efficient digital solutions.
            </p>
            <p className="block sm:hidden text-[1rem] leading-relaxed text-white/80">
              Developer, Business Analyst, and IT Support professional focused on scalable applications, AI-powered workflows, and user-focused digital solutions.
            </p>

            <TechStack />
          </div>
        </section>

        <ProjectsSection />

        <ExperienceSection />
        <EducationSection />

        <ContactSection ref={contactSectionRef} />
      </Layout>
    </ToastProvider>
  );
}

export default App;
