import { useRef, useState } from 'react';
import { toPng, toJpeg } from 'html-to-image';
import SectionHeader from './SectionHeader';
import { SECTION_SHELL } from '../constants/layout';
import QRCode from '../assets/My Portfolio QR code.png';
import profilePic from '../assets/1x1 size picture.png';
import avatarPic from '../assets/Joan of Arc.png';
import { Mail, Globe, MapPin, Phone } from 'lucide-react';

export default function BusinessCardSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadImage = async (format: 'png' | 'jpeg', side: 'front' | 'back' | 'both') => {
    setIsDownloading(true);
    
    const capture = async (element: HTMLElement, filename: string) => {
      try {
        let dataUrl = '';
        const options: any = {
          pixelRatio: 4,
        };
        
        // Only override background for JPEG since it doesn't support transparency
        if (format === 'jpeg') {
          options.backgroundColor = '#0b0f17'; 
        }
        
        if (format === 'png') {
          dataUrl = await toPng(element, options);
        } else {
          dataUrl = await toJpeg(element, options);
        }
        
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error generating image', error);
      }
    };

    if (side === 'front' && frontRef.current) {
      await capture(frontRef.current, `JV_Laylo_Card_Front.${format}`);
    } else if (side === 'back' && backRef.current) {
      await capture(backRef.current, `JV_Laylo_Card_Back.${format}`);
    } else if (side === 'both') {
      if (frontRef.current) await capture(frontRef.current, `JV_Laylo_Card_Front.${format}`);
      if (backRef.current) await capture(backRef.current, `JV_Laylo_Card_Back.${format}`);
    }

    setIsDownloading(false);
  };

  const cardBaseStyle = "relative w-[430px] shrink-0 aspect-[86/54] bg-[#111823] overflow-hidden shadow-2xl border border-white/5 rounded-xl flex flex-col items-center justify-center";
  
  // Custom faint grid background
  const gridBackground = {
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
    backgroundSize: '20px 20px'
  };

  return (
    <section id="business-card" className={SECTION_SHELL}>
      <SectionHeader title="Business Card" />
      <div className="w-full flex flex-col items-center justify-center pb-12 gap-4">
        
        {/* Cards Container */}
        <div className="w-full overflow-x-auto">
          <div ref={containerRef} className="flex flex-col xl:flex-row gap-8 xl:gap-12 items-center justify-center min-w-max w-full px-4 sm:px-8 bg-[#0b0f17] py-8 rounded-none">
          
          {/* FRONT CARD */}
          <div 
            ref={frontRef}
            className={cardBaseStyle}
            style={{
              ...gridBackground,
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
            }}
          >
            {/* Minimalist Accents */}
            <div className="absolute top-0 right-16 w-32 h-1 bg-primary" />
            <div className="absolute bottom-0 left-16 w-32 h-1 bg-primary" />
            <div className="absolute top-0 left-0 w-24 h-24 bg-primary/5 -rotate-45 -translate-x-12 -translate-y-12" />
            
            {/* Logo Center */}
            <div className="flex flex-col items-center z-10">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-primary/70 mb-4 bg-[#111823] flex items-center justify-center p-0.5">
                <img src={avatarPic} alt="Avatar" className="w-full h-full object-cover rounded-full" />
              </div>
              <h2 className="text-[17px] sm:text-[19px] font-bold text-white tracking-[0.15em] uppercase text-center w-full">
                John Vincent G. Laylo
              </h2>
              <p className="text-[9px] sm:text-[10px] font-mono text-white/50 tracking-[0.3em] uppercase mt-1 border-t border-white/10 pt-2 px-6">
                Developer &bull; Business Analyst
              </p>
            </div>
          </div>

          {/* BACK CARD */}
          <div 
            ref={backRef}
            className={cardBaseStyle}
            style={{
              ...gridBackground,
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
            }}
          >
            {/* Diagonal overlay */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-[2px] h-[150%] bg-primary/20 rotate-[20deg] left-1/3 -top-10" />
            </div>

            <div className="flex w-full h-full pl-6 sm:pl-8 z-10">
              {/* Left Column: Info */}
              <div className="flex flex-col justify-center h-full flex-1 pr-4 py-6 sm:py-8">
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-primary shrink-0">
                     <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-[10px] sm:text-[12px] font-bold text-white uppercase tracking-widest leading-tight whitespace-nowrap">
                      John Vincent G. Laylo
                    </h2>
                    <p className="text-[8px] sm:text-[9px] font-bold text-primary uppercase tracking-widest mt-1">
                      Dev & Business Analyst
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3 mt-4">
                  <div className="flex items-center gap-2.5 text-[9px] sm:text-[10px] font-mono text-white/80 tracking-wide">
                    <Phone size={12} className="text-primary shrink-0" />
                    <span>09933758190</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[9px] sm:text-[10px] font-mono text-white/80 tracking-wide">
                    <Mail size={12} className="text-primary shrink-0" />
                    <span>zvincent.dev@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[9px] sm:text-[10px] font-mono text-white/80 tracking-wide">
                    <Globe size={12} className="text-primary shrink-0" />
                    <span>zvincent-4-7.vercel.app</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[9px] sm:text-[10px] font-mono text-white/80 tracking-wide">
                    <MapPin size={12} className="text-primary shrink-0" />
                    <span>Lipa City, Batangas</span>
                  </div>
                </div>
              </div>

              {/* Right Column: QR & Image */}
              <div className="flex flex-col items-center justify-center h-full w-[110px] sm:w-[130px] border-l border-primary/20 bg-primary/[0.05] shrink-0">
                <div className="w-[72px] h-[72px] sm:w-[86px] sm:h-[86px] bg-white rounded-md relative flex items-center justify-center p-[2px] shadow-lg overflow-hidden">
                  <img src={QRCode} alt="QR Code" className="w-full h-full object-cover scale-[1.05]" />
                </div>
                <p className="text-[7px] sm:text-[8px] font-bold text-white/60 tracking-widest mt-3 uppercase text-center leading-relaxed">
                  Scan to view<br/>
                  <span className="text-primary">My Work</span>
                </p>
              </div>
            </div>
          </div>

          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          <button 
            onClick={() => downloadImage('png', 'both')}
            disabled={isDownloading}
            className="px-6 py-2.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg text-sm font-semibold text-primary transition-colors disabled:opacity-50 flex items-center gap-2 shadow-[0_0_15px_rgba(255,70,84,0.1)]"
          >
            {isDownloading ? (
              <span className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            ) : null}
            Download Both (PNG)
          </button>
          <button 
            onClick={() => downloadImage('jpeg', 'both')}
            disabled={isDownloading}
            className="px-6 py-2.5 bg-[#111823] hover:bg-white/5 border border-white/10 rounded-lg text-sm font-semibold text-white/80 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isDownloading ? (
              <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : null}
            Download Both (JPEG)
          </button>
        </div>
      </div>
    </section>
  );
}
