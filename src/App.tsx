import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'motion/react';
import { Bot } from 'lucide-react';
import About from './components/About';
import Background from './components/Background';
import Certifications, { CertificateModal } from './components/Certifications';
import Contact from './components/Contact';
import Experience from './components/Experience';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import PortfolioAssistant from './components/PortfolioAssistant';
import Projects from './components/Projects';
import Skills from './components/Skills';
import { profile, type CertificateItem } from './data/portfolio';

function useResumeAvailable(url: string) {
  const [available, setAvailable] = useState(Boolean(url));

  useEffect(() => {
    if (!url) {
      setAvailable(false);
      return;
    }
    let cancelled = false;

    const checkResume = async () => {
      try {
        let response = await fetch(url, { method: 'HEAD' });
        if (response.status === 405 || response.status === 501) {
          response = await fetch(url);
        }
        const contentType = response.headers.get('content-type') || '';
        const isAvailable = response.ok && !contentType.includes('text/html');
        if (!cancelled) setAvailable(isAvailable);
      } catch {
        if (!cancelled) setAvailable(false);
      }
    };

    void checkResume();
    return () => {
      cancelled = true;
    };
  }, [url]);

  return available;
}

export default function App() {
  const showResume = useResumeAvailable(profile.resume);
  const [activeCertificate, setActiveCertificate] = useState<CertificateItem | null>(null);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantPrompt, setAssistantPrompt] = useState<string | null>(null);

  const openAssistant = (prompt?: string) => {
    if (prompt) setAssistantPrompt(prompt);
    setAssistantOpen(true);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-[#06080C] text-[#F1F3F8]">
        <Background />
        <Navbar />

        <main>
          <Hero showResume={showResume} onOpenAssistant={openAssistant} />
          <About />
          <Skills />
          <Projects />
          <Experience
            onViewCertificate={setActiveCertificate}
            onOpenAssistant={openAssistant}
          />
          <Certifications onSelectCertificate={setActiveCertificate} />
          <Contact showResume={showResume} />
        </main>

        <footer className="relative z-10 border-t border-white/[0.08] py-8">
          <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-6 text-xs text-[#8C95A8] sm:flex-row">
            <span>© {new Date().getFullYear()} {profile.name}</span>
            <span>Designed &amp; built with curiosity.</span>
            <a
              href="#home"
              className="font-medium text-[#D1D5E0] transition-colors hover:text-white"
            >
              Back to top ↑
            </a>
          </div>
        </footer>

        <button
          type="button"
          onClick={() => openAssistant()}
          aria-label="Open Recruiter AI Assistant"
          className="fixed right-5 bottom-5 z-40 inline-flex items-center gap-2 rounded-xl border border-[#3B82F6]/40 bg-[#0B1120]/95 px-4 py-3 text-xs font-medium text-white shadow-lg backdrop-blur-md transition-colors hover:border-[#60A5FA] hover:bg-[#101A33]"
        >
          <Bot size={16} className="text-[#60A5FA]" />
          <span>Ask AI About Jaya</span>
        </button>

        <AnimatePresence>
          {activeCertificate && (
            <CertificateModal
              item={activeCertificate}
              onClose={() => setActiveCertificate(null)}
            />
          )}
        </AnimatePresence>

        <PortfolioAssistant
          open={assistantOpen}
          onClose={() => setAssistantOpen(false)}
          initialPrompt={assistantPrompt}
          onClearInitialPrompt={() => setAssistantPrompt(null)}
        />
      </div>
    </MotionConfig>
  );
}
