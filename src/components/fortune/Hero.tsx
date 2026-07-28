import styles from './Hero.module.css';

interface HeroProps {
  eyebrow: string;
  title: string[];
  subtitle: string;
}

export function Hero({ eyebrow, title, subtitle }: HeroProps) {
  return (
    <div className={styles.hero}>
      <svg className={styles.constellation} viewBox="0 0 140 140" fill="none">
        <circle cx="70" cy="70" r="20" style={{ stroke: 'var(--gold)' }} strokeWidth="0.5" />
        <circle cx="70" cy="70" r="40" style={{ stroke: 'var(--gold)' }} strokeWidth="0.5" />
        <circle cx="70" cy="70" r="60" style={{ stroke: 'var(--gold)' }} strokeWidth="0.5" />
        <circle cx="70" cy="10" r="1.5" style={{ fill: 'var(--gold)' }} />
        <circle cx="120" cy="45" r="1.5" style={{ fill: 'var(--gold)' }} />
        <circle cx="30" cy="100" r="1.5" style={{ fill: 'var(--gold)' }} />
      </svg>

      <svg className={styles.moon} viewBox="0 0 24 24" fill="none">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" style={{ fill: 'var(--gold)' }} />
      </svg>

      <svg className={styles.mountains} viewBox="0 0 400 90" preserveAspectRatio="none">
        <path d="M0 90 L60 40 L110 65 L170 20 L230 60 L290 35 L340 60 L400 45 L400 90 Z" fill="#0f1626" />
        <path d="M0 90 L40 60 L90 80 L150 50 L210 75 L270 55 L330 78 L400 65 L400 90 Z" fill="#070b16" />
      </svg>

      <div className={styles.content}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.title}>
          {title.map((line, i) => (
            <span key={i}>
              {line}
              {i < title.length - 1 && <br />}
            </span>
          ))}
        </h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
    </div>
  );
}
