import { useEffect, useState } from 'react';
import { Menu, X, Download } from 'lucide-react';
import { profile, certifications } from '../data/portfolio';

const links = [
  'Home',
  'About',
  'Skills',
  'Projects',
  'Experience',
  'Story',
  'Certifications',
  'Contact',
].filter((name) => name !== 'Certifications' || certifications.length);

export default function Navbar({ showResume = false }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        }),
      { rootMargin: '-35% 0px -55% 0px' }
    );
    links.forEach((x) => {
      const el = document.getElementById(x.toLowerCase());
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <header className="navbar">
      <a className="brand" href="#home">JD</a>
      <button
        className="menu-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
      >
        {open ? <X /> : <Menu />}
      </button>
      <nav className={open ? 'nav-links open' : 'nav-links'}>
        {links.map((x) => (
          <a
            key={x}
            className={active === x.toLowerCase() ? 'active' : ''}
            href={'#' + x.toLowerCase()}
            onClick={() => setOpen(false)}
          >
            {x}
          </a>
        ))}
      </nav>
      {showResume && profile.resume && (
        <a className="resume-link" href={profile.resume}>
          <Download size={15} /> Resume
        </a>
      )}
    </header>
  );
}