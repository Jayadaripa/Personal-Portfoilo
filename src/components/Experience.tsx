import { motion } from 'motion/react';
import { ArrowUpRight, Bot } from 'lucide-react';
import {
  certificates,
  education,
  internships,
  recruiterPillars,
  story,
  type CertificateItem,
} from '../data/portfolio';

interface ExperienceProps {
  onViewCertificate: (cert: CertificateItem) => void;
  onOpenAssistant: (prompt?: string) => void;
}

export default function Experience({
  onViewCertificate,
  onOpenAssistant,
}: ExperienceProps) {
  const handleOpenCert = (file?: string, title?: string) => {
    if (!file) return;
    const match = certificates.find((c) => c.file === file);
    if (match) {
      onViewCertificate(match);
    } else {
      onViewCertificate({
        id: file,
        name: title || 'Internship Certificate',
        category: 'Internships',
        file,
      });
    }
  };

  return (
    <section
      id="experience"
      className="relative z-10 mx-auto max-w-[1200px] border-t border-white/[0.08] px-6 py-20 lg:py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl"
      >
        <p className="text-sm font-medium text-[#60A5FA]">Experience &amp; Education</p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F8FAFC] sm:text-4xl">
          Where I've Worked
        </h2>
      </motion.div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {internships.map((item, idx) => (
          <motion.article
            key={item.company}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.38,
              delay: idx * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#0B0E15] p-6 transition-colors duration-200 hover:border-white/[0.18]"
          >
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-lg font-semibold text-[#F8FAFC]">
                  {item.company}
                </h3>
                <span className="font-mono text-xs text-[#8C95A8] tabular-nums">
                  {item.period} · {item.type}
                </span>
              </div>

              <p className="mt-1 text-sm font-medium text-[#60A5FA]">{item.role}</p>

              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[#A2AAB9]">
                {item.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/30" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.07] pt-4">
              <span className="text-xs text-[#8C95A8]">{item.tags.join(' · ')}</span>

              {item.certificateFile && (
                <button
                  type="button"
                  onClick={() =>
                    handleOpenCert(item.certificateFile, item.certificateTitle)
                  }
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#60A5FA] transition-colors hover:text-[#93C5FD] whitespace-nowrap shrink-0"
                >
                  View Certificate
                  <ArrowUpRight size={14} />
                </button>
              )}
            </div>
          </motion.article>
        ))}
      </div>

      <div id="story" className="mt-20 border-t border-white/[0.08] pt-16">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#60A5FA]">For Recruiters &amp; Hiring Teams</p>
            <h3 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F8FAFC]">
              Engineering Trajectory &amp; Interview Fit
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#9CA3B4]">
              A quick view into how I progressed from foundational computer science to backend Java development, rapid hackathon shipping, and production-oriented React engineering.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              onOpenAssistant(
                'Give me a 60-second recruiter & hiring manager brief on why Jaya Daripa is a strong candidate for a Software Engineering internship interview.'
              )
            }
            className="inline-flex items-center gap-2 self-start rounded-lg border border-[#3B82F6]/40 bg-[#3B82F6]/10 px-4 py-2.5 text-xs font-medium text-[#93C5FD] transition-colors hover:border-[#3B82F6]/70 hover:bg-[#3B82F6]/20 hover:text-white whitespace-nowrap shrink-0"
          >
            <Bot size={15} />
            Generate AI Recruiter Brief
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {recruiterPillars.map((pillar, idx) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              className="rounded-xl border border-white/[0.08] bg-[#0B0E15] p-6"
            >
              <p className="font-mono text-xs text-[#60A5FA] tabular-nums">{pillar.metric}</p>
              <h4 className="mt-2 font-display text-base font-semibold text-[#F8FAFC]">
                {pillar.title}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-[#9CA3B4]">{pillar.detail}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-sm font-medium text-[#60A5FA]">Academic Credentials</p>
            <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#F8FAFC]">
              Education
            </h3>

            <div className="mt-6 space-y-4">
              {education.map((edu) => (
                <div
                  key={edu.school}
                  className="rounded-xl border border-white/[0.08] bg-[#0B0E15] p-5"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="font-display text-base font-semibold text-[#F8FAFC]">
                      {edu.school}
                    </h4>
                    <span className="font-mono text-xs text-[#8C95A8] tabular-nums">
                      {edu.period}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-[#93C5FD]">{edu.degree}</p>
                  {edu.detail && (
                    <p className="mt-2 text-sm leading-relaxed text-[#9CA3B4]">{edu.detail}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <p className="text-sm font-medium text-[#60A5FA]">Career Progression</p>
            <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#F8FAFC]">
              From Curiosity to Code
            </h3>

            <ol className="mt-6 divide-y divide-white/[0.08] rounded-xl border border-white/[0.08] bg-[#0B0E15]">
              {story.map((step, idx) => (
                <motion.li
                  key={step.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className="p-5 sm:p-6"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <span className="font-mono text-xs text-[#60A5FA]">{step.phase}</span>
                    <span className="font-mono text-xs text-[#8C95A8] tabular-nums shrink-0">
                      {step.when}
                    </span>
                  </div>
                  <h4 className="mt-1.5 font-display text-base font-semibold text-[#F8FAFC]">
                    {step.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-[#A2AAB9]">{step.text}</p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] pt-3 text-xs">
                    <span className="text-[#CBD2E1]">
                      <span className="text-[#6B7280]">Hiring Signal: </span>
                      {step.recruiterTakeaway}
                    </span>
                    <span className="text-[#7E889C]">{step.tags.join(' · ')}</span>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
