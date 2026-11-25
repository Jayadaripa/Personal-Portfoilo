import { motion } from 'motion/react';
import { about } from '../data/portfolio';

export default function About() {
  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 mx-auto max-w-[1200px] border-t border-white/[0.08] px-6 py-20 lg:py-24"
    >
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-[#60A5FA]">About Me</p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F8FAFC] sm:text-4xl">
          More Than Just Code.
        </h2>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="space-y-5 lg:col-span-7">
          <blockquote className="font-display text-xl font-medium leading-snug text-[#F1F3F8] sm:text-2xl">
            “{about.quote}”
          </blockquote>

          <div className="space-y-4 pt-2 text-[15px] leading-[1.7] text-[#A2AAB9]">
            {about.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-xl border border-white/[0.08] bg-[#0B0E15] p-6">
            <h3 className="font-display text-base font-semibold text-[#F1F3F8]">
              Profile Snapshot
            </h3>
            <dl className="mt-4 divide-y divide-white/[0.07]">
              {about.facts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex flex-col gap-1 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <dt className="text-xs font-medium text-[#8C95A8]">{fact.label}</dt>
                  <dd className="text-sm font-medium text-[#E5E9F2] sm:text-right">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
