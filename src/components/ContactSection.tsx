import React, { useState, useEffect, useRef, forwardRef } from 'react';
import emailjs from '@emailjs/browser';
import { Mail, Send, Terminal, Loader2, Copy, Check } from 'lucide-react';
import { animate, stagger, splitText } from 'animejs';
import SectionHeader from './SectionHeader';
import { SECTION_SHELL } from '../constants/layout';
import { useToast } from './Toast';

const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const SERVICE_ID = "service_b5d1aem";
const TEMPLATE_ID = "template_yetzp89";
const PUBLIC_KEY = "F861GsSBkGVMj6g7o";

export const ContactSection = forwardRef<HTMLElement>((_, ref) => {
  const formRef = useRef<HTMLFormElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const letsBuildRef = useRef<HTMLParagraphElement>(null);
  const isSplitRef = useRef(false);
  const animRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const el = letsBuildRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              if (!isSplitRef.current) {
                const { chars } = splitText(el, {
                  chars: { wrap: 'clip' },
                });
                isSplitRef.current = true;

                animRef.current = animate(chars, {
                  y: [
                    { to: ['100%', '0%'] },
                    { to: '-100%', delay: 2000, ease: 'in(3)' }
                  ],
                  duration: 750,
                  ease: 'out(3)',
                  delay: stagger(50),
                  loop: true,
                });
              } else if (animRef.current) {
                animRef.current.play();
              }
            }, 100);
          } else {
            if (animRef.current) {
              animRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (animRef.current) {
        animRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    const el = cardsContainerRef.current;
    if (!el) return;

    const cards = el.querySelectorAll('.contact-card');
    
    cards.forEach((card) => {
      (card as HTMLElement).style.opacity = '0';
      (card as HTMLElement).style.transform = 'translateY(20px)';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(Array.from(cards), {
              opacity: [0, 1],
              translateY: [20, 0],
              delay: stagger(120),
              duration: 700,
              easing: 'easeOutQuart',
            });
          } else {
            cards.forEach((card) => {
              (card as HTMLElement).style.opacity = '0';
              (card as HTMLElement).style.transform = 'translateY(20px)';
            });
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        if (formRef.current && !loading) {
          formRef.current.requestSubmit();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading]);

  const handleCopy = () => {
    navigator.clipboard.writeText("zvincent.dev@gmail.com");
    setCopied(true);
    showToast({ message: 'Email address copied to clipboard.', variant: 'success', duration: 3000 });
    setTimeout(() => setCopied(false), 2000);
  };

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!formRef.current) return;

    try {
      await emailjs.sendForm(
        SERVICE_ID,
        TEMPLATE_ID,
        formRef.current,
        PUBLIC_KEY
      );
      setLoading(false);
      formRef.current.reset();
      showToast({ message: 'Message sent successfully. I will get back to you soon.', variant: 'success' });
    } catch (err: unknown) {
      setLoading(false);
      console.error("EmailJS Error:", err);
      const errorObj =
        typeof err === "object" && err !== null
          ? (err as Record<string, unknown>)
          : null;
      const errText =
        (typeof errorObj?.text === "string" && errorObj.text) ||
        (typeof errorObj?.message === "string" && errorObj.message) ||
        "";
      const status =
        typeof errorObj?.status === "number" ? errorObj.status : undefined;

      const is412 =
        status === 412 ||
        /insufficient authentication scopes|gmail_api|precondition/i.test(
          errText
        );
      if (is412) {
        showToast({ message: 'Email service rejected this request (412). Gmail API settings might be restricted.', variant: 'error' });
      } else if (errText.toLowerCase().includes("invalid")) {
        showToast({ message: 'Invalid form data. Please review your input and try again.', variant: 'error' });
      } else {
        showToast({ message: 'Message failed to send. Try emailing directly instead.', variant: 'error' });
      }
    }
  };

  return (
    <section ref={ref} id="contact" className={SECTION_SHELL}>
      <SectionHeader title="Contact" />
      
      <div className="grid md:grid-cols-2 gap-8 w-full mt-4">
        <div className="flex flex-col justify-between gap-6">
          <div className="space-y-6">
            <p className="text-zinc-400 leading-relaxed text-sm">
              Open to freelance opportunities, internships, and technical consulting.
              <br />
              Based in Batangas, City of Lipa, Philippines (GMT+8).
            </p>

            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex items-center justify-between group hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-500 font-mono">
                    /usr/bin/email
                  </span>
                  <span className="text-sm text-zinc-200 font-bold font-mono">
                    zvincent.dev@gmail.com
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                title="Copy Email"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="flex gap-3">
              <a
                href="https://github.com/zvincent07"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-zinc-900 border border-zinc-800/80 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all text-sm font-medium"
                title="GitHub"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-zinc-900 border border-zinc-800/80 text-zinc-400 hover:text-primary hover:border-primary/30 transition-all text-sm font-medium"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono pt-2">
            <Terminal className="w-4 h-4" />
            <span>
              System Status: <span className="text-emerald-500 font-semibold">Online</span> &amp; Ready
            </span>
          </div>
        </div>

        <form ref={formRef} onSubmit={sendEmail} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-zinc-500 font-mono ml-1">
                var name =
              </label>
              <input
                type="text"
                name="user_name"
                required
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-zinc-200 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-zinc-700 text-sm"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-zinc-500 font-mono ml-1">
                var email =
              </label>
              <input
                type="email"
                name="user_email"
                required
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-zinc-200 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-zinc-700 text-sm"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-zinc-500 font-mono ml-1">
              var message =
            </label>
            <textarea
              name="message"
              required
              rows={4}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 text-zinc-200 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-zinc-700 resize-none text-sm"
              placeholder="Project details or just saying hi..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-lg font-bold transition-all text-sm bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Execute Send</span>
                <span className="text-xs font-normal opacity-70 hidden sm:inline-block ml-1">
                  (Ctrl+Enter)
                </span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* 3-Column Info Sub-grid */}
      <div ref={cardsContainerRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-16">
        {/* Card 1: Availability */}
        <div className="contact-card bg-zinc-900/20 border border-white/5 rounded-xl p-5">
          <h4 className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase mb-3">
            01 / ENGAGEMENT
          </h4>
          <ul className="list-disc pl-4 text-xs text-zinc-400 space-y-2">
            <li>Full-Time Engineering</li>
            <li>Technical Internships</li>
            <li>Freelance Consulting</li>
          </ul>
        </div>

        {/* Card 2: Response SLA */}
        <div className="contact-card bg-zinc-900/20 border border-white/5 rounded-xl p-5">
          <h4 className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase mb-3">
            02 / RESPONSE SLA
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Typically responds within 12 hours. For urgent project handoffs or development pipelines, direct email is preferred.
          </p>
        </div>

        {/* Card 3: Tech Focus */}
        <div className="contact-card bg-zinc-900/20 border border-white/5 rounded-xl p-5">
          <h4 className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase mb-3">
            03 / CURRENT STACK FOCUS
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed mb-3">
            Active frameworks and technologies currently being deployed:
          </p>
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2 py-0.5 rounded bg-zinc-800/40 border border-white/5 text-[10px] font-mono text-zinc-300">
              Next.js 15
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-800/40 border border-white/5 text-[10px] font-mono text-zinc-300">
              Tauri/Rust
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-800/40 border border-white/5 text-[10px] font-mono text-zinc-300">
              PostgreSQL
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-800/40 border border-white/5 text-[10px] font-mono text-zinc-300">
              Tailwind
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-16 mb-4">
        <p ref={letsBuildRef} className="text-3xl md:text-4xl font-extrabold font-mono tracking-wider text-white/90 text-center">
          Let's build something.
        </p>
      </div>
    </section>
  );
});

ContactSection.displayName = 'ContactSection';
export default ContactSection;
