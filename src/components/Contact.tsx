import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  Check,
  Code2,
  Copy,
  Download,
  Github,
  Linkedin,
  Mail,
} from 'lucide-react';
import { profile } from '../data/portfolio';

interface ContactProps {
  showResume: boolean;
}

export default function Contact({ showResume }: ContactProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 mx-auto max-w-[1200px] border-t border-white/[0.08] px-6 py-20 lg:py-24"
    >
      <div className="rounded-2xl border border-white/[0.09] bg-[#0B0E15] p-8 sm:p-12 lg:p-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-sm font-medium text-[#60A5FA]">Get In Touch</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F8FAFC] sm:text-4xl">
              Let's Build Something Together.
            </h2>
            <p className="mt-4 max-w-[54ch] text-base leading-relaxed text-[#9CA3B4]">
              I'm open to software and frontend engineering internship opportunities,
              technical interviews, and meaningful collaborations. Reach out directly or
              download my resume below.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 rounded-lg bg-[#3B82F6] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#2563EB] whitespace-nowrap shrink-0"
              >
                <Mail size={16} />
                Say Hello
                <ArrowUpRight size={15} />
              </a>

              {showResume && (
                <a
                  href={profile.resume}
                  download="Jaya_Daripa_Resume.pdf"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-medium text-[#F1F3F8] transition-colors hover:border-white/30 hover:bg-white/[0.08] whitespace-nowrap shrink-0"
                >
                  <Download size={16} />
                  Download Resume
                </a>
              )}

              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-medium text-[#F1F3F8] transition-colors hover:border-white/30 hover:bg-white/[0.06] whitespace-nowrap shrink-0"
              >
                {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                <span aria-live="polite">
                  {copied ? 'Email Copied' : 'Copy Email'}
                </span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="divide-y divide-white/[0.08] rounded-xl border border-white/[0.08] bg-[#070A10]">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-white/[0.03]"
              >
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-[#60A5FA]" />
                  <div>
                    <p className="text-xs text-[#8C95A8]">Email</p>
                    <p className="text-sm font-medium text-[#F1F3F8]">{profile.email}</p>
                  </div>
                </div>
                <ArrowUpRight size={16} className="text-[#6E778B]" />
              </a>

              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-white/[0.03]"
              >
                <div className="flex items-center gap-3">
                  <Github size={18} className="text-[#60A5FA]" />
                  <div>
                    <p className="text-xs text-[#8C95A8]">GitHub</p>
                    <p className="text-sm font-medium text-[#F1F3F8]">github.com/Jayadaripa</p>
                  </div>
                </div>
                <ArrowUpRight size={16} className="text-[#6E778B]" />
              </a>

              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-white/[0.03]"
              >
                <div className="flex items-center gap-3">
                  <Linkedin size={18} className="text-[#60A5FA]" />
                  <div>
                    <p className="text-xs text-[#8C95A8]">LinkedIn</p>
                    <p className="text-sm font-medium text-[#F1F3F8]">Jaya Daripa</p>
                  </div>
                </div>
                <ArrowUpRight size={16} className="text-[#6E778B]" />
              </a>

              <a
                href={profile.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-white/[0.03]"
              >
                <div className="flex items-center gap-3">
                  <Code2 size={18} className="text-[#60A5FA]" />
                  <div>
                    <p className="text-xs text-[#8C95A8]">LeetCode</p>
                    <p className="text-sm font-medium text-[#F1F3F8]">leetcode.com/u/Jaya_Daripa</p>
                  </div>
                </div>
                <ArrowUpRight size={16} className="text-[#6E778B]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
