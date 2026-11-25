import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, ExternalLink, Github, Layers, X } from 'lucide-react';
import { projects, type ProjectItem } from '../data/portfolio';

export default function Projects() {
  const [selected, setSelected] = useState<ProjectItem | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!selected) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [selected]);

  return (
    <section id="projects" className="relative z-10 border-t border-white/[0.08]">
      <div className="overflow-hidden border-b border-white/[0.06] bg-[#080B11] py-3">
        <div className="animate-marquee flex items-center gap-8 text-xs font-medium tracking-wide text-[#7E889C]">
          {Array.from({ length: 8 }).map((_, idx) => (
            <span key={idx} className="whitespace-nowrap">
              Selected Work · Foodie React · Life Receipt · GRANTLY · VESTORA · GrowMates
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-6 py-20 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <p className="text-sm font-medium text-[#60A5FA]">Selected Work</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F8FAFC] sm:text-4xl">
              Projects I've Built
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#8C95A8]">
            React applications, 2026 hackathon builds, and full-stack product concepts. Select any card to inspect architecture and highlights.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, idx) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: 0.42,
                delay: idx * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0B0E15] transition-colors duration-200 hover:border-[#3B82F6]/40"
            >
              <button
                type="button"
                onClick={() => setSelected(project)}
                className="relative aspect-[4/3] w-full overflow-hidden bg-[#111622] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]"
                aria-label={`Inspect ${project.name} project details`}
              >
                {!failedImages[project.id] ? (
                  <motion.img
                    src={project.image}
                    alt={`${project.name} — ${project.subtitle}`}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setFailedImages((prev) => ({ ...prev, [project.id]: true }))
                    }
                    initial={{ scale: 1.05 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#111827] to-[#090D16] p-6">
                    <Layers size={28} className="text-[#60A5FA]" />
                    <span className="mt-2 font-display text-base font-semibold text-white">
                      {project.name}
                    </span>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06080C]/85 via-transparent to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between px-5 pb-3.5 text-xs text-white/85">
                  <span>{project.category}</span>
                  <span className="font-mono tabular-nums">{project.year}</span>
                </div>
              </button>

              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#8C95A8] tabular-nums">
                    <span className="text-[#93C5FD]">{project.status}</span>
                    <span aria-hidden="true">·</span>
                    <span>{project.year}</span>
                  </div>

                  <h3 className="mt-2 font-display text-xl font-bold tracking-tight text-[#F8FAFC]">
                    {project.name}
                  </h3>

                  <p className="mt-1 text-sm font-medium text-[#CBD2E1]">
                    {project.subtitle}
                  </p>

                  <p className="mt-3 text-sm leading-relaxed text-[#9CA3B4]">
                    {project.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/[0.07] pt-4">
                  <span className="truncate text-xs text-[#8C95A8]">
                    {project.stack.join(' · ')}
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelected(project)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#60A5FA] transition-colors hover:text-[#93C5FD] whitespace-nowrap shrink-0"
                  >
                    Details
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label={selected.name}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/[0.12] bg-[#0B0E15] p-6 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close project details"
                className="absolute top-5 right-5 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[#9CA3B4] transition-colors hover:border-white/25 hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 text-xs text-[#8C95A8] tabular-nums">
                <span className="text-[#93C5FD]">{selected.status}</span>
                <span aria-hidden="true">·</span>
                <span>{selected.category}</span>
                <span aria-hidden="true">·</span>
                <span>{selected.year}</span>
              </div>

              <h3 className="mt-2 font-display text-2xl font-bold text-[#F8FAFC] sm:text-3xl">
                {selected.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-[#CBD2E1]">
                {selected.subtitle}
              </p>

              <div className="mt-5 aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/[0.08] bg-[#111622]">
                {!failedImages[selected.id] ? (
                  <img
                    src={selected.image}
                    alt={`${selected.name} cover`}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Layers size={32} className="text-[#60A5FA]" />
                  </div>
                )}
              </div>

              <p className="mt-5 text-[15px] leading-relaxed text-[#B2BAC9]">
                {selected.description}
              </p>

              <div className="mt-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8C95A8]">
                  Key Engineering Highlights
                </h4>
                <ul className="mt-3 space-y-2 text-sm text-[#D1D5E0]">
                  {selected.highlights.map((point) => (
                    <li key={point} className="flex items-start gap-2.5">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#60A5FA]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-5">
                <p className="text-xs text-[#9CA3B4]">
                  <span className="text-[#6B7280]">Stack: </span>
                  {selected.stack.join(' · ')}
                </p>

                <div className="flex items-center gap-3">
                  {selected.github && (
                    <a
                      href={selected.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3.5 py-2 text-xs font-medium text-white hover:border-white/30"
                    >
                      <Github size={14} />
                      GitHub
                    </a>
                  )}
                  {selected.demo && (
                    <a
                      href={selected.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#3B82F6] px-3.5 py-2 text-xs font-medium text-white hover:bg-[#2563EB]"
                    >
                      <ExternalLink size={14} />
                      Live Demo
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="inline-flex items-center justify-center rounded-lg border border-white/15 px-4 py-2 text-xs font-medium text-[#F1F3F8] hover:border-white/30"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
