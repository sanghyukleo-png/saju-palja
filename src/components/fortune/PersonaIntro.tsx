import { PERSONA } from '../../data/sajuKnowledge';
import styles from './PersonaIntro.module.css';

export function PersonaIntro() {
  return (
    <div className={styles.wrap}>
      <div className={styles.avatar}>靑雲</div>
      <div>
        <p className={styles.name} style={{ margin: 0 }}>{PERSONA.name}</p>
        <p className={styles.role} style={{ margin: 0 }}>{PERSONA.role}</p>
      </div>
    </div>
  );
}
