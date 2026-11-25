import { story } from '../data/experience';

export default function Journey() {
  return (
    <section id="story" className="section jd-journey">
      <p className="jd-eyebrow">MY STORY</p>
      <h2 className="jd-heading">From Curiosity to Code</h2>

      <ol className="jd-timeline">
        {story.map((s) => (
          <li key={s.title}>
            <span className="jd-when">{s.when}</span>
            <div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <div className="jd-tags">
                {s.tags.map((t) => <span key={t}>{t}</span>)}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}