import { useEffect, useState } from 'react';
import "./styles/animations.css";
// import Reveal from "./components/Reveal";
import Experience from './components/Experience';
import Journey from './components/Journey';
import {
  ArrowRight,
  ArrowUpRight,
  Download,
  Github,
  Linkedin,
  Mail,
  ExternalLink
} from 'lucide-react';

import Background from './components/Background';
import Navbar from './components/Navbar';
import SectionTitle from './components/SectionTitle';

import {
  profile,
  about,
  skills,
  projects
} from './data/portfolio';

import { createPortal } from 'react-dom';
import { certificateList } from './data/certificates';
import { certificateGroups } from './data/categories';
import './styles/certificates.css';
import './styles/contact.css';


// ==========================================
// RESUME AVAILABILITY CHECK
// ==========================================

function useResumeAvailable(url) {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    if (!url) return;

    let cancelled = false;

    const checkResume = async () => {
      try {
        let response = await fetch(url, { method: 'HEAD' });

        if (response.status === 405 || response.status === 501) {
          response = await fetch(url);
        }

        const contentType = response.headers.get('content-type') || '';

        const isAvailable =
          response.ok && !contentType.includes('text/html');

        if (!cancelled) {
          setAvailable(isAvailable);
        }
      } catch {
        if (!cancelled) setAvailable(false);
      }
    };

    checkResume();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return available;
}


// ==========================================
// SOCIAL LINK COMPONENT
// ==========================================

function Social({ href, children, label }) {
  if (!href) return null;

  const external = /^https?:\/\//.test(href);

  return (
    <a
      className="social"
      href={href}
      aria-label={label}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  );
}


// ==========================================
// 1. HOME / HERO SECTION
// ==========================================

function Hero({ showResume }) {
  return (
    <section className="hero wrap" id="home">

      <div className="hero-copy reveal">

        <span className="eyebrow">
          {profile.greeting}
        </span>

        <h1>
          <i className="word">I Build.</i>{" "}
          <i className="word" style={{ animationDelay: "0.4s" }}>I Solve.</i>
          <br />
          <i className="word" style={{ animationDelay: "0.8s" }}>I Create.</i>
          <br />
          <span>That Matter.</span>
        </h1>
        <h3>{profile.role}</h3>

        <p>{profile.intro}</p>

        <div className="actions">

          <a className="btn primary" href="#projects">
            View My Projects
            <ArrowRight size={17} />
          </a>

          <a className="btn secondary" href="#contact">
            Let's Connect
          </a>

          {showResume && (
            <a
              className="btn secondary"
              href={profile.resume}
              download
            >
              <Download size={16} />
              Download Resume
            </a>
          )}

        </div>

        <div className="hero-meta">

          <div className="socials">

            <Social
              href={profile.github}
              label="GitHub Profile"
            >
              <Github />
            </Social>

            <Social
              href={profile.linkedin}
              label="LinkedIn Profile"
            >
              <Linkedin />
            </Social>

          </div>

          <span className="availability">
            <i />
            Open to Internship Opportunities
          </span>

        </div>

      </div>


      <div className="portrait-area reveal">

        <div className="portrait-glow" />

        <div className="portrait">
          <img
            src="/images/jaya-daripa.jpeg"
            alt="Jaya Daripa - Software Developer"
          />
        </div>

        <span className="float-tag tag-one">React</span>
        <span className="float-tag tag-two">JavaScript</span>
        <span className="float-tag tag-three">Java</span>
        <span className="float-tag tag-four">CSS</span>

      </div>

      <a className="scroll-hint" href="#about">
        Scroll to explore ↓
      </a>

    </section>
  );
}


// ==========================================
// 2. ABOUT SECTION
// ==========================================

function About() {
  return (
    <section className="wrap section" id="about">

      <SectionTitle
        eyebrow="ABOUT ME"
        title="More Than Just Code."
      />

      <div className="about-grid">

        <div>

          <blockquote>{about.quote}</blockquote>

          {about.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}

        </div>

        <div className="facts">

          {about.facts.map(([key, value]) => (
            <div className="glass fact" key={key}>
              <small>{key}</small>
              <b>{value}</b>
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}


// ==========================================
// 3. SKILLS SECTION
// ==========================================

function Skills() {
  return (
    <section className="wrap section" id="skills">

      <SectionTitle
        eyebrow="SKILLS"
        title="My Technical Toolkit"
      />

      <div className="skill-grid">

        {skills.map((skill) => (
          <article className="glass skill" key={skill.title}>

            <div className="skill-title">
              <span>{skill.icon}</span>
              <h3>{skill.title}</h3>
            </div>

            <div className="chips">

              {skill.items.map((item) => (
                <span key={item}>{item}</span>
              ))}

            </div>

          </article>
        ))}

      </div>

    </section>
  );
}


// ==========================================
// 4. PROJECTS SECTION
// ==========================================

function ProjectGallery() {
  const [selected, setSelected] = useState(null);

  // Repeated copies make the sliding loop continuous
  const cards = Array.from({ length: 4 }, () => projects).flat();

  return (
    <div className={`gallery ${selected ? 'paused' : ''}`}>
      <div className="gallery-track">
        {cards.map((project, i) => (
          <button
            type="button"
            key={i}
            className={`gallery-card visual-${(i % projects.length) % 3}`}
            tabIndex={i < projects.length ? 0 : -1}
            aria-hidden={i >= projects.length}
            onClick={() => setSelected(project)}
          >
            <strong>{project.name}</strong>
            <small>{project.subtitle}</small>
          </button>
        ))}
      </div>

      {selected && (
        <div className="gallery-focus" onClick={() => setSelected(null)}>
          <div
            className="gallery-popup"
            onClick={(event) => event.stopPropagation()}
          >
            <strong>{selected.name}</strong>
            <span>{selected.description}</span>

            <div className="chips">
              {selected.stack.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>

            <div className="project-actions">
              {selected.github && (
                <a href={selected.github} target="_blank" rel="noopener noreferrer">
                  <Github size={15} />
                  GitHub
                </a>
              )}

              {selected.demo && (
                <a href={selected.demo} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={15} />
                  Live Demo
                </a>
              )}
            </div>

            <button
              type="button"
              className="btn secondary"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


function Projects() {
  return (
    <section className="wrap section" id="projects">

      <SectionTitle
        eyebrow="SELECTED WORK"
        title="Projects I've Built"
      />

      <ProjectGallery />

    </section>
  );
}


// ==========================================
// 5. CERTIFICATIONS
// ==========================================

const certificateUrl = (file) => `/Certificates/${encodeURIComponent(file)}`;


function CertificateCover({ item }) {
  // An optional "cover" image takes priority over the certificate file
  const file = item.cover || item.file;

  if (/\.(png|jpe?g|webp)$/i.test(file)) {
    return <img src={certificateUrl(file)} alt="" loading="lazy" />;
  }

  return (
    <iframe
      src={`${certificateUrl(file)}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
      title={`${item.name} preview`}
      tabIndex={-1}
    />
  );
}


function CertificateViewer({ item, onClose }) {
  const url = certificateUrl(item.file);

  // Close with the Escape key
  useEffect(() => {
    const onKey = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);

    // Stop the page scrolling behind the popup
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return createPortal(
    <div className="cert-viewer" onClick={onClose}>
      <div
        className="cert-viewer-box"
        role="dialog"
        aria-modal="true"
        aria-label={item.name}
        onClick={(event) => event.stopPropagation()}
      >
        <h3>{item.name}</h3>

        {/\.pdf$/i.test(item.file) ? (
          <iframe src={url} title={item.name} />
        ) : (
          <img src={url} alt={`${item.name} certificate`} />
        )}

        <div className="cert-buttons">
          <a className="btn primary" href={url} target="_blank" rel="noopener noreferrer">
            Open in new tab
          </a>
          <button type="button" className="btn secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}


function CertificateStack({ items }) {
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState(null);
  const [paused, setPaused] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const total = items.length;

  const showNext = () => {
    setLeaving(active);
    setActive((active + 1) % total);
  };

  const showPrevious = () => {
    setLeaving(null);
    setActive((active - 1 + total) % total);
  };

  // Swipe left or right on phones
  const handleSwipe = (event) => {
    if (touchStart === null || total < 2) return;
    const distance = event.changedTouches[0].clientX - touchStart;
    if (distance < -50) showNext();
    if (distance > 50) showPrevious();
    setTouchStart(null);
  };

  // Change the card automatically every 5 seconds
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (paused || viewing || reduced || total < 2) return;

    const timer = setTimeout(showNext, 5000);
    return () => clearTimeout(timer);
  }, [active, paused, viewing]);

  return (
    <div
      className="cert-showcase"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="cert-stack"
        onTouchStart={(event) => setTouchStart(event.touches[0].clientX)}
        onTouchEnd={handleSwipe}
      >
        {items.map((item, i) => {
          const position = (i - active + total) % total;
          const front = position === 0;

          return (
            <article
              className={`cert-card ${i === leaving && total > 1 ? 'leaving' : ''}`}
              key={item.file}
              aria-hidden={!front}
              style={{
                zIndex: total - position,
                transform: `translateY(${-Math.min(position, 2) * 18}px) scale(${1 - Math.min(position, 2) * 0.06})`,
                opacity: position > 2 ? 0 : 1
              }}
            >
              <button
                type="button"
                className="cert-cover"
                aria-label={`View ${item.name} certificate`}
                tabIndex={front ? 0 : -1}
                onClick={() => setViewing(item)}
              >
                {/* Load previews only for the cards that can be seen */}
                {(position < 3 || i === leaving) && <CertificateCover item={item} />}
                <span>Click to view</span>
              </button>

              <span className="cert-tag">{item.subcategory || item.category}</span>
              <h3>{item.name}</h3>

              {(item.issuer || item.date) && (
                <p>{[item.issuer, item.date].filter(Boolean).join(' • ')}</p>
              )}
              {item.description && <p>{item.description}</p>}
              {item.skills && <p><b>Skills:</b> {item.skills}</p>}

              <div className="cert-buttons">
                <button
                  type="button"
                  className="btn primary"
                  tabIndex={front ? 0 : -1}
                  onClick={() => setViewing(item)}
                >
                  View Certificate
                </button>

                {item.verifyLink && (
                  <a
                    className="btn secondary"
                    href={item.verifyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={front ? 0 : -1}
                  >
                    Verify
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {total > 1 && (
        <div className="cert-buttons">
          <button type="button" className="btn secondary" onClick={showPrevious}>
            ← Previous
          </button>
          <span>{active + 1} / {total}</span>
          <button type="button" className="btn secondary" onClick={showNext}>
            Next →
          </button>
        </div>
      )}

      {viewing && (
        <CertificateViewer item={viewing} onClose={() => setViewing(null)} />
      )}
    </div>
  );
}


// Arrange certificates in the order set in categories.js
const grouped = certificateGroups.flatMap(({ category, items }) =>
  items.flatMap(([file, name, subcategory]) => {
    const found = certificateList.find((item) => item.file === file);
    return found ? [{ ...found, name, category, subcategory }] : [];
  })
);

const orderedCertificates = [
  ...grouped,
  // Certificates not listed in categories.js appear at the end
  ...certificateList.filter(
    (item) => !grouped.some((entry) => entry.file === item.file)
  )
];


function Certifications() {
  const [category, setCategory] = useState('All');

  if (!orderedCertificates.length) return null;

  const categories = ['All', ...new Set(orderedCertificates.map((item) => item.category))];
  const inCategory = (name) =>
    orderedCertificates.filter((item) => name === 'All' || item.category === name);

  return (
    <section className="wrap section cert-section" id="certifications">

      <SectionTitle
        eyebrow="CERTIFICATIONS"
        title="Learning, Verified."
      />

      <div className="cert-filters">
        {categories.map((name) => (
          <button
            type="button"
            key={name}
            className={name === category ? 'selected' : ''}
            aria-pressed={name === category}
            onClick={() => setCategory(name)}
          >
            {name} ({inCategory(name).length})
          </button>
        ))}
      </div>

      <CertificateStack key={category} items={inCategory(category)} />

    </section>
  );
}


// ==========================================
// 6. CONTACT SECTION
// ==========================================

function Contact() {
  const [copied, setCopied] = useState(false);

  const links = [
    { name: 'GitHub', href: profile.github, Icon: Github },
    { name: 'LinkedIn', href: profile.linkedin, Icon: Linkedin },
    { name: 'Email', href: profile.email && `mailto:${profile.email}`, Icon: Mail }
  ].filter((link) => link.href);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="wrap section contact" id="contact">

      <SectionTitle
        eyebrow="GET IN TOUCH"
        title="Let's Build Something Together."
        centered
      />

      <p>
        I'm open to internship opportunities, collaboration,
        and meaningful projects. If you have an idea or
        opportunity, I'd love to connect.
      </p>

      <div className="contact-stage">

        {/* Expanding oval rings */}
        <div className="contact-rings" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((ring) => (
            <span key={ring} style={{ animationDelay: `${ring * -1.2}s` }} />
          ))}
        </div>

        <div className="contact-bubbles">
          {links.map(({ name, href, Icon }, i) => (
            <a
              key={name}
              className="contact-bubble"
              href={href}
              target={name === 'Email' ? undefined : '_blank'}
              rel="noopener noreferrer"
            >
              <span
                className="bubble-circle"
                style={{ animationDelay: `${i * 0.25}s` }}
              >
                <Icon size={38} />
              </span>
              <span className="bubble-name">{name}</span>
            </a>
          ))}
        </div>

      </div>

      {profile.email && (
        <div className="contact-actions">
          <a className="btn primary" href={`mailto:${profile.email}`}>
            <Mail size={17} />
            Say Hello
            <ArrowUpRight size={16} />
          </a>

          <button type="button" className="btn secondary" onClick={copyEmail}>
            <span aria-live="polite">
              {copied ? 'Email copied ✓' : 'Copy Email'}
            </span>
          </button>
        </div>
      )}

    </section>
  );
}


// ==========================================
// MAIN APP
// ==========================================

export default function App() {

  const showResume = useResumeAvailable(profile.resume);

  // Scroll reveal animation
  useEffect(() => {

    const elements = document.querySelectorAll('.section, .reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();

  }, []);


  // Cursor glow animation
  useEffect(() => {

    const element = document.querySelector('.cursor-glow');

    if (
      !element ||
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    let animationId;

    const move = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
    };

    const animate = () => {

      x += (targetX - x) * 0.08;
      y += (targetY - y) * 0.08;

      element.style.transform =
        `translate3d(${x - 180}px, ${y - 180}px, 0)`;

      animationId = requestAnimationFrame(animate);
    };

    window.addEventListener('pointermove', move);

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(animationId);
    };

  }, []);


  return (
    <div className="app">

      <Background />

      <Navbar showResume={showResume} />

      <main>

        <Hero showResume={showResume} />

        <About />

        <Skills />

        <Projects />

        <Experience />

        <Journey />

        <Certifications />

        <Contact />

      </main>

      <footer className="footer">

        <span>
          © {new Date().getFullYear()} Jaya Daripa
        </span>

        <span>
          Designed & built with curiosity.
        </span>

        <a href="#home">
          Back to top ↑
        </a>

      </footer>

    </div>
  );
}