import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Bot,
  Code2,
  Download,
  Github,
  Linkedin,
  User,
} from 'lucide-react';
import { heroHighlights, profile } from '../data/portfolio';

interface HeroProps {
  showResume: boolean;
  onOpenAssistant: (prompt?: string) => void;
}

const HEADLINE_WORDS = ['I Build.', 'I Solve.', 'I Create.'];

export default function Hero({ showResume, onOpenAssistant }: HeroProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <section
      id="home"
      className="relative z-10 mx-auto max-w-[1200px] px-6 pt-12 pb-20 lg:pt-16 lg:pb-24"
    >
      <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="flex flex-col justify-between lg:col-span-7">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm font-medium tracking-wide text-[#60A5FA]"
            >
              {profile.kicker}
            </motion.p>

            <h1 className="mt-4 font-display text-[clamp(2.5rem,4.5vw,4.1rem)] font-bold leading-[1.08] tracking-tight text-[#F8FAFC]">
              <span className="flex flex-wrap gap-x-3">
                {HEADLINE_WORDS.map((word, idx) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.48,
                      delay: 0.08 + idx * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.52,
                  delay: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="mt-1 inline-block bg-gradient-to-r from-[#60A5FA] via-[#93C5FD] to-[#60A5FA] bg-[length:200%_auto] bg-clip-text text-transparent"
              >
                That Matter.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 text-lg font-medium text-[#D5DAE6]"
            >
              {profile.role}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.56, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 max-w-[60ch] text-base leading-relaxed text-[#9CA3B4]"
            >
              {profile.intro}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.64, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-wrap items-center gap-3.5"
            >
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-lg bg-[#3B82F6] px-5 py-3 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#2563EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA] whitespace-nowrap shrink-0"
              >
                View My Projects
                <ArrowRight size={16} />
              </a>

              {showResume && (
                <a
                  href={profile.resume}
                  download="Jaya_Daripa_Resume.pdf"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-medium text-[#F1F3F8] transition-colors duration-150 hover:border-white/30 hover:bg-white/[0.08] whitespace-nowrap shrink-0"
                >
                  <Download size={16} />
                  Download Resume
                </a>
              )}

              <button
                type="button"
                onClick={() => onOpenAssistant()}
                className="inline-flex items-center gap-2 rounded-lg border border-[#3B82F6]/40 bg-[#3B82F6]/10 px-5 py-3 text-sm font-medium text-[#93C5FD] transition-colors duration-150 hover:border-[#3B82F6]/70 hover:bg-[#3B82F6]/20 hover:text-white whitespace-nowrap shrink-0"
              >
                <Bot size={16} />
                Ask AI About Me
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.72 }}
            className="mt-10 flex flex-wrap items-center gap-5 border-t border-white/[0.08] pt-6 text-sm text-[#9CA3B4]"
          >
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="inline-flex items-center gap-2 text-[#D1D5E0] transition-colors hover:text-white whitespace-nowrap shrink-0"
              >
                <Github size={16} />
                <span>GitHub</span>
              </a>
              <span aria-hidden="true" className="text-white/20">/</span>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="inline-flex items-center gap-2 text-[#D1D5E0] transition-colors hover:text-white whitespace-nowrap shrink-0"
              >
                <Linkedin size={16} />
                <span>LinkedIn</span>
              </a>
              <span aria-hidden="true" className="text-white/20">/</span>
              <a
                href={profile.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LeetCode Profile"
                className="inline-flex items-center gap-2 text-[#D1D5E0] transition-colors hover:text-white whitespace-nowrap shrink-0"
              >
                <Code2 size={16} />
                <span>LeetCode</span>
              </a>
            </div>
            <span aria-hidden="true" className="hidden sm:inline text-white/20">·</span>
            <span className="text-[#D1D5E0]">{profile.availability}</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative lg:col-span-5"
        >
          <motion.div
            animate={{ opacity: [0.35, 0.65, 0.35], scale: [0.98, 1.02, 0.98] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
            className="pointer-events-none absolute -inset-3 rounded-3xl bg-[#3B82F6]/15 blur-2xl"
          />

          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-full min-h-[400px] overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0D1017]"
          >
            {!imgError ? (
              <motion.img
                src={profile.heroImage}
                alt="Jaya Daripa — Computer Science Engineering Student and Software Developer"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                initial={{ scale: 1.06 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="h-full w-full object-cover object-top"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#0F172A] via-[#0B101B] to-[#06080C] p-8 text-center">
                <User size={40} className="text-[#60A5FA]" />
                <p className="mt-4 font-display text-lg font-semibold text-white">Jaya Daripa</p>
                <p className="mt-1 text-sm text-[#9CA3B4]">Software Development &amp; Engineering</p>
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06080C]/90 via-[#06080C]/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="font-mono text-xs uppercase tracking-wider text-[#93C5FD]">
                Jaya Daripa · Class of 2028
              </p>
              <p className="mt-1.5 text-sm font-medium text-white/95">
                Java · Python · React · JavaScript · SQL
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4"
      >
        {heroHighlights.map((item) => (
          <div key={item.label} className="bg-[#0A0D14] px-6 py-5">
            <p className="text-xs font-medium text-[#8C95A8]">{item.label}</p>
            <p className="mt-1.5 font-display text-base font-semibold tracking-tight text-[#F1F3F8] tabular-nums">
              {item.value}
            </p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
