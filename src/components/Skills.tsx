import { motion } from 'motion/react';
import { Code2, Compass, Cpu, Database, Layout, Wrench, type LucideIcon } from 'lucide-react';
import { skills } from '../data/portfolio';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'Programming Languages': Code2,
  'Frontend Development': Layout,
  'Backend & Database': Database,
  'Developer Tools': Wrench,
  'Core Computer Science': Cpu,
  'Currently Exploring': Compass,
};

export default function Skills() {
  return (
    <section
      id="skills"
      className="relative z-10 mx-auto max-w-[1200px] border-t border-white/[0.08] px-6 py-20 lg:py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl"
      >
        <p className="text-sm font-medium text-[#60A5FA]">Skills</p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F8FAFC] sm:text-4xl">
          My Technical Toolkit
        </h2>
      </motion.div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((group, idx) => {
          const CategoryIcon = CATEGORY_ICONS[group.title] ?? Code2;
          return (
            <motion.article
              key={group.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.38,
                delay: idx * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#0B0E15] p-6 transition-colors duration-200 hover:border-white/[0.18]"
            >
              <div>
                <span className="font-mono text-xs text-[#60A5FA] tabular-nums">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div className="mt-2.5 flex items-center gap-2.5">
                  <CategoryIcon
                    size={18}
                    aria-hidden="true"
                    className="shrink-0 text-[#60A5FA]"
                  />
                  <h3 className="font-display text-lg font-semibold text-[#F1F3F8]">
                    {group.title}
                  </h3>
                </div>
              </div>

              <p className="mt-5 border-t border-white/[0.07] pt-4 text-sm leading-relaxed text-[#B2BAC9]">
                {group.items.join(' · ')}
              </p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
