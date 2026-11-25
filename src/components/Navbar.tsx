import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Skills', href: '#skills', id: 'skills' },
  { label: 'Projects', href: '#projects', id: 'projects' },
  { label: 'Experience', href: '#experience', id: 'experience' },
  { label: 'Certifications', href: '#certifications', id: 'certifications' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('about');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: '-35% 0px -55% 0px' }
    );

    for (const item of NAV_LINKS) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#06080C]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-8 px-6 py-4">
        <a
          href="#home"
          className="font-display text-lg font-semibold tracking-tight text-[#F1F3F8] whitespace-nowrap shrink-0"
        >
          Jaya Daripa
        </a>

        <nav className="hidden md:flex items-center gap-7" aria-label="Primary Navigation">
          {NAV_LINKS.map((item) => {
            const isActive = active === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                className={`relative py-1 text-sm font-medium transition-colors duration-200 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-[#F1F3F8]'
                    : 'text-[#9CA3B4] hover:text-[#F1F3F8]'
                }`}
              >
                {item.label}
                <span
                  className={`absolute inset-x-0 -bottom-[1px] h-[1.5px] bg-[#3B82F6] transition-transform duration-200 origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#2563EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA] whitespace-nowrap shrink-0"
          >
            Let's Connect
          </a>

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-[#F1F3F8] md:hidden"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="border-t border-white/[0.08] bg-[#06080C] px-6 py-4 md:hidden"
          aria-label="Mobile Navigation"
        >
          <div className="flex flex-col gap-3">
            {NAV_LINKS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-medium text-[#D1D5E0] hover:text-white"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-[#3B82F6] px-4 py-2.5 text-sm font-medium text-white"
            >
              Let's Connect
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
