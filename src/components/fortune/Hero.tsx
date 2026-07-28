import styles from './Hero.module.css';

interface HeroProps {
  eyebrow: string;
  title: string[];
  subtitle: string;
}

export function Hero({ eyebrow, title, subtitle }: HeroProps) {
  return (
    <div className={styles.hero}>
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
