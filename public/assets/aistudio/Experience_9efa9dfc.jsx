import { internships, education } from '../data/experience';

export default function Experience() {
  return (
    <section id="experience" className="section jd-exp">
      <p className="jd-eyebrow">EXPERIENCE &amp; EDUCATION</p>
      <h2 className="jd-heading">Where I've Worked</h2>

      <div className="jd-exp-grid">
        {internships.map((i) => (
          <article className="jd-card" key={i.company}>
            <div className="jd-card-top">
              <h3>{i.company}</h3>
              <span className="jd-meta">{i.period} · {i.type}</span>
            </div>
            <p className="jd-role">{i.role}</p>
            <ul>
              {i.points.map((p) => <li key={p}>{p}</li>)}
            </ul>
            <div className="jd-tags">
              {i.tags.map((t) => <span key={t}>{t}</span>)}
            </div>
            {i.certificate && (
              <a className="jd-cert-link" href={i.certificate} target="_blank" rel="noreferrer">
                View certificate →
              </a>
            )}
          </article>
        ))}
      </div>

      <h2 className="jd-heading jd-sub">Education</h2>
      <div className="jd-exp-grid">
        {education.map((e) => (
          <article className="jd-card" key={e.school}>
            <div className="jd-card-top">
              <h3>{e.school}</h3>
              <span className="jd-meta">{e.period}</span>
            </div>
            <p className="jd-role">{e.degree}</p>
          </article>
        ))}
      </div>
    </section>
  );
}