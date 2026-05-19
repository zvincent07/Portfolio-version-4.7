import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

export default function Snowflakes() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const numFlakes = 45;
    const container = containerRef.current;

    for (let i = 0; i < numFlakes; i++) {
      const flake = document.createElement('div');
      flake.className = 'absolute rounded-full pointer-events-none select-none';
      
      const size = Math.random() * 4 + 2; // 2px to 6px
      const color = Math.random() > 0.4 ? '#ff4654' : '#ffffff'; // Primary red & white text colors
      const left = Math.random() * 100; // random horizontal starting percentage
      const opacity = Math.random() * 0.5 + 0.3; // 0.3 to 0.8 opacity

      flake.style.width = `${size}px`;
      flake.style.height = `${size}px`;
      flake.style.backgroundColor = color;
      flake.style.left = `${left}%`;
      flake.style.top = `-20px`;
      flake.style.opacity = `${opacity}`;
      flake.style.boxShadow = color === '#ffffff' 
        ? '0 0 8px rgba(255, 255, 255, 0.4)' 
        : '0 0 8px rgba(255, 70, 84, 0.4)';
      
      container.appendChild(flake);

      const duration = Math.random() * 7000 + 6000; // 6s to 13s
      const delay = Math.random() * 8000; // staggered spawn delays
      const drift = Math.random() * 60 - 30; // -30px to 30px horizontal drift sway

      animate(flake, {
        translateY: [0, window.innerHeight + 50],
        translateX: [
          { value: drift * 0.5, duration: duration * 0.3, easing: 'easeInOutSine' },
          { value: -drift * 0.5, duration: duration * 0.3, easing: 'easeInOutSine' },
          { value: drift, duration: duration * 0.4, easing: 'easeInOutSine' }
        ],
        opacity: [
          { value: opacity * 0.4, duration: duration * 0.5, easing: 'easeInOutSine' },
          { value: opacity, duration: duration * 0.5, easing: 'easeInOutSine' }
        ],
        loop: true,
        duration: duration,
        delay: delay,
        easing: 'linear'
      });
    }

    return () => {
      // Clean up DOM on unmount
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none overflow-hidden z-0" 
    />
  );
}
