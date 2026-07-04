import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import dashboardImg from '../assets/dayframe/dashboard.png';
import newsImg from '../assets/dayframe/news.png';
import browserImg from '../assets/dayframe/browser.png';
import todayImg from '../assets/dayframe/today.png';
import journalImg from '../assets/dayframe/journal.png';
import workoutImg from '../assets/dayframe/workout.png';
import bookmarksImg from '../assets/dayframe/bookmarks.png';
import profileImg from '../assets/dayframe/profile.png';
import preferencesImg from '../assets/dayframe/preferences.png';

interface Slide {
  src: string;
  alt: string;
  description: string;
}

const slides: Slide[] = [
  { src: dashboardImg, alt: 'Dashboard', description: 'The main command center giving a complete overview of daily productivity metrics and active widgets.' },
  { src: newsImg, alt: 'News', description: 'Aggregated news feed keeping you updated with tailored topics without leaving the application.' },
  { src: browserImg, alt: 'Browser', description: 'Integrated lightweight browser ensuring seamless workflow context without tab switching.' },
  { src: todayImg, alt: 'Today', description: 'Focused view on today\'s priorities, tasks, and scheduling for optimal time management.' },
  { src: journalImg, alt: 'Journal', description: 'Distraction-free environment for daily reflections and notes.' },
  { src: workoutImg, alt: 'Workout', description: 'Activity tracker designed to monitor physical routines alongside your productivity.' },
  { src: bookmarksImg, alt: 'Bookmarks', description: 'Quick access repository for saved links and crucial resources.' },
  { src: profileImg, alt: 'Profile', description: 'User profile management and stats overview. NOTE: Contains highly classified admin features.' },
  { src: preferencesImg, alt: 'Preferences', description: 'Deeply customizable settings to tailor the experience to individual workflows.' },
];

interface ProjectCarouselModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectCarouselModal({ isOpen, onClose }: ProjectCarouselModalProps) {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCurrentIndex(0); // reset on open
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const currentSlide = slides[currentIndex];

  return createPortal(
    <div 
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 sm:top-8 sm:right-8 text-white/50 hover:text-white transition-colors focus:outline-none z-10"
        title="Close"
      >
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 sm:w-10 sm:h-10">
           <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
         </svg>
      </button>

      <div 
        className="relative w-full max-w-6xl flex flex-col items-center justify-center bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-[60vh] sm:h-[70vh] bg-black/50 flex items-center justify-center group">
          <img 
            src={currentSlide.src} 
            alt={currentSlide.alt} 
            className="w-full h-full object-contain" 
          />
          
          <button 
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
        
        <div className="w-full p-6 text-center border-t border-white/10">
          <h3 className="text-xl font-bold text-white mb-2">{currentSlide.alt}</h3>
          <p className="text-zinc-400 max-w-3xl mx-auto text-sm leading-relaxed">{currentSlide.description}</p>
          <div className="flex justify-center gap-2 mt-4">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentIndex ? 'bg-primary' : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
